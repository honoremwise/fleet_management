from django.contrib import admin
from .models import (
    Vehicle,
    VehicleInspection,
    Driver,
    Route,
    Trip,
)

admin.site.register(Vehicle)
admin.site.register(VehicleInspection)
admin.site.register(Driver)
admin.site.register(Route)
admin.site.register(Trip)