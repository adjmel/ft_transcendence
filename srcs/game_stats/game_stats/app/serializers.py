from rest_framework import serializers
from .models import Score, Match, Tournament, TournamentPlayer

class ScoreSerializer(serializers.ModelSerializer):
    score = serializers.IntegerField()
    player_id = serializers.IntegerField()

    class Meta:
        model = Score
        fields = ['player_id', 'score']

class MatchSerializer(serializers.ModelSerializer):
    scores = ScoreSerializer(many=True)
    player_nbr = serializers.IntegerField(default=2, required=False)
    winner_id = serializers.IntegerField()
    tournament = serializers.IntegerField(required=False)

    class Meta:
        model = Match
        fields = ['winner_id', 'tournament', 'player_nbr', 'scores']
    
    def validate_player_nbr(self, data):
        if (data < 2):
            raise serializers.ValidationError({"player_nbr": "player number must be higher than 2"})
        return data
    
    def validate(self, data):
        scores = data['scores']
        if (len(scores) != data['player_nbr']):
            raise serializers.ValidationError({"scores": "there must be as much scores as players"})
        return data
    
    def create(self, validated_data):
        scores = validated_data.pop('scores')
        match_instance = Match.objects.create(**validated_data)
        for score in scores:
            Score.objects.create(match=match_instance,**score)
        return match_instance


class TournamentPlayerSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=30)
    player_id = serializers.IntegerField()

    class Meta:
        model = TournamentPlayer
        fields = ['player_id', 'name']

class TournamentSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=30)
    players = TournamentPlayerSerializer(many=True)
    winner = serializers.SlugRelatedField(
        many=False, 
        read_only=False,
        queryset=TournamentPlayer.objects.all(),
        slug_field='name',
        allow_null=True,
        required=False
    )

    class Meta:
        model = Tournament
        fields = ['name', 'winner','players']

    def validate(self, data):
        players = data.get('players')
        winner = data.get('winner')
        if (players and winner and winner not in players):
            raise serializers.ValidationError({"winner": "winner needs to be one of the players"})
        return data
    
    def create(self, validated_data):
        players = validated_data.pop('players')
        tournament_instance = Tournament.objects.create(**validated_data)
        for tournament_player in players:
            TournamentPlayer.objects.create(match=tournament_instance,**tournament_player)
        return tournament_instance