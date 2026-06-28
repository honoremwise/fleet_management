from django.contrib.auth.models import User
from rest_framework import serializers
from fleet.models import Driver


class RegisterDriverSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    email = serializers.EmailField()

    phone = serializers.CharField(max_length=20)
    license_number = serializers.CharField(max_length=100)
    address = serializers.CharField(max_length=255)

    # -----------------------------
    # VALIDATIONS
    # -----------------------------
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "A user with this username already exists."
            )
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )
        return value

    def validate_license_number(self, value):
        if Driver.objects.filter(license_number=value).exists():
            raise serializers.ValidationError(
                "This license number is already registered."
            )
        return value

    # -----------------------------
    # CREATE DRIVER
    # -----------------------------
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            email=validated_data["email"],
        )

        driver = Driver.objects.create(
            user=user,
            phone=validated_data["phone"],
            license_number=validated_data["license_number"],
            address=validated_data["address"],
        )

        return driver