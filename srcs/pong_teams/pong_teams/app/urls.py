from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("jeu/", views.jeu, name='jeu'),
    path("jeu_test/", views.jeu_test, name='jeu_test'),
    #path("tournoi/", views.tournoi, name='tournoi'),
    #path("ordinateur/", views.ordinateur, name='ordinateur'),
]