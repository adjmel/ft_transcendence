from django.db import models

class Match(models.Model):
    player_nbr = models.IntegerField(default=2)
    winner_id = models.IntegerField()
    tournament = models.ForeignKey(
        "Tournament",
        related_name='match_tournament',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Score(models.Model):
    player_id = models.IntegerField()
    score = models.IntegerField()
    match = models.ForeignKey(
        "Match",
        related_name='scores',
        on_delete=models.CASCADE,
    )

class TournamentPlayer(models.Model):
    name = models.CharField(max_length=30)
    player_id = models.IntegerField()
    tournament = models.ForeignKey(
        "Tournament",
        related_name='player_tournament',
        on_delete=models.CASCADE,
    )

class Tournament(models.Model):
    name = models.CharField(max_length=30)
    winner = models.ForeignKey(
        TournamentPlayer,
        related_name='tournament_winner',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)