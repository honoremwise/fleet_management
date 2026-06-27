from django.db import models
from django.contrib.auth.models import User


class Vehicle(models.Model):
    STATUS_CHOICES = [
        ("available", "Available"),
        ("maintenance", "Maintenance"),
        ("in_trip", "In Trip"),
    ]

    plate_number = models.CharField(max_length=20, unique=True)
    manufacturer = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="available"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["plate_number"]

    def __str__(self):
        return self.plate_number


class Driver(models.Model):
    STATUS_CHOICES = [
        ("available", "Available"),
        ("on_trip", "On Trip"),
        ("off_duty", "Off Duty"),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="driver_profile"
    )

    phone = models.CharField(max_length=20)
    license_number = models.CharField(max_length=100, unique=True)
    address = models.CharField(max_length=255)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="available"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["user__first_name"]

    def __str__(self):
        return self.user.get_full_name()


class Route(models.Model):
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    distance_km = models.DecimalField(max_digits=8, decimal_places=2)
    estimated_duration = models.CharField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["origin"]

    def __str__(self):
        return f"{self.origin} → {self.destination}"


class Trip(models.Model):
    STATUS_CHOICES = [
        ("planned", "Planned"),
        ("ongoing", "Ongoing"),
        ("completed", "Completed"),
    ]

    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="trips"
    )

    driver = models.ForeignKey(
        Driver,
        on_delete=models.CASCADE,
        related_name="trips"
    )

    route = models.ForeignKey(
        Route,
        on_delete=models.CASCADE,
        related_name="trips"
    )

    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="planned"
    )

    remarks = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-departure_time"]

    def __str__(self):
        return (
            f"{self.vehicle.plate_number} | "
            f"{self.driver.user.get_full_name()} | "
            f"{self.status}"
        )


class VehicleInspection(models.Model):
    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="inspections"
    )

    photo = models.ImageField(
        upload_to="vehicle_inspections/"
    )

    inspection_date = models.DateField(auto_now_add=True)

    remarks = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-inspection_date"]

    def __str__(self):
        return f"{self.vehicle.plate_number} Inspection ({self.inspection_date})"