from django.db import models
from django.conf import settings

class Vehicle(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    number = models.CharField(max_length=50)
    year = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.brand} {self.model} ({self.number})"