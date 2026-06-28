from rest_framework import serializers

from fleet.models import (
    Vehicle,
    Driver,
    Route,
    Trip,
    VehicleInspection,
)


# ==========================================
# Vehicle
# ==========================================

class VehicleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vehicle
        fields = "__all__"


# ==========================================
# Vehicle Inspection
# ==========================================

class VehicleInspectionSerializer(serializers.ModelSerializer):

    vehicle_plate = serializers.CharField(
        source="vehicle.plate_number",
        read_only=True
    )

    class Meta:
        model = VehicleInspection
        fields = "__all__"


# ==========================================
# Driver
# ==========================================

class DriverSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source="user.username"
    )

    first_name = serializers.CharField(
        source="user.first_name"
    )

    last_name = serializers.CharField(
        source="user.last_name"
    )

    email = serializers.EmailField(
        source="user.email"
    )

    driver_name = serializers.CharField(
        source="user.get_full_name",
        read_only=True
    )

    class Meta:
        model = Driver
        fields = [
            "id",
            "user",
            "username",
            "first_name",
            "last_name",
            "email",
            "driver_name",
            "phone",
            "license_number",
            "address",
            "status",
        ]

    def update(self, instance, validated_data):

        user_data = validated_data.pop("user", {})

        user = instance.user

        user.username = user_data.get(
            "username",
            user.username
        )

        user.first_name = user_data.get(
            "first_name",
            user.first_name
        )

        user.last_name = user_data.get(
            "last_name",
            user.last_name
        )

        user.email = user_data.get(
            "email",
            user.email
        )

        user.save()

        instance.phone = validated_data.get(
            "phone",
            instance.phone
        )

        instance.license_number = validated_data.get(
            "license_number",
            instance.license_number
        )

        instance.address = validated_data.get(
            "address",
            instance.address
        )

        instance.status = validated_data.get(
            "status",
            instance.status
        )

        instance.save()

        return instance


# ==========================================
# Route
# ==========================================

class RouteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Route
        fields = "__all__"


# ==========================================
# Trip
# ==========================================

class TripSerializer(serializers.ModelSerializer):

    vehicle_plate = serializers.CharField(
        source="vehicle.plate_number",
        read_only=True
    )

    driver_name = serializers.CharField(
        source="driver.user.get_full_name",
        read_only=True
    )

    route_name = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        fields = "__all__"

    def get_route_name(self, obj):
        return f"{obj.route.origin} → {obj.route.destination}"