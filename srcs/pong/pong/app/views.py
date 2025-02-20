from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from app.jeu import *
import json
import traceback
from django.http import JsonResponse

@api_view(['POST'])
def jeu_test(request):
    try:
        requestData = json.loads(request.body)

        if (requestData):
            if (requestData["request"] == 0):
                data = gameInit(requestData, True)
                return JsonResponse(data)
            elif (requestData["request"] == 1):
                data = reset(requestData)
                return JsonResponse(data)
            elif (requestData["request"] == 2):
                data = ballMove(requestData)
                return JsonResponse(data)
            else:
                return Response("Unknown request"+ '\n', status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response("Missing data"+ '\n', status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response(traceback.format_exc() + '\n', status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def jeu(request):
    try:
        requestData = json.loads(request.body)

        if (requestData):
            if (requestData["request"] == "join"):
                if (requestData["player2_name"] == ""):
                    if (pendingMatchs):
                        gameIDN = pendingMatchs.pop()
                        return JsonResponse({'gameID' : gameIDN, 'isHost': False})
                    else:
                        gameIDN = requestData["player1_name"] + str(random.randint(1000, 9999))
                        pendingMatchs.appendleft(gameIDN)
                        return JsonResponse({'gameID' : gameIDN, 'isHost': True})
                else:
                    gameIDN = requestData["player1_name"]
                    pendingMatchs.appendleft(gameIDN)
                    return JsonResponse({'gameID' : gameIDN, 'isHost': True})
            if (requestData["request"] == "gameInit"):
                data = gameInit(requestData, False)
                return JsonResponse(data)
            elif (requestData["request"] == "gameUpdate"):
                data = ballMove(requestData)
                return JsonResponse(data)
            else:
                return Response("Unknown request"+ '\n', status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response("Missing data"+ '\n', status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response(traceback.format_exc() + '\n', status=status.HTTP_500_INTERNAL_SERVER_ERROR)