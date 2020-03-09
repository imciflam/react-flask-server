import spotipy
from spotipy import oauth2
import urllib.parse as urlparse
from flask import Flask, render_template, request, jsonify, make_response, redirect, url_for
import json
import requests
from spotipy.oauth2 import SpotifyClientCredentials


SPOTIPY_CLIENT_ID = '032bb2c730e645968318b1811d084943'
SPOTIPY_CLIENT_SECRET = '5892fdf2a41948e1ae73078e4cecb6f2'
SPOTIPY_REDIRECT_URI = 'http://127.0.0.1:5000/callback'
SCOPE = 'user-top-read'
sp_oauth = oauth2.SpotifyOAuth(
    SPOTIPY_CLIENT_ID, SPOTIPY_CLIENT_SECRET, SPOTIPY_REDIRECT_URI, scope=SCOPE)

app = Flask(__name__, template_folder='client', static_url_path='/static')
sp = ''

client_credentials_manager = SpotifyClientCredentials(
    SPOTIPY_CLIENT_ID, SPOTIPY_CLIENT_SECRET)
sp_limited = spotipy.Spotify(
    client_credentials_manager=client_credentials_manager)


# Comment out in production, stops static caching
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 5


@app.route("/", methods=['GET', 'POST'])
def index():
    parsed = urlparse.urlparse(request.url)
    if 'code' in urlparse.parse_qs(parsed.query):
        access_token = getToken()
        print("main() - access token available")
    else:
        return render_template('main.html')


@app.route("/token", methods=['GET', 'POST'])
def Auth():
    auth_url = sp_oauth.get_authorize_url()
    return auth_url


def getToken():
    access_token = ""
    token_info = sp_oauth.get_cached_token()
    if token_info:
        print("Found cached token!")
        access_token = token_info['access_token']
    else:
        url = request.url
        code = sp_oauth.parse_response_code(url)
        if code:
            print(
                "Found Spotify auth code in Request URL! Trying to get valid access token..\.")
            token_info = sp_oauth.get_access_token(code)
            access_token = token_info['access_token']
            return access_token


@app.route('/callback')
def callback():
    access_token = getToken()
    global sp
    # gets fb token if auto-d through fb!
    # throw warning about not being able to log in with fb
    sp = spotipy.Spotify(access_token)
    return render_template('login.html')


@app.route('/cnnlist', methods=['GET', 'POST'])
def cnnlist():
    results = sp.current_user_top_tracks(
        limit=5, offset=0, time_range='medium_term')
    if results == []:
        results = sp.current_user_top_tracks(
            limit=5, offset=0, time_range='long_term')
    top_tracks_data = []
    for item in results['items']:
        track = item['name']
        preview_url = item['preview_url']
        artist = item['artists'][0]['name']
        top_track_data = {'artist': artist,
                          'track': track, 'preview_url': preview_url}
        top_tracks_data.append(top_track_data)
    headers = {'Content-Type': 'application/json'}
    answer = requests.post('http://127.0.0.1:5001/cnn',
                           json=json.dumps(top_tracks_data), headers=headers)

    final_results = searchResults(json.loads(answer.text))
    return json.dumps(final_results)


@app.route('/cnnitem', methods=['GET', 'POST'])
def cnnitem():
    input_data = request.json
    result = getTopSongByArtist(input_data)
    print(result)

    #headers = {'Content-Type': 'application/json'}
    # answer = requests.post('http://127.0.0.1:5001/cnn',
    #                       json=json.dumps(top_tracks_data), headers=headers)

    #final_results = searchResults(json.loads(answer.text))
    # return json.dumps(final_results)
    return 0


def searchResults(input_data):
    # searching for artist and track
    for element in input_data:
        element[0] = element[0].replace('_', ' ')
        element[0] = element[0].replace('.wav', '')
        searchItems = sp.search(q='track:' + element[0], type='track')
        if searchItems["tracks"]['items'] != []:
            track = searchItems["tracks"]["items"][0]
            if "preview_url" in track and track['preview_url'] != None:
                element.append(track['artists'][0]['name'])
                element.append(track['name'])
                element.append(track['preview_url'])
                element.pop(0)
                element.append(element.pop(0))
    return input_data


@app.route('/knnlist', methods=['GET', 'POST'])
def knnlist():
    results = sp.current_user_top_tracks(
        limit=5, offset=0, time_range='medium_term')
    if results == []:
        results = sp.current_user_top_tracks(
            limit=5, offset=0, time_range='long_term')
    top_tracks_data = []
    for item in results['items']:
        artist = item['artists'][0]['name']
        top_tracks_data.append(artist)
    headers = {'Content-Type': 'application/json'}
    answer = requests.post('http://127.0.0.1:5002/knn',
                           json=json.dumps(top_tracks_data), headers=headers)

    final_results = getTopSongByArtist(json.loads(answer.text))
    return json.dumps(final_results)


@app.route('/knnitem', methods=['GET', 'POST'])
def knnitem():
    input_data = request.json
    # send group name right into the model
    return 0


def getTopSongByArtist(input_data):
    if isinstance(input_data, str):
        # get temp token!
        results = sp_limited.search(q='artist:' + input_data, type='artist')
        artist_uri = 'spotify:artist:'+results["artists"]["items"][0]["id"]
        top_songs = sp_limited.artist_top_tracks(artist_uri)
        top_songs_list = []
        for track in top_songs['tracks'][:5]:
            if "preview_url" in track and track['preview_url'] != None:
                top_songs_list.append(
                    {'artist': input_data, 'name': track['name'], 'preview_url': track['preview_url']})
        return top_songs_list
    else:
        # searching for artist and track
        for element in input_data:
            results = sp.search(q='artist:' + element[0], type='artist')
            artist_uri = 'spotify:artist:'+results["artists"]["items"][0]["id"]
            top_songs = sp.artist_top_tracks(artist_uri)
            for track in top_songs['tracks'][:10]:
                if "preview_url" in track and track['preview_url'] != None:
                    element.append(track['name'])
                    element.append(track['preview_url'])
                    element.append(element.pop(1))
                    break
        return input_data


if __name__ == "__main__":
    app.run()
