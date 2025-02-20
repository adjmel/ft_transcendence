from django.shortcuts import render
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Profile
from .serializers import ProfileSerializer
from rest_framework.permissions import IsAuthenticated

class ProfileListAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = ProfileSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        profiles = Profile.objects.all()
        serializer = self.serializer_class(profiles, many=True)
        return Response(serializer.data)

class ProfileDetailAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = ProfileSerializer

    def get(self, request, pk, *args, **kwargs):
        try:
            profile = Profile.objects.get(pk=pk)
        except Profile.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(profile)
        return Response(serializer.data)
    
    def put(self, request, pk, *args, **kwargs):
        try:
            profile = Profile.objects.get(pk=pk)
        except Profile.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class ProfileDetailView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = ProfileSerializer

    def get(self, request, *args, **kwargs):
        try:
            profile = Profile.objects.get(pk=request.user.id)
        except Profile.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return render(request, "profile.html", {"profile": profile})