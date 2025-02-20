from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Match, Score, Tournament, TournamentPlayer
from .serializers import MatchSerializer, ScoreSerializer, TournamentSerializer, TournamentPlayerSerializer
from django.shortcuts import render, redirect

@api_view(['GET', 'POST'])
def match_list(request):
    if request.method == 'GET':
        matchs = Match.objects.all()
        serializer = MatchSerializer(matchs, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = MatchSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def match_detail(request, pk):
    try:
        match = Match.objects.get(pk=pk)
    except Match.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = MatchSerializer(match)
        return Response(serializer.data)

@api_view(['GET', 'POST'])
def tournament_list(request):
    if request.method == 'GET':
        tournaments = Tournament.objects.all()
        serializer = TournamentSerializer(tournaments, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = TournamentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def tournament_detail(request, pk):
    try:
        tournament = Tournament.objects.get(pk=pk)
    except Tournament.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = TournamentSerializer(tournament)
        return Response(serializer.data)
    elif request.method == 'PUT':
        if (not request.data.get('players')):
            players = tournament.players.values_list('nickname', flat=True)
            request.data['players'] = players
        serializer = TournamentSerializer(tournament, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)