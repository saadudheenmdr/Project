from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    vehicle_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ['user', 'customer_name', 'customer_email', 'vehicle_name']

    def get_vehicle_name(self, obj):
        if obj.vehicle:
            return f"{getattr(obj.vehicle, 'brand', '')} {getattr(obj.vehicle, 'model', '')}".strip()
        return "N/A"