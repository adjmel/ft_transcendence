import random
import time
import threading
from django.http import JsonResponse

class Player:
    x = 0.0
    y = 0.0
    score = 0
    move_speed = 20

class Ball:
    x = 0.0
    y = 0.0
    size = 5.0
    velX = 0.0
    velY = 0.0

class Game():
    id = 0
    player1 = Player()
    player2 = Player()
    ball = Ball()
    player_height = 100
    player_width = 5
    max_speed = 12
    canvas_height = 480
    canvas_width = 640
    canvasposX = 8
    canvasposY = 162
    playing = False
    comSpeed = 13
    #comMode = False
    fps = 60
    thread = None
    lock = threading.Lock
    isTournament = False

game = Game()

def init():#mode):
    global game
    del game
    game = Game()
    #game.comMode = (mode != "human")
    #if game.comMode == True:
    #    game.player2.move_speed = game.comSpeed
    reset(game)
    return game

def play(game):
    if game.playing is False:
        game.playing = True
        while game.playing is True:
            #if (time.time_ns() % game.fps == 0):
            ballMove()
            #computerMove()
            time.sleep(1/game.fps)


def getData(game):
    response_dic = {"player1Score": game.player1.score, "player2Score": game.player2.score, "player1pos": game.player1.y, "player2pos": game.player2.y, "ballX": game.ball.x, "ballY": game.ball.y}
    return JsonResponse(response_dic)

def playerMove(game, playerID, dir):
    if (game.playing is True):
        if (playerID == 0):
            player = game.player1
        else:
            player = game.player2

        if (dir == 1 and player.y < game.canvas_height - game.player_height):
            player.y += player.move_speed
        elif (dir == -1 and player.y > 0):
            player.y -= player.move_speed

def changeDirection(game, playerPosition):
    impact = game.ball.y - playerPosition - game.player_height / 2
    ratio = 100 / (game.player_height / 2)
    game.ball.velY = round(impact * ratio / 10)

def collide(game, player):
    if (game.ball.y < player.y or game.ball.y > player.y + game.player_height):
        reset()
        if (player == game.player1):
            game.player2.score += 1
        else:
            game.player1.score += 1
        
    else:
        game.ball.velX *= -1
        changeDirection(player.y)

        if (abs(game.ball.velX) < game.max_speed):
            game.ball.velX *= 1.2

def ballMove(game):
    if (game.ball.y > game.canvas_height or game.ball.y < 0):
        game.ball.velY *= -1

    if (game.ball.x + game.ball.size / 2 > game.canvas_width - game.player_width):
        collide(game.player2)
    elif (game.ball.x - game.ball.size / 2 < game.player_width):
        collide(game.player1)

    game.ball.x += game.ball.velX
    game.ball.y += game.ball.velY

def reset(game):
    game.ball.x = game.canvas_width / 2 #- game.ball.size / 2
    game.ball.y = game.canvas_height / 2 #- game.ball.size / 2
    game.player1.y = game.canvas_height / 2 - game.player_height / 2
    game.player2.y = game.canvas_height / 2 - game.player_height / 2

    game.ball.velX = 3
    game.ball.velY = random.random() * 3

def stop(game):
    #global game
    game.playing = False
    reset()
    game.player1.score = 0
    game.player2.score = 0

'''def computerMove(game):
    if game.comMode == True:
        #game.player2.y += game.ball.velY * game.comSpeed
        if game.ball.y > game.player2.y + game.player_height/2:
            playerMove(1, 1)
        if game.ball.y < game.player2.y - game.player_height/2:
            playerMove(1, -1)'''