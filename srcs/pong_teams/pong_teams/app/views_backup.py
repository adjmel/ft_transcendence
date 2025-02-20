from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from app.jeu_backup import *
from app.games import *
import json
import traceback

@api_view(['POST'])
def jeu(request):
    try:
        requestData = json.loads(request.body)

        if (requestData["request"] == "init"):
            id = init_game()#requestData["mode"])
            res = {"id": id}
            return JsonResponse(res)
            #if (requestData["mode"] == "human"):
            #    return render(request, "jeu.html")
            #else:
            #    return render(request, "ordinateur.html")
        
        else:
            if ("id" in requestData.keys()):
                game = get_game_by_id(requestData["id"])

                if (game):
                    if (requestData["request"] == "data"):
                        res = get_data_from_game(game)
                        if res is not None:
                            return res
                        else:
                            raise IndexError()
                    
                    elif (requestData["request"] == "start"):
                        #play()
                        if (start_gameloop(game)):
                            return Response("Game with id "+str(requestData["id"])+" started", status=status.HTTP_200_OK)
                        return Response("Game with id "+str(requestData["id"])+" already started", status=status.HTTP_200_OK)
                    
                    elif (requestData["request"] == "stop"):
                        #stop()
                        stop_gameloop(game)
                        return Response("Game with id "+str(requestData["id"])+" stopped", status=status.HTTP_200_OK)
                    
                    elif (requestData["request"] == "move"):
                        playerID = requestData["player"]
                        dir = requestData["dirValue"]
                        playerMove(game, playerID, dir)
                        return Response("Player " + str(playerID) + " has moved", status=status.HTTP_200_OK)
                else:
                    return Response("Game with id "+str(requestData["id"])+" not found" + '\n', status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response(traceback.format_exc() + '\n', status=status.HTTP_400_BAD_REQUEST)
    
def tournoi(request):
    return render(request, "tournoi.html")