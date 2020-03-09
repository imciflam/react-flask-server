import spotipy
from spotipy import oauth2
import urllib.parse as urlparse
from flask import Flask, render_template, request, jsonify, make_response, redirect, url_for
import json
import requests

SPOTIPY_CLIENT_ID = '032bb2c730e645968318b1811d084943'
SPOTIPY_CLIENT_SECRET = '5892fdf2a41948e1ae73078e4cecb6f2'
SPOTIPY_REDIRECT_URI = 'http://127.0.0.1:5000/callback'
SCOPE = 'user-top-read'
sp_oauth = oauth2.SpotifyOAuth(
    SPOTIPY_CLIENT_ID, SPOTIPY_CLIENT_SECRET, SPOTIPY_REDIRECT_URI, scope=SCOPE)

app = Flask(__name__, template_folder='client', static_url_path='/static')
sp = ''
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

    # searching for artist and track
    # searchResults = sp.search(q='artist:' + 'the prodigy', type='artist')
    # searchItems = searchResults['artists']['items']
    # if len(searchItems) > 0:
    #    artist = searchItems[0]
    #    picture = artist['images'][len(artist['images'])-1]['url']
    #    print(artist['name'], picture)

    # trackSearchResults = sp.search(
    #    q='track:' + 'invaders must die', type='track')
    # trackSearchItems = trackSearchResults['tracks']['items']
    # if len(trackSearchItems) > 0:
    #    track = trackSearchItems[0]
    #    print(track['name'])
    #    print(track['preview_url'])
    #    print(track['artists'][0]['name'])

    # change this page to results later or through spa
    # return redirect(url_for('list'))
    return render_template('login.html')


@app.route('/list', methods=['GET', 'POST'])
def list():
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
    # print(type(top_tracks_data)) list
    # print(type(json.dumps(top_tracks_data)))  # str
    # json.dumps(top_tracks_data)
    headers = {'Content-Type': 'application/json'}
    answer = requests.post('http://127.0.0.1:5001/cnn',
                           json=json.dumps(top_tracks_data), headers=headers)
    return answer.text


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
    # print(type(top_tracks_data)) list
    # print(type(json.dumps(top_tracks_data)))  # str
    # json.dumps(top_tracks_data)
    print(top_tracks_data)
    headers = {'Content-Type': 'application/json'}
    answer = requests.post('http://127.0.0.1:5002/knn',
                           json=json.dumps(top_tracks_data), headers=headers)
    return answer.text


@app.route('/search', methods=['POST'])
def searchResults():
    # searching for artist and track
    searchResults = sp.search(q='artist:' + 'the prodigy', type='artist')
    searchItems = searchResults['artists']['items']
    if len(searchItems) > 0:
        artist = searchItems[0]
        picture = artist['images'][len(artist['images'])-1]['url']
        print(artist['name'], picture)
    trackSearchResults = sp.search(
        q='track:' + 'invaders must die', type='track')
    trackSearchItems = trackSearchResults['tracks']['items']
    if len(trackSearchItems) > 0:
        track = trackSearchItems[0]
        print(track['name'])
        print(track['preview_url'])
        print(track['artists'][0]['name'])


if __name__ == "__main__":
    app.run()
