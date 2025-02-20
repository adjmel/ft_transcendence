import random
from collections import deque

pendingMatchs = deque()
CANVAS_WIDTH = 640
CANVAS_HEIGHT = 480
BALL_SIZE = 5
PLAYER_WIDTH = 5
PLAYER_HEIGHT = 100
BASE_BALL_SPEED = 100
MAX_SPEED = 500
MOVE_SPEED = 200
ANGLE_MULTIPLIER = 250

class Ball:
    re = False
    def __init__(self, x, y, vel_x, vel_y):
        self.x = x
        self.y = y
        self.vel_x = vel_x
        self.vel_y = vel_y


def gameInit(data, isTest):
    if isTest:
        data["request"] = 0
    else:
        data["request"] = ""
    data["ball1_x"] = CANVAS_WIDTH/2.0
    data["ball1_y"] = CANVAS_HEIGHT/2.0
    data["ball1_vel_x"] = BASE_BALL_SPEED * random.choice([1, -1])
    data["ball1_vel_y"] = random.randint(-1, 1) * 3
    data["ball2_x"] = CANVAS_WIDTH/2.0
    data["ball2_y"] = CANVAS_HEIGHT/2.0
    data["ball2_vel_x"] = -data["ball1_vel_x"]
    data["ball2_vel_y"] = -data["ball1_vel_y"]
    data["player1_x"] = 0.0
    data["player1_y"] = (CANVAS_HEIGHT / 2.0) - (PLAYER_HEIGHT / 2.0)
    data["player2_x"] = CANVAS_WIDTH - PLAYER_WIDTH
    data["player2_y"] = (CANVAS_HEIGHT / 2.0) - (PLAYER_HEIGHT / 2.0)
    data["player3_x"] = 50.0
    data["player3_y"] = (CANVAS_HEIGHT / 2.0) - (PLAYER_HEIGHT / 2.0)
    data["player4_x"] = CANVAS_WIDTH - PLAYER_WIDTH - 50.0
    data["player4_y"] = (CANVAS_HEIGHT / 2.0) - (PLAYER_HEIGHT / 2.0)
    data["player1_score"] = 0
    data["player2_score"] = 0

    return data

def playerMove(pos, dT, dir):
    pos += dir * MOVE_SPEED * dT / 1000
    if (pos > (CANVAS_HEIGHT - PLAYER_HEIGHT)):
        pos = (CANVAS_HEIGHT - PLAYER_HEIGHT)
    if (pos < 0):
        pos = 0
    return pos

def move(data):
    data["player1_y"] = playerMove(data["player1_y"], (data["updateTime"] - data["lastUpdate"]), data["player1_dir"])
    data["player2_y"] = playerMove(data["player2_y"], (data["updateTime"] - data["lastUpdate"]), data["player2_dir"])
    data["player3_y"] = playerMove(data["player3_y"], (data["updateTime"] - data["lastUpdate"]), data["player3_dir"])
    data["player4_y"] = playerMove(data["player4_y"], (data["updateTime"] - data["lastUpdate"]), data["player4_dir"])
    data = ballMove(data, 1)
    data = ballMove(data, 2)
    return data

def ballMove(data, ballNo):
    if (ballNo == 1):
        ball = Ball(data["ball1_x"], data["ball1_y"], data["ball1_vel_x"], data["ball1_vel_y"])
    else:
        ball = Ball(data["ball2_x"], data["ball2_y"], data["ball2_vel_x"], data["ball2_vel_y"])
    newX = ball.x + ball.vel_x * ((data["updateTime"] - data["lastUpdate"])) / 1000
    newY = ball.y + ball.vel_y * ((data["updateTime"] - data["lastUpdate"])) / 1000

    if (newX - BALL_SIZE / 2 < data["player1_x"] + PLAYER_WIDTH):
        dT = ((data["player1_x"] + PLAYER_WIDTH) - (ball.x - BALL_SIZE / 2)) / newX
        dX = ((ball.x - BALL_SIZE / 2)) + ((newX  - (ball.x - BALL_SIZE / 2)) * dT)
        dY = ((ball.y)) + ((newY  - (ball.y)) * dT)
        data, ball = collide(data, 1, dX, dY, newX, newY, ball)

    elif (newX + BALL_SIZE / 2 > data["player2_x"]):
        dT = ((data["player2_x"]) - (ball.x + BALL_SIZE / 2)) / newX
        dX = ((ball.x + BALL_SIZE / 2)) + ((newX  - (ball.x + BALL_SIZE / 2)) * dT)
        dY = ((ball.y)) + ((newY  - (ball.y)) * dT)
        data, ball = collide(data, 2, dX, dY, newX, newY, ball)

    elif (newX - BALL_SIZE / 2 < data["player3_x"] + PLAYER_WIDTH):
        dT = ((data["player3_x"] + PLAYER_WIDTH) - (ball.x - BALL_SIZE / 2)) / newX
        dX = ((ball.x - BALL_SIZE / 2)) + ((newX  - (ball.x - BALL_SIZE / 2)) * dT)
        dY = ((ball.y)) + ((newY  - (ball.y)) * dT)
        data, ball = collide(data, 3, dX, dY, newX, newY, ball)

    elif (newX + BALL_SIZE / 2 > data["player4_x"]):
        dT = (data["player4_x"] - (ball.x + BALL_SIZE / 2)) / newX
        dX = ((ball.x + BALL_SIZE / 2)) + ((newX  - (ball.x + BALL_SIZE / 2)) * dT)
        dY = ((ball.y)) + ((newY  - (ball.y)) * dT)
        data, ball = collide(data, 4, dX, dY, newX, newY, ball)

    else:
        ball.x = newX
        ball.y = newY
        if (ball.y + BALL_SIZE / 2 > CANVAS_HEIGHT):
            ball.y = CANVAS_HEIGHT - (ball.y + BALL_SIZE / 2) + CANVAS_HEIGHT
            ball.vel_y *= -1
        elif (ball.y - BALL_SIZE / 2 < 0):
            ball.y = -(ball.y - BALL_SIZE / 2)
            ball.vel_y *= -1
    data = ballAssign(data, ball, ballNo)
    return data

