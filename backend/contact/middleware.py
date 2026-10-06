from django.http import HttpResponse

from .config import cors_origins


class ApiMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        origin = request.META.get("HTTP_ORIGIN", "")
        allowed = origin in cors_origins()

        if request.method == "OPTIONS":
            response = HttpResponse(status=204)
            self._apply_cors(response, origin, allowed)
            return response

        response = self.get_response(request)
        self._apply_cors(response, origin, allowed)

        return response

    @staticmethod
    def _apply_cors(response, origin, allowed):
        if not origin or not allowed:
            return

        response["Access-Control-Allow-Origin"] = origin
        response["Vary"] = "Origin"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        response["Access-Control-Max-Age"] = "86400"