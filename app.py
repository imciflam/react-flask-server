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
def main():
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
    auth_url = sp_oauth.get_authorize_url()
    print("Auth")
    return render_template('index.html', auth=auth_url)


@app.route('/callback')
def callback():
    access_token = getToken()
    global sp
    # gets fb token if auto-d through fb!
    # throw warning about not being able to log in with fb
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
    # searching for artist and track
    #searchResults = sp.search(q='artist:' + 'the prodigy', type='artist')
    #searchItems = searchResults['artists']['items']
    # if len(searchItems) > 0:
    #    artist = searchItems[0]
    #    picture = artist['images'][len(artist['images'])-1]['url']
    #    print(artist['name'], picture)

    # trackSearchResults = sp.search(
    #    q='track:' + 'invaders must die', type='track')
    #trackSearchItems = trackSearchResults['tracks']['items']
    # if len(trackSearchItems) > 0:
    #    track = trackSearchItems[0]
    #    print(track['name'])
    #    print(track['preview_url'])
    #    print(track['artists'][0]['name'])

    # change this page to results later or through spa
    return render_template('index.html', auth=access_token)


if __name__ == '__main__':
    app.run()
