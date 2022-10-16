import json, sys, os
from Wordle import Wordle
from Quordle import Quordle

def ok(output) :
    headers = {}
    if "CORS_ORIGIN" in os.environ:
        headers = {
            "Access-Control-Allow-Headers": 
            "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Methods": "GET,POST",
            "Access-Control-Allow-Origin": os.environ.get("CORS_ORIGIN")
        }

    return {
        "headers": headers,
        "statusCode": 200,
        "body": json.dumps(
            output
        )
    }

def handler(event, context) :
    if 'body' in event:
        data = event['body']
        # deserialize if necessary
        try:
            if type(data) is str:
                data = json.loads(data)
        except:
            return ok("Unable to parse JSON - did you forget to specify Content-type on your request?")

        if data['operation'].startswith("q"):

            quordle = Quordle(sqlite_dbname = data.get('sqlite_dbname', os.environ.get('SQLITE_DBNAME')),
                              sqlite_folder = data.get('sqlite_folder', os.environ.get('SQLITE_FOLDER')),
                              debug = data.get("debug", False),
                              scores_list = data.get("scores_list", []),
                              guesses = data.get("guesses", []),
                              hard_mode = data.get('hard_mode', False))

            if data['operation'] == "qguess":
                return ok(quordle.guess())

            if data['operation'] == "qsolve":
                return ok(quordle.solve(data['targets'], data.get("start_with", [])))

        else:
            wordle = Wordle(sqlite_dbname = data.get('sqlite_dbname', os.environ.get('SQLITE_DBNAME')),
                            sqlite_folder = data.get('sqlite_folder', os.environ.get('SQLITE_FOLDER')),
                            debug = data.get("debug", False),
                            hard_mode = data.get('hard_mode', False),
                            guess_scores = data.get('guess_scores', []))

            if data['operation'] == "remaining_answers":
                return ok(wordle.remaining_answers())

            if data['operation'] == "guess":
                return ok(wordle.guess())

            if data['operation'] == "rate_guess":
                return ok(wordle.guess(data.get("guess", None)))

            if data['operation'] == "rate_all_guesses":
                return ok(wordle.rate_all_guesses())

            if data['operation'] == "solve":
                return ok(wordle.solve(data['target'], data.get("start_with", [])))



if __name__ == "__main__":
    with open(sys.argv[1]) as file:
        data = json.load(file)
        print(handler({"body": data}, None)['body'])
