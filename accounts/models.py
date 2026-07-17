from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class User(AbstractUser):
    # FIX: Swapped 'customer' for 'user' to match the <option value="user"> in React
    ROLE_CHOICES = (
        ('user', 'User'),
        ('admin', 'Admin'),
    )

    # Safely support global phone number formats
    phone = models.CharField(max_length=15, blank=True, null=True)

    # FIX: Updated default role to 'user' to match ROLE_CHOICES
    role = models.CharField(
        max_length=20, 
        choices=ROLE_CHOICES, 
        default='user'
    )

    # Cleaned up related_names to avoid naming collisions with default Django apps
    groups = models.ManyToManyField(
        Group,
        related_name='accounts_user_groups',
        blank=True,
        help_text='The groups this user belongs to.'
    )

    user_permissions = models.ManyToManyField(
        Permission,
        related_name='accounts_user_permissions',
        blank=True,
        help_text='Specific permissions for this user.'
    )

    def __str__(self):
        return f"{self.username} ({self.role})"