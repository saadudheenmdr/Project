from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "phone",
            "password",
            "role",  # Essential for saving the selected role during registration
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")
        
        # Ensure role is saved cleanly in lowercase
        if "role" in validated_data:
            validated_data["role"] = str(validated_data["role"]).lower()
            
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "phone",
            "role",  # Useful for frontend profile display
        ]
        read_only_fields = ["id", "username", "role"]  # Prevents users from escalating their own privileges via PUT/PATCH


# Custom JWT Serializer to enforce role validation and embed custom claims
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        """
        Embeds custom claims directly into the encrypted JWT token payload.
        """
        token = super().get_token(user)

        # Add custom claims to the token itself
        token["username"] = user.username
        token["role"] = getattr(user, "role", "user")
        token["is_staff"] = user.is_staff
        
        return token

    def validate(self, attrs):
        # 1. Validate standard username and password first
        data = super().validate(attrs)

        # 2. Get the requested role from the login request payload (case-insensitive)
        requested_role = str(self.initial_data.get("role", "")).lower()

        # 3. Determine actual user privileges (Superusers/Staff automatically get admin rights)
        actual_role = getattr(self.user, "role", "user").lower()
        is_admin_privileged = (actual_role == "admin") or self.user.is_staff or self.user.is_superuser

        # 4. Strict enforcement: Reject if requesting admin without privileges
        if requested_role == "admin" and not is_admin_privileged:
            raise serializers.ValidationError(
                {"detail": "Access Denied: You do not have ADMIN privileges."}
            )

        # 5. Strict enforcement: Reject if regular user tries to log into admin role or vice versa
        if requested_role and requested_role != "admin" and actual_role != requested_role and not is_admin_privileged:
            raise serializers.ValidationError(
                {"detail": f"Access Denied: You do not have {requested_role.upper()} privileges."}
            )

        # 6. Include user data in the direct JSON response sent to your React app
        data["id"] = self.user.id
        data["username"] = self.user.username
        data["role"] = "admin" if is_admin_privileged else actual_role
        
        return data