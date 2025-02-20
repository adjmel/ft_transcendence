from rest_framework import serializers
from .models import CustomUser

class TokenDecodeSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ['id', 'username']#, 'enable_2fa']