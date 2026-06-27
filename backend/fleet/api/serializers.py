from rest_framework import serializers
from fleet.models import (
    Vehicle,
    Driver,
    Route,
    Trip,
    VehicleInspection,
)


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = "__all__"


class VehicleInspectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleInspection
        fields = "__all__"


class DriverSerializer(serializers.ModelSerializer):
    driver_name = serializers.CharField(
        source="user.get_full_name",
        read_only=True
    )

    class Meta:
        model = Driver
        fields = "__all__"


class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = "__all__"


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