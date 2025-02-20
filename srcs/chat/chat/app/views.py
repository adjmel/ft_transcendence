from django.shortcuts import render
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

# Create your views here.

def index(request):
	return render(request, 'index.html', {})

@permission_classes([IsAuthenticated])
def room(request, room_name):
	return render(request, 'chatroom.html', {
		'room_name': room_name
	})