# Importation de la fonction path pour définir les URLs et des vues nécessaires
from django.urls import path
# Importation des vues définies dans le même répertoire que ce fichier
from django.urls import include, path

urlpatterns = [
    path('2fa/', include('app.urls')),
]