from django.db import models
from django.conf import settings  

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    )

    # --- Updated Services based on Frontend Data ---
    SERVICE_CHOICES = (
        ('Basic Service', 'Basic Service'),
        ('Standard Service', 'Standard Service'),
        ('Comprehensive Service', 'Comprehensive Service'),
        ('Running Repair', 'Running Repair'),
        ('Jump Start', 'Jump Start'),
        ('Puncture', 'Puncture'),
        ('Other', 'Other'),                 
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    vehicle = models.ForeignKey('vehicles.Vehicle', on_delete=models.CASCADE)
    
    customer_name = models.CharField(max_length=100, null=True, blank=True)
    customer_email = models.EmailField(null=True, blank=True)

    service_type = models.CharField(max_length=50, choices=SERVICE_CHOICES)
    service_date = models.DateField()
    service_time = models.TimeField()
    
    # --- Valet Fields ---
    request_pickup = models.BooleanField(default=False)
    request_dropoff = models.BooleanField(default=False)
    pickup_location = models.TextField(blank=True, null=True)
    dropoff_location = models.TextField(blank=True, null=True)
    
    # --- Home Service Fields ---
    request_home_service = models.BooleanField(default=False)
    home_service_address = models.TextField(blank=True, null=True)
    home_service_location = models.CharField(max_length=255, blank=True, null=True)
    # -------------------------------

    notes = models.TextField(blank=True, null=True) 

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer_name} - {self.service_type} ({self.status})"