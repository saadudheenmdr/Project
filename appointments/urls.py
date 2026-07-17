from django.urls import path
from . import views 

urlpatterns = [
    # =====================================================================
    # USER ENDPOINTS
    # =====================================================================
    path('', views.manage_appointments, name='manage_appointments'),
    path('stats/', views.dashboard_stats, name='dashboard-stats'),
    
    # =====================================================================
    # ADMIN ENDPOINTS
    # =====================================================================
    path('admin/appointments/', views.AppointmentListView.as_view(), name='admin-appointment-list'),
    path('admin/appointments/<int:pk>/status/', views.UpdateAppointmentStatusView.as_view(), name='update-appointment-status'),
    path('admin/dashboard-metrics/', views.AdminDashboardMetricsView.as_view(), name='admin-dashboard-metrics'),  
]