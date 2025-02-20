import json
import sys
import requests
import ssl
import os
    
def createData():
    data = {"request": 0,
            "player1_id": "",
            "player2_id": "",
            "ball_x": 0.0,
            "ball_y": 0.0,
            "ball_vel_x": 0.0,
            "ball_vel_y": 0.0,
            "player1_x": 0.0,
            "player1_y": 0.0,
            "player2_x": 0.0,
            "player2_y": 0.0,
            "player1_dir": 0,
            "player2_dir": 0,
            "player1_score": 0,
            "player2_score": 0,
            "playing" : False,
            "lastUpdate": 0,
            "updateTime": 0
            }
    return data

def print_update(data):
    print("P1: " + str(data["player1_score"]) + " - P2: " + str(data["player2_score"]))
    print("[" + "{:.2f}".format(data["player1_x"]) + "," + "{:.2f}".format(data["player1_y"]) + "] [" + "{:.2f}".format(data["ball_x"]) + "," + "{:.2f}".format(data["ball_y"]) + "] [" + "{:.2f}".format(data["player2_x"]) + "," + "{:.2f}".format(data["player2_y"]) + "]")

def main():
    args = sys.argv

    if len(args) < 2:
        print("Missing command")
        exit(1)

    match args[1]:
        case "init":
            print("Game is reset")
            data = createData()
            try:
                with open('/tmp/cert.pem', 'w', encoding='utf8') as fp:
                    fp.write(ssl.get_server_certificate(('localhost',1050)))
                res = requests.post('https://localhost:1050/pong/jeu_test/',None,data,verify='/tmp/cert.pem')
                response = json.loads(res.text)
                response["playing"] = True
                print_update(response)
                with open('pongCLI_data.json', 'w') as f:
                    f.write(json.dumps(response))
                    f.close()
                os.remove('/tmp/cert.pem')
            except Exception:
                print("Connection error")
                exit(1)

        case "update":
            if len(args) < 3:
                print("Missing time (in ms)")
                exit(1)
            elif not args[2].isdigit():
                print("Time should be an integer")
                exit(1)
            with open('pongCLI_data.json', 'r+') as f:
                data = json.load(f)
                data["request"] = 2
                try:
                    with open('/tmp/cert.pem', 'w', encoding='utf8') as fp:
                        fp.write(ssl.get_server_certificate(('localhost',1050)))
                    res = requests.post('https://localhost:1050/pong/jeu_test/',None,data,verify='/tmp/cert.pem')
                    response = json.loads(res.text)
                    print_update(response)
                    response["lastUpdate"] = 0
                    response["updateTime"] = int(args[2])
                    f.seek(0)
                    f.write(json.dumps(response))
                    f.truncate()
                    f.close()
                    os.remove('/tmp/cert.pem')
                except Exception:
                    print("Connection error")
                    exit(1)
        case "mv":
            if len(args) < 3:
                print("Missing direction")
                exit(1)
            if args[2] == "up":
                dir = -1
            elif args[2] == "down":
                dir = 1
            elif args[2] == "stop":
                dir = 0
            else:
                print("Unknown direction")
                exit(1)
            print("moving player " + args[2])
            with open('pongCLI_data.json', 'r+') as f:
                data = json.load(f)
                data["request"] = 2
                data["player1_dir"] = dir
                data["player2_dir"] = dir
                f.seek(0)
                f.write(json.dumps(data))
                f.truncate()
                f.close()
        case _:
            print("Unknown command")
            exit(1)

if __name__ == "__main__":
    main()