import spotipy
from spotipy import oauth2
import urllib.parse as urlparse
from flask import Flask, render_template, request, jsonify

SPOTIPY_CLIENT_ID = '032bb2c730e645968318b1811d084943'
SPOTIPY_CLIENT_SECRET = '5892fdf2a41948e1ae73078e4cecb6f2'
SPOTIPY_REDIRECT_URI = 'http://127.0.0.1:5000/callback'
SCOPE = 'user-top-read'
sp_oauth = oauth2.SpotifyOAuth(
    SPOTIPY_CLIENT_ID, SPOTIPY_CLIENT_SECRET, SPOTIPY_REDIRECT_URI, scope=SCOPE)

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def hello():
    parsed = urlparse.urlparse(request.url)
    if 'code' in urlparse.parse_qs(parsed.query):
        access_token = getToken()
        print("Access token available! Trying to get user information..\.")
        return showQuizlist(access_token)
    else:
        return Auth()


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


def Auth():
    auth_url = getSPOauthURI()
    return render_template('login.html', auth=auth_url)


def getSPOauthURI():
    auth_url = sp_oauth.get_authorize_url()
    return auth_url


@app.route('/callback')
def callback():
    access_token = getToken()
    global sp
    sp = spotipy.Spotify(access_token)
    results = sp.current_user_top_tracks(
        limit=5, offset=0, time_range='short_term')
    for item in results['items']:
        track = item['name']
        preview_url = item['preview_url']
        artist = item['artists'][0]['name']
        print(track)
        print(preview_url)
        print(artist)
    return render_template('login.html', auth=access_token)


if __name__ == '__main__':
    app.run()
