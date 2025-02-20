from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'wss/pong/(?P<gameID>\w+)/$', consumers.PongConsumer.as_asgi()),
]

