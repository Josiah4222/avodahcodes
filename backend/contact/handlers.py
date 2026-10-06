from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def service_info(request):
    return JsonResponse({
        "service": "Avodah Studio contact API",
        "endpoints": ["POST /api/contact/", "GET /api/health/"],
    })


def not_found(request, exception=None):
    return JsonResponse({"detail": "Not found."}, status=404)


def server_error(request):
    return JsonResponse({"detail": "Server error. Please try again later."}, status=500)