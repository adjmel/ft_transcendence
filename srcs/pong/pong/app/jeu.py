
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

def gameInit(data, isTest):
    if isTest:
        data["request"] = 0
    else:
        data["request"] = ""
    data["ball_x"] = CANVAS_WIDTH/2.0
    data["ball_y"] = CANVAS_HEIGHT/2.0
    data["ball_vel_x"] = BASE_BALL_SPEED * random.choice([1, -1])
    data["ball_vel_y"] = random.randint(-1, 1) * 3
    data["player1_x"] = 0.0
    data["player1_y"] = (CANVAS_HEIGHT / 2.0) - (PLAYER_HEIGHT / 2.0)
    data["player2_x"] = CANVAS_WIDTH - PLAYER_WIDTH
    data["player2_y"] = (CANVAS_HEIGHT / 2.0) - (PLAYER_HEIGHT / 2.0)
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

def ballMove(data):
    data["player1_y"] = playerMove(data["player1_y"], (data["updateTime"] - data["lastUpdate"]), data["player1_dir"])
    data["player2_y"] = playerMove(data["player2_y"], (data["updateTime"] - data["lastUpdate"]), data["player2_dir"])

    newX = data["ball_x"] + data["ball_vel_x"] * ((data["updateTime"] - data["lastUpdate"])) / 1000
    newY = data["ball_y"] + data["ball_vel_y"] * ((data["updateTime"] - data["lastUpdate"])) / 1000

    if (newX - BALL_SIZE / 2 < PLAYER_WIDTH):
        dT = (PLAYER_WIDTH - (data["ball_x"] - BALL_SIZE / 2)) / newX
        dX = ((data["ball_x"] - BALL_SIZE / 2)) + ((newX  - (data["ball_x"] - BALL_SIZE / 2)) * dT)
        dY = ((data["ball_y"])) + ((newY  - (data["ball_y"])) * dT)
        data = collide(data, True, dX, dY, newX, newY)

    elif (newX + BALL_SIZE / 2 > CANVAS_WIDTH - PLAYER_WIDTH):
        dT = ((CANVAS_WIDTH - PLAYER_WIDTH) - (data["ball_x"] + BALL_SIZE / 2)) / newX
        dX = ((data["ball_x"] + BALL_SIZE / 2)) + ((newX  - (data["ball_x"] + BALL_SIZE / 2)) * dT)
        dY = ((data["ball_y"])) + ((newY  - (data["ball_y"])) * dT)
        data = collide(data, False, dX, dY, newX, newY)

    else:
        data["ball_x"] = newX
        data["ball_y"] = newY
        if (data["ball_y"] + BALL_SIZE / 2 > CANVAS_HEIGHT):
            data["ball_y"] = CANVAS_HEIGHT - (data["ball_y"] + BALL_SIZE / 2) + CANVAS_HEIGHT
            data["ball_vel_y"] *= -1
        elif (data["ball_y"] - BALL_SIZE / 2 < 0):
            data["ball_y"] = -(data["ball_y"] - BALL_SIZE / 2)
            data["ball_vel_y"] *= -1

    return data

def collide(data, isPlayer1, dX, dY, newX, newY):
    player_y = data["player1_y"] if isPlayer1 else data["player2_y"]

    if (dY + BALL_SIZE / 2 < player_y or dY - BALL_SIZE / 2 > player_y + PLAYER_HEIGHT):
        data = reset(data)
        if (isPlayer1):
            data["player2_score"] += 1
        else:
            data["player1_score"] += 1
        
    else:
        if isPlayer1:
            if(data["ball_x"] - BALL_SIZE / 2 < (data["player1_x"] + PLAYER_WIDTH)):
                data["ball_x"] = (data["player1_x"] + PLAYER_WIDTH) + (newX / dX)
        else:
            if (data["ball_x"] + BALL_SIZE / 2 > (data["player2_x"])):
                data["ball_x"] = (data["player2_x"]) + (newX / dX)
        data["ball_vel_x"] *= -1
        data["ball_y"] = newY
        impact = dY - (player_y + PLAYER_HEIGHT / 2)
        data["ball_vel_y"] = round(impact/(PLAYER_HEIGHT / 2) * ANGLE_MULTIPLIER)
        if (abs(data["ball_vel_x"]) < MAX_SPEED):
            data["ball_vel_x"] *= 1.2
    return data

def reset(data):
    data["ball_x"] = CANVAS_WIDTH / 2
    data["ball_y"] = CANVAS_HEIGHT / 2
    data["player1_y"] = CANVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2
    data["player2_y"] = CANVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2
    data["ball_vel_x"] = BASE_BALL_SPEED * random.choice([1, -1])
    data["ball_vel_y"] = random.randint(-1, 1) * 3
    data["player1_dir"] = 0
    data["player2_dir"] = 0

    return data