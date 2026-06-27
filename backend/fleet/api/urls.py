from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    VehicleViewSet,
    VehicleInspectionViewSet,
    DriverViewSet,
    RouteViewSet,
    TripViewSet,
    RegisterDriverView,
    LoginView,
    LogoutView,
)

router = DefaultRouter()

router.register("vehicles", VehicleViewSet)
router.register("drivers", DriverViewSet)
router.register("routes", RouteViewSet)
router.register("trips", TripViewSet)
router.register(
    "vehicle-inspections",
    VehicleInspectionViewSet
)
urlpatterns = [
    path("register-driver/", RegisterDriverView.as_view(), name="register-driver"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
]

urlpatterns += router.urls


#dcc2b8949a2fdd06119939ca29600a37ed38fe55