from django.urls import path
from . import views

urlpatterns = [
    path('', views.manage_vehicles, name='manage_vehicles'),
    path('<int:pk>/', views.vehicle_detail, name='vehicle_detail'),
]