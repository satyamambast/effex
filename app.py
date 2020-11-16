
from flask import Flask, render_template,request
import os
app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        req = request.form
        print(req)
    return render_template("index.html")
@app.route("/mode", methods=["GET", "POST"])
def mode():
    if request.method == "POST":
        req = request.form
        print(req)
    

if __name__ == "__main__":
    app.run(debug=True)