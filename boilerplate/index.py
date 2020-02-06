from flask import Flask, render_template, url_for
app = Flask(__name__, template_folder='client', static_url_path='/static')

#Comment out in production, stops static caching
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 5

@app.route("/")
def index():
    return render_template('main.html')

if __name__ == "__main__":
    app.run()