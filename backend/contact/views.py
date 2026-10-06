import logging
import smtplib
import time
from email.message import EmailMessage

from django.utils import timezone
from rest_framework.exceptions import ParseError
from rest_framework.response import Response
from rest_framework.views import APIView

from .config import client_ip, config_from_env
from .models import Inquiry, ThrottleHit
from .serializers import InquirySerializer, PROJECT_TYPES

logger = logging.getLogger(__name__)

ACCEPTED = {"id": 0, "detail": "Message received."}


class ContactView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        config = config_from_env()
        ip = client_ip(request)

        if self._throttled(ip, config["throttle_per_hour"]):
            return Response({"detail": "Request was throttled."}, status=429)

        try:
            data = request.data
        except ParseError:
            return Response({"detail": "Malformed JSON body."}, status=400)

        if not isinstance(data, dict):
            return Response({"detail": "Malformed JSON body."}, status=400)

        honeypot = str(data.get(config["honeypot_field"], "")).strip()
        if honeypot:
            return Response(ACCEPTED, status=201)

        rendered_at = int(data.get("rendered_at") or 0)
        elapsed = time.time() - rendered_at
        if rendered_at > 0 and 0 <= elapsed < config["min_seconds_on_form"]:
            return Response(ACCEPTED, status=201)

        serializer = InquirySerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        validated = serializer.validated_data
        inquiry = Inquiry.objects.create(
            name=validated["name"],
            email=validated["email"],
            org=validated.get("org", ""),
            project_type=validated.get("project_type", ""),
            brief=validated["brief"],
        )

        self._notify(config, inquiry)

        return Response({"id": inquiry.id, "detail": "Message received."}, status=201)

    def _throttled(self, ip, limit):
        ThrottleHit.objects.create(ip=ip)

        cutoff = timezone.now() - timezone.timedelta(hours=1)
        count = ThrottleHit.objects.filter(ip=ip, created_at__gte=cutoff).count()

        return count > limit

    def _notify(self, config, inquiry):
        recipient = config["notify_email"]

        if not recipient:
            return

        label = dict(PROJECT_TYPES).get(inquiry.project_type, "-")

        message = EmailMessage()
        message["Subject"] = config["notify_subject"]
        message["From"] = self._sender_address(config, recipient)
        message["To"] = recipient
        message.set_content(
            "\n".join([
                f"Name: {inquiry.name}",
                f"Email: {inquiry.email}",
                f"Organisation: {inquiry.org or '-'}",
                f"Looking to build: {label}",
                "",
                "Brief:",
                inquiry.brief,
            ])
        )

        try:
            with smtplib.SMTP(os.environ.get("CONTACT_SMTP_HOST", "localhost"), int(os.environ.get("CONTACT_SMTP_PORT", "25"))) as smtp:
                smtp.send_message(message)
        except Exception:
            logger.warning("Could not send the inquiry notification email.", exc_info=True)

    def _sender_address(self, config, recipient):
        configured = config["notify_from_email"]

        if configured:
            return configured

        host = recipient.rsplit("@", 1)[-1]

        return f"no-reply@{host}"


class HealthView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        Inquiry.objects.exists()
        return Response({"status": "ok"})


def service_info(request):
    return {
        "service": "Avodah Studio contact API",
        "endpoints": ["POST /api/contact/", "GET /api/health/"],
    }