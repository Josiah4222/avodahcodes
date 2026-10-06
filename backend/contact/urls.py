from django.urls import path

from .handlers import service_info
from .views import ContactView, HealthView

urlpatterns = [
    path("", service_info),
    path("contact", ContactView.as_view()),
    path("contact/", ContactView.as_view()),
    path("health", HealthView.as_view()),
    path("health/", HealthView.as_view()),
]