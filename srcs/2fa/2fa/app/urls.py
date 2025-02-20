# Importation de la fonction path pour définir les URLs et des vues nécessaires
from django.urls import path
# Importation des vues définies dans le même répertoire que ce fichier
from . import views
# Importation des vues d'authentification de Django
from django.contrib.auth import views as auth_views
# from django_otp.admin import OTPAdminSite
# from django_otp.plugins.otp_totp.models import TOTPDevice
# from django_otp.plugins.otp_totp.admin import TOTPDeviceAdmin

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

urlpatterns = [
    path('token/obtain/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path('token/decode/', views.TokenDecode.as_view(), name='token_decode'),
#2FA
    # URL de la page de connexion (utilisant une vue personnalisée)
    path('login/', views.user_login, name='login'),
    #path('enable_2fa/', views.enable_2fa, name='enable_2fa'),
    #path('verify_2fa/', views.verify_2fa, name='verify_2fa'),
    path('signup/', views.signup, name='signup'),
    # URL de la page de déconnexion (utilisant la vue de déconnexion intégrée de Django)
    path('logout/', views.logout_view, name='logout'),
]
