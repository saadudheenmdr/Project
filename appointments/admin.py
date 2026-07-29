from django.contrib import admin
from .models import Appointment

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = (
        'customer_name', 
        'service_type', 
        'service_date', 
        'status', 
        'request_pickup', 
        'request_dropoff'
    )
    
    list_filter = ('status', 'service_type', 'request_pickup', 'request_dropoff')
    search_fields = ('customer_name', 'customer_email')

    fieldsets = (
        ('Customer & Vehicle Info', {
            'fields': ('user', 'customer_name', 'customer_email', 'vehicle')
        }),
        ('Service Details', {
            'fields': ('service_type', 'service_date', 'service_time', 'notes', 'status')
        }),
        ('Valet Services', {
            'fields': ('request_pickup', 'pickup_location', 'request_dropoff', 'dropoff_location'),
        }),
    )