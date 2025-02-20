from django.urls import path
from . import views

urlpatterns = [
    path('profiles/', views.ProfileListAPIView.as_view(), name='profiles_list'),
    path('profiles/<int:pk>', views.ProfileDetailAPIView.as_view(), name='profiles_detail'),
    path('profile_html/', views.ProfileDetailView.as_view(), name='profile_html'),
]