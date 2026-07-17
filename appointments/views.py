from django.conf import settings
from django.core.mail import send_mail
from django.utils.timezone import now
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, BasePermission 
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Appointment
from .serializers import AppointmentSerializer


class IsAdminOrStaffRole(BasePermission):
    """
    Permits entry to Django superusers/staff as well as accounts 
    containing a custom 'admin' role string.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_staff or getattr(request.user, 'role', '') == 'admin')
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    today_date = now().date()
    
    if request.user.is_staff or getattr(request.user, 'role', '') == 'admin':
        total = Appointment.objects.count()
        today = Appointment.objects.filter(service_date=today_date).count()
        approved = Appointment.objects.filter(status='Approved').count()
        pending = Appointment.objects.filter(status='Pending').count()
        rejected = Appointment.objects.filter(status='Rejected').count()
    else:
        total = Appointment.objects.filter(user=request.user).count()
        today = Appointment.objects.filter(user=request.user, service_date=today_date).count()
        approved = Appointment.objects.filter(user=request.user, status='Approved').count()
        pending = Appointment.objects.filter(user=request.user, status='Pending').count()
        rejected = Appointment.objects.filter(user=request.user, status='Rejected').count()

    return Response({
        'total': total,
        'today': today,
        'approved': approved,
        'pending': pending,
        'rejected': rejected
    })


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def manage_appointments(request):
    if request.method == 'GET':
        try:
            appointments = Appointment.objects.filter(user=request.user).order_by('-id') 
            serializer = AppointmentSerializer(appointments, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"🔥 GET /appointments/ CRASHED: {str(e)}")
            return Response({"detail": f"Server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'POST':
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            # Uses logical 'or' to safely catch Django's default empty string ("") on first_name
            fallback_name = request.user.first_name or request.user.username
            
            appointment = serializer.save(
                user=request.user,
                customer_name=fallback_name,
                customer_email=request.user.email
            ) 

            from_email = getattr(settings, 'EMAIL_HOST_USER', 'yourgmail@gmail.com')
            try:
                send_mail(
                    'Appointment Created',
                    f'Your booking request for {appointment.service_type} was submitted successfully.',
                    from_email,
                    [request.user.email], 
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Failed to send creation email: {e}")
                
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =====================================================================
# ADMIN ENDPOINTS
# =====================================================================

class AppointmentListView(generics.ListAPIView):
    queryset = Appointment.objects.all().order_by('-created_at')
    serializer_class = AppointmentSerializer
    permission_classes = [IsAdminOrStaffRole]


class UpdateAppointmentStatusView(APIView):
    permission_classes = [IsAdminOrStaffRole]

    def patch(self, request, pk):
        try:
            appointment = Appointment.objects.get(pk=pk)
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status not in ['Approved', 'Rejected', 'Pending']:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        appointment.status = new_status
        appointment.save()

        customer_name = getattr(appointment, 'customer_name', None) or appointment.user.username
        recipient_email = getattr(appointment, 'customer_email', None) or appointment.user.email

        subject = f'Your Service Appointment is {new_status}!'
        message = (
            f"Hello {customer_name},\n\n"
            f"Your appointment request for {appointment.service_type} scheduled on "
            f"{appointment.service_date} at {appointment.service_time} has been {new_status.lower()}."
        )
        from_email = getattr(settings, 'EMAIL_HOST_USER', 'yourgmail@gmail.com')
        
        try:
            send_mail(subject, message, from_email, [recipient_email], fail_silently=False)
        except Exception as e:
            print(f"Failed to send status notification email: {e}")

        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminDashboardMetricsView(APIView):
    permission_classes = [IsAdminOrStaffRole]
    
    def get(self, request):
        today_date = now().date()
        
        all_apts = Appointment.objects.all().order_by('-id')
        today_apts = Appointment.objects.filter(service_date=today_date).order_by('-id')
        pending_apts = Appointment.objects.filter(status='Pending').order_by('-id')
        approved_apts = Appointment.objects.filter(status='Approved').order_by('-id')
        rejected_apts = Appointment.objects.filter(status='Rejected').order_by('-id')

        metrics = {
            "totalBookings": all_apts.count(),
            "todayBookings": today_apts.count(),
            "pendingCount": pending_apts.count(),
            "approvedCount": approved_apts.count(),
            "rejectedCount": rejected_apts.count(),
        }

        lists = {
            "today": AppointmentSerializer(today_apts, many=True).data,
            "pending": AppointmentSerializer(pending_apts, many=True).data,
            "approved": AppointmentSerializer(approved_apts, many=True).data,
            "rejected": AppointmentSerializer(rejected_apts, many=True).data,
        }

        return Response({"metrics": metrics, "lists": lists}, status=status.HTTP_200_OK)