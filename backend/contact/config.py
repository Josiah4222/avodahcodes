import os

from django.conf import settings


def client_ip(request):
    return request.META.get("REMOTE_ADDR") or "unknown"


def cors_origins():
    if settings.DEBUG:
        return ["http://localhost:4200", "http://127.0.0.1:4200"]
    return [
        origin.strip()
        for origin in os.environ.get("CONTACT_CORS_ORIGINS", "").split(",")
        if origin.strip()
    ]


def config_from_env():
    return {
        "throttle_per_hour": int(os.environ.get("CONTACT_THROTTLE_PER_HOUR", "30")),
        "notify_email": os.environ.get("CONTACT_NOTIFY_EMAIL", ""),
        "notify_subject": os.environ.get("CONTACT_NOTIFY_SUBJECT", "New inquiry from avodah.studio"),
        "notify_from_email": os.environ.get("CONTACT_NOTIFY_FROM", ""),
        "honeypot_field": "company_website",
        "min_seconds_on_form": int(os.environ.get("CONTACT_MIN_FORM_SECONDS", "2")),
    }