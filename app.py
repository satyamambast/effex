

from sys import stdout
from flask import Flask, render_template,request
from flask import Response
import logging
from flask_socketio import SocketIO
import os
from conversions import *
import cv2
import numpy as np
app = Flask(__name__)
app.logger.addHandler(logging.StreamHandler(stdout))
socketio = SocketIO(app)
fullframe=None
@socketio.on('input image', namespace='/test')
def test_message(input):
    input_str = input.split(",")[1]
    p_image=base64_to_pil_image(input_str)
    print(p_image)
    
    


@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        req = request.form
        print(req)
    return render_template("index.html")

def gen():
    """Video streaming generator function."""

    app.logger.info("starting to generate frames!")
    while True:
        if fullframe==None:
            continue
        # frame = camera.get_frame() #pil_image_to_base64(camera.get_frame())
        # yield (b'--frame\r\n'
        #        b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/video_feed')
def video_feed():
    """Video streaming route. Put this in the src attribute of an img tag."""
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')

    

if __name__ == "__main__":
    app.run(debug=True)