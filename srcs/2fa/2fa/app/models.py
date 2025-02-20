#In your app’s models.py, create a UserProfile model to store 
#user-specific 2FA information:
from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    enable_2fa = models.BooleanField(default=False)
