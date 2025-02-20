from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
# from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from .forms import CustomUserCreationForm
from django.contrib.auth.forms import AuthenticationForm, PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
import os
# from django_otp.plugins.otp_totp.models import TOTPDevice
# from django_otp.util import random_hex
# from django.contrib.auth.decorators import login_required
# from .forms import Enable2FAForm
from django.contrib.auth.views import LoginView
from .models import CustomUser
from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_exempt

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .serializers import TokenDecodeSerializer
from django.conf import settings
import jwt
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

class TokenDecode(APIView):
    serializer_class = TokenDecodeSerializer
    permission_classes = [IsAuthenticated]

    @csrf_exempt
    def post(self, request):
        token = request.data.get('token', None)
        if token:
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms="HS256")
            except Exception as err:
                
                raise AuthenticationFailed(F'Unauthenticated: {err}')

            try:
                user = CustomUser.objects.get(id=payload['user_id'])
            except Match.DoesNotExist:
                raise AuthenticationFailed('Unauthenticated')
            serializer = TokenDecodeSerializer(user)
            return Response(serializer.data)
        raise AuthenticationFailed('Unauthenticated')

@api_view(('GET',))
def logout_view(request):
    logout(request)
    try:
        refresh_token = request.COOKIES["jwttoken_refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return redirect("/2fa/login")
    except Exception as e:
        return Response(status=status.HTTP_400_BAD_REQUEST)

################ 2FA #################


# Fonction pour générer et enregistrer la clé TOTP
# def generate_totp_key():
#     return random_hex(20)  # Génère une clé secrète hexadécimale de 20 octets

# Vue pour la page d'inscription
@csrf_exempt
def signup(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            #user = form.save(commit=False)
            #enable_2fa = form.cleaned_data.get('enable_2fa')
            #user.enable_2fa = enable_2fa
            # if enable_2fa:
            #     totp_key = generate_totp_key()  # Génère une clé TOTP pour l'utilisateur
            #     user.totp_key = totp_key  # Enregistre la clé dans le modèle utilisateur
            #      # Définir une variable de session pour enable_2fa
            #     request.session['enable_2fa'] = True
            #     user.save()
            #     # Ajoute automatiquement un périphérique TOTP pour l'utilisateur
            #     device = TOTPDevice.objects.create(user=user, key=totp_key)
            #     device.save()
            #     # Authentifie et connecte l'utilisateur nouvellement inscrit
            #     username = form.cleaned_data.get('username')
            #     password = form.cleaned_data.get('password1')
            #     user = authenticate(username=username, password=password)
            #     login(request, user)
            #     return redirect('enable_2fa')  # Rediriger vers la page de configuration de la 2FA si enable coche
            # else:
                #request.session['enable_2fa'] = False
            #user.save()
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=password)
            login(request, user)
            return redirect('/home')
    else:
        form = CustomUserCreationForm()
    return render(request, 'signup.html', {'form': form})

@csrf_exempt
def user_login(request):
    # if request.user.is_authenticated:
    #     logout(request)
    #     return HttpResponse('You have been disconnected.')
    if request.method == 'POST':
        form = AuthenticationForm(request, request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                # Récupérer la valeur de enable_2fa de la session
                # enable_2fa = request.session.get('enable_2fa', False)
                #profile = UserProfile.objects.get(user=user)
                # if user.enable_2fa:  # Vérifie si la double authentification est activée pour cet utilisateur
                #     login(request, user)
                #     return redirect('verify_2fa')  # Rediriger vers la page de 2FA
                # else:
                login(request, user)
                return redirect('/home')  # Rediriger vers une page de succès
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})

# Create a view that allows users to enable 2FA for their accounts. 
# You can use Django’s class-based views for this purpose. 
# @login_required
# def enable_2fa(request):
#     if request.method == 'POST':
#         form = Enable2FAForm(request.user, request.POST)
#         if form.is_valid():
#             # Enable 2FA for the user
#             device = TOTPDevice.objects.create(user=request.user)
#             device.save()
#             # Redirect to verification page
#             return redirect('https://localhost:1050/home')#return redirect('index')
#     else:
#         form = Enable2FAForm(request.user)
#     # Generate QR code URL
#     totp_device = TOTPDevice.objects.get_or_create(user=request.user)[0]
#     qr_code_url = totp_device.config_url
#     return render(request, 'enable_2fa.html', {'form': form, 'qr_code_url': qr_code_url})

# @login_required
# def verify_2fa(request):
#     if request.method == 'POST':
#         code = request.POST.get('verification_code')
#         device = TOTPDevice.objects.filter(user=request.user).first()

#         if device.verify_token(code):
#             # Si le code 2FA est correct
#             return redirect('https://localhost:1050/home')
#         else:
#             # Si le code 2FA est incorrect, renvoit une erreur
#             return render(request, 'verify_2fa.html', {'error': 'Invalid 2FA code.'})

#     devices = TOTPDevice.objects.filter(user=request.user)
#     return render(request, 'verify_2fa.html', {'devices': devices})


#To make use of 2FA, you need to update your user authentication 
# views, such as the login view. Here’s an example of how you can 
# modify the login view to incorporate 2FA verification
# class CustomLoginView(LoginView):
#     template_name = 'login.html'

#     def form_valid(self, form):
#         # Check if the user has 2FA enabled
#         user = self.request.user
#         if TOTPDevice.objects.filter(user=user).count() > 0:
#             # Redirect to the 2FA verification view
#             return redirect('verify_2fa')
#         # Continue with regular login
#         return super().form_valid(form)

