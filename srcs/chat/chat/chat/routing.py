from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import app.routing

application = ProtocolTypeRouter({
	"http": get_asgi_application(),
	'websocket': AuthMiddlewareStack(
		URLRouter(
			app.routing.websocket_urlpatterns
		)
	),
})