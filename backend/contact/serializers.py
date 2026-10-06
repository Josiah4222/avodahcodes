from rest_framework import serializers

from .models import Inquiry

PROJECT_TYPES = [
    ("website", "Website"),
    ("business_system", "Business System"),
    ("product", "Product"),
    ("not_sure", "Not sure yet"),
]


class InquirySerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        max_length=254,
        error_messages={
            "blank": "This field is required.",
        },
    )

    project_type = serializers.ChoiceField(
        choices=PROJECT_TYPES,
        required=False,
        allow_blank=True,
        error_messages={
            "invalid_choice": "Select a valid project type.",
        },
    )

    class Meta:
        model = Inquiry
        fields = ["name", "email", "org", "project_type", "brief"]
        extra_kwargs = {
            "name": {
                "min_length": 2,
                "max_length": 120,
                "error_messages": {
                    "blank": "This field is required.",
                    "min_length": "Please enter your name.",
                    "max_length": "Ensure this field has no more than 120 characters.",
                },
            },
            "org": {
                "max_length": 160,
                "required": False,
                "allow_blank": True,
                "error_messages": {
                    "max_length": "Ensure this field has no more than 160 characters.",
                },
            },
            "brief": {
                "min_length": 10,
                "max_length": 5000,
                "error_messages": {
                    "blank": "This field is required.",
                    "min_length": "Please tell us a little more about the project.",
                    "max_length": "Ensure this field has no more than 5000 characters.",
                },
            },
        }