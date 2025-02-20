from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path("home/", views.home, name='home'),
    path("", views.index, name='index'),
    path("jeu/", views.jeu, name='jeu'),
    path("jeu_teams/", views.jeu_teams, name='jeu_teams'),
    path("tournoi/", views.tournoi, name='tournoi'),
    path("matchmaking/", views.matchmaking, name='matchmaking'),
    path("choose_type/", views.choose_type, name='choose_type'),
    path("get_navbar/", views.get_navbar, name="get_navbar")
]