from django.db.models import Q
from django.contrib.auth import authenticate

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token

from fleet.models import (
    Vehicle,
    Driver,
    Route,
    Trip,
    VehicleInspection,
)

from .serializers import (
    VehicleSerializer,
    VehicleInspectionSerializer,
    DriverSerializer,
    RouteSerializer,
    TripSerializer,
)

from .auth_serializers import RegisterDriverSerializer


# -------------------------
# VEHICLE
# -------------------------
class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

class VehicleInspectionViewSet(viewsets.ModelViewSet):
    queryset = VehicleInspection.objects.select_related("vehicle").all()
    serializer_class = VehicleInspectionSerializer
# -------------------------
# DRIVER
# -------------------------
class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.select_related("user").all()
    serializer_class = DriverSerializer


# -------------------------
# ROUTE
# -------------------------
class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer


# -------------------------
# TRIP
# -------------------------
class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.select_related(
        "vehicle",
        "driver__user",
        "route",
    ).all()

    serializer_class = TripSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        search = self.request.query_params.get("search")

        if search:
            queryset = queryset.filter(
                Q(vehicle__plate_number__icontains=search)
                | Q(driver__user__first_name__icontains=search)
                | Q(driver__user__last_name__icontains=search)
            )

        return queryset

    @action(detail=False, methods=["get"])
    def active(self, request):
        trips = Trip.objects.filter(status="ongoing")
        serializer = self.get_serializer(trips, many=True)
        return Response(serializer.data)


# -------------------------
# REGISTER DRIVER
# -------------------------
class RegisterDriverView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterDriverSerializer(data=request.data)

        if serializer.is_valid():
            driver = serializer.save()

            token, created = Token.objects.get_or_create(user=driver.user)

            return Response(
                {
                    "message": "Driver registered successfully",
                    "token": token.key,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------
# LOGIN
# -------------------------
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {"error": "Invalid username or password"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        token, created = Token.objects.get_or_create(user=user)

        return Response(
            {
                "token": token.key,
                "username": user.username,
                "full_name": user.get_full_name(),
            }
        )


# -------------------------
# LOGOUT
# -------------------------
class LogoutView(APIView):

    def post(self, request):
        if hasattr(request.user, "auth_token"):
            request.user.auth_token.delete()

        return Response(
            {"message": "Logged out successfully"},
            status=status.HTTP_200_OK,
        )
    
    