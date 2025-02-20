import threading
from srcs.pong_teams.pong_teams.app.jeu_backup import *

games = []
nbgames = 0

def init_game(mode):
    game = init(mode)
    global nbgames
    game.id = nbgames
    nbgames += 1
    games.append(game)
    return game.id

def get_game_by_id(id):
    return [x for x in games if x.id == id][0]

def start_gameloop(game):
    if (game and game.playing is False):
        try:
            game.playing = True
            game.lock = threading.Lock()
            t = threading.Thread(target=play, args=(game))
            t.start()
            game.thread = t
            return True
        except:
            return False
    return False

def stop_gameloop(game):
    if (game and game.thread):
        game.thread.join()
        game.playing = False

def get_data_from_game(game):
    if (game):
        if (game.thread):
            game.lock.acquire()
            try:
                data = getData(game)
            finally:
                game.lock.release()
        else:
            data = getData(game)
        return data
    return None

def delete_game(game):
    if (game):
        stop_gameloop(game)
        games.remove(game)
        del game