from django.contrib import admin

from .models import Inquiry, ThrottleHit


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "email", "org", "project_type", "is_handled", "created_at")
    list_display_links = ("id", "name")
    list_filter = ("project_type", "is_handled", "created_at")
    search_fields = ("name", "email", "org", "brief")
    ordering = ("-created_at",)
    date_hierarchy = "created_at"
    readonly_fields = ("id", "name", "email", "org", "project_type", "brief", "created_at")

    def has_add_permission(self, request):
        return False


@admin.register(ThrottleHit)
class ThrottleHitAdmin(admin.ModelAdmin):
    list_display = ("ip", "created_at")
    list_filter = ("created_at",)
    ordering = ("-created_at",)
    readonly_fields = ("ip", "created_at")

    def has_add_permission(self, request):
        return False