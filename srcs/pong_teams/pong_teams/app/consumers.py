import json
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from django.http import JsonResponse
from app.jeu import *

class PongConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.gameID = self.scope['url_route']['kwargs']['gameID']
		self.game_group_name = 'pong_%s' % self.gameID
		await self.accept()

		await self.channel_layer.group_add(
			self.game_group_name,
			self.channel_name 
		)

	async def disconnect(self, close_code):
		if self.gameID in pendingMatchs:
			pendingMatchs.remove(self.gameID)
		await self.channel_layer.group_discard(
			self.game_group_name,
			self.channel_name
		)

	async def broadcast(self, game_json):
		await self.channel_layer.group_send(
			self.game_group_name,
			{
				'type': 'game_update',
				'game_json': game_json,
			}
		)

	async def receive(self, text_data):
		game_json = json.loads(text_data)
		match game_json['request']:
			case "ready":
				game_json = {'request': "start", 'playerID1': game_json['playerID1'], 'playerID3': game_json['playerID3']}
				await self.channel_layer.group_send(
					self.game_group_name,
					{
						'type': 'game_update',
						'game_data': game_json,
					}
				)
			case "join":
				await self.channel_layer.group_send(
					self.game_group_name,
					{
						'type': 'game_update',
						'game_data': game_json,
					}
				)
			case "move":
				await self.channel_layer.group_send(
					self.game_group_name,
					{
						'type': 'game_update',
						'game_data': game_json,
					}
				)
			case "update":
				game_json = move(game_json)
				await self.channel_layer.group_send(
					self.game_group_name,
					{
						'type': 'game_update',
						'game_data': game_json,
					}
				)
				if (game_json["player1_score"] >= 5 or game_json["player2_score"] >= 5):
					game_json["request"] = "win"
					await self.channel_layer.group_send(
					self.game_group_name,
					{
						'type': 'game_update',
						'game_data': game_json,
					}
				)
				#send results to gameStat
				#send results to tournament
			# case "ping":
			# case "stop":
			# case "disconnect":


	async def game_update(self, event):
		await self.send(json.dumps(event["game_data"]))

	pass