def ballAssign(data, ball, ballNo):
    if (ballNo == 1):
        data["ball1_x"] = ball.x
        data["ball1_y"] = ball.y
        data["ball1_vel_x"] = ball.vel_x
        data["ball1_vel_y"] = ball.vel_y
    else:
        data["ball2_x"] = ball.x
        data["ball2_y"] = ball.y
        data["ball2_vel_x"] = ball.vel_x
        data["ball2_vel_y"] = ball.vel_y

    if ball.re is True:
        data = reset(data)
    return data

def collide(data, player, dX, dY, newX, newY, ball):
    if player == 1: player_y = data["player1_y"]
    elif player == 2: player_y = data["player2_y"]
    elif player == 3: player_y = data["player3_y"]
    elif player == 4: player_y = data["player4_y"]

    if (dY + BALL_SIZE / 2 < player_y or dY - BALL_SIZE / 2 > player_y + PLAYER_HEIGHT):
        if (player == 1 or player == 2):
            ball.re= True
            if (player == 1):
                data["player2_score"] += 1
            else:
                data["player1_score"] += 1
        else:
            ball.x = newX
            ball.y = newY
            if (ball.y + BALL_SIZE / 2 > CANVAS_HEIGHT):
                ball.y = CANVAS_HEIGHT - (ball.y + BALL_SIZE / 2) + CANVAS_HEIGHT
                ball.vel_y *= -1
            elif (ball.y - BALL_SIZE / 2 < 0):
                ball.y = -(ball.y - BALL_SIZE / 2)
                ball.vel_y *= -1
        
    else:
        if player == 1:
            if(ball.x - BALL_SIZE / 2 < (data["player1_x"] + PLAYER_WIDTH)):
                ball.x = (data["player1_x"] + PLAYER_WIDTH) + (newX / dX)
        elif player == 2:
            if (ball.x + BALL_SIZE / 2 > (data["player2_x"])):
                ball.x = (data["player2_x"]) + (newX / dX)
        elif player == 3:
            if (ball.x - BALL_SIZE / 2 < data["player3_x"] + PLAYER_WIDTH):
                ball.x = (data["player3_x"] + PLAYER_WIDTH) + (newX / dX)
        elif player == 4:
            if (ball.x + BALL_SIZE / 2 > data["player4_x"]):
                ball.x = (data["player4_x"]) + (newX / dX)
        ball.vel_x *= -1
        ball.y = newY
        impact = dY - (player_y + PLAYER_HEIGHT / 2)
        ball.vel_y = round(impact/(PLAYER_HEIGHT / 2) * ANGLE_MULTIPLIER)
        if (abs(ball.vel_x) < MAX_SPEED):
            ball.vel_x *= 1.2
    return data, ball

def reset(data):
    data["ball1_x"] = CANVAS_WIDTH / 2
    data["ball1_y"] = CANVAS_HEIGHT / 2
    data["ball2_x"] = CANVAS_WIDTH / 2
    data["ball2_y"] = CANVAS_HEIGHT / 2
    data["player1_y"] = CANVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2
    data["player2_y"] = CANVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2
    data["player3_y"] = CANVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2
    data["player4_y"] = CANVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2
    data["ball1_vel_x"] = BASE_BALL_SPEED * random.choice([1, -1])
    data["ball1_vel_y"] = random.randint(-1, 1) * 3
    data["ball2_vel_x"] = -data["ball1_vel_x"]
    data["ball2_vel_y"] = -data["ball1_vel_y"]
    data["player1_dir"] = 0
    data["player2_dir"] = 0
    data["player3_dir"] = 0
    data["player4_dir"] = 0
    return data