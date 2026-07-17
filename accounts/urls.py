from django.urls import path
from .views import register_user, test, profile, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Auth endpoints (matching your React API calls: "auth/login/" and "auth/register/")
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', register_user, name='register'),
    
    # Optional but recommended: Refresh token endpoint
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User data & utility endpoints
    path('profile/', profile, name='profile'),
    path('test/', test, name='test'),
]