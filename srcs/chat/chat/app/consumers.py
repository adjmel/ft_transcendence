import json
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatRoomConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.room_name = self.scope['url_route']['kwargs']['room_name']
		self.room_group_name = 'chat_%s' % self.room_name
		await self.accept()

		await self.channel_layer.group_add(
			self.room_group_name,
			self.channel_name 
		)
		

	async def disconnect(self, close_code):
		await self.channel_layer.group_discard(
			self.room_group_name,
			self.channel_name
		)

	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		message = text_data_json['message']
		time = text_data_json['timeStamp']
		username = text_data_json['username']
		await self.channel_layer.group_send(
			self.room_group_name,
			{
				'type': 'chat_message',
				'message': message,
				'timeStamp': time,
				'username': username,
			}
		)

	async def chat_message(self, event):
		now = datetime.fromtimestamp(event['timeStamp'] / 1e3)
		html = open("app/templates/msg.html").read()
		html = html.replace("{{ User_Name }}", "Ali")
		html = html.replace("{{ Msg }}", event['message'])
		html = html.replace("{{ msg_time }}", now.strftime("%H:%M%p"))
		print(html)
		await self.send(html)
	pass
