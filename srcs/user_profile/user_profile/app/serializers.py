from rest_framework import serializers
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField()
    name = serializers.CharField(max_length=30)
    surname = serializers.CharField(max_length=30)
    profile_picture = serializers.ImageField(required=False)

    class Meta:
        model = Profile
        fields = ['user_id', 'name', 'surname', 'profile_picture']
