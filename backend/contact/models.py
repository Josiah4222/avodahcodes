from django.db import models


class Inquiry(models.Model):
    class Meta:
        db_table = "inquiries"
        managed = False

    name = models.CharField(max_length=120)
    email = models.CharField(max_length=254)
    org = models.CharField(max_length=160, blank=True, default="")
    project_type = models.CharField(max_length=32, blank=True, default="")
    brief = models.TextField()
    is_handled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class ThrottleHit(models.Model):
    class Meta:
        db_table = "throttle_hits"
        managed = False

    ip = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)