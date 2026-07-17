from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Vehicle
from .serializers import VehicleSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def manage_vehicles(request):
    # GET: List all vehicles belonging to the logged-in user
    if request.method == 'GET':
        vehicles = Vehicle.objects.filter(user=request.user).order_by('-id')
        serializer = VehicleSerializer(vehicles, many=True)
        return Response(serializer.data)

    # POST: Create a brand new vehicle record
    elif request.method == 'POST':
        serializer = VehicleSerializer(data=request.data)
        if serializer.is_valid():
            # Automatically assign the car to the logged-in user session
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def vehicle_detail(request, pk):
    # Safely lock query isolation to the current user's inventory
    try:
        vehicle = Vehicle.objects.get(pk=pk, user=request.user)
    except Vehicle.DoesNotExist:
        return Response({"detail": "Vehicle not found."}, status=status.HTTP_404_NOT_FOUND)

    # PUT: Modify fields on an existing vehicle
    if request.method == 'PUT':
        serializer = VehicleSerializer(vehicle, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE: Delete vehicle record entirely
    elif request.method == 'DELETE':
        vehicle.delete()
        return Response({"detail": "Vehicle removed successfully."}, status=status.HTTP_200_OK)