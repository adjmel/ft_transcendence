from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from .forms import CustomUserCreationForm
from django.contrib.auth.decorators import login_required
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly

from rest_framework.views import APIView

@api_view(['GET'])
@permission_classes([AllowAny])
def index(request):
    return render(request, "index.html")

@api_view(['GET'])
@permission_classes([AllowAny])
def get_navbar(request):
    return render(request, "navbar.html")

@api_view(['GET'])
@permission_classes([AllowAny])
def home(request):
    return render(request, "home.html")

@api_view(['GET'])
@permission_classes([AllowAny])
@login_required(redirect_field_name=None)
def matchmaking(request):
    return render(request, "matchmaking.html")

@api_view(['GET'])
@permission_classes([AllowAny])
@login_required(redirect_field_name=None)
def jeu(request):
    return render(request, "jeu.html")

@api_view(['GET'])
@permission_classes([AllowAny])
@login_required(redirect_field_name=None)
def jeu_teams(request):
    return render(request, "jeu_teams.html")

@api_view(['GET'])
@permission_classes([AllowAny])
@login_required(redirect_field_name=None)
def tournoi(request):
    return render(request, "tournoi.html")

@api_view(['GET'])
@permission_classes([AllowAny])
@login_required(redirect_field_name=None)
def choose_type(request):
    return render(request, "choose_type.html")