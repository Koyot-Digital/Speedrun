from flask import Flask, render_template

app = Flask(__name__, static_url_path='/static', static_folder='static')

@app.route('/')
def startRedirect():
    return render_template("index.html")
if __name__ == '__main__':
    app.run(port=5500, host="0.0.0.0")
