from django.contrib import admin
from django.urls import include, path

handler404 = "contact.handlers.not_found"
handler500 = "contact.handlers.server_error"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("contact.urls")),
    path("", include("contact.urls")),
]