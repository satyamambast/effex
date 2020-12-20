function onCvLoaded () {
    console.log('cv', cv);
    cv.onRuntimeInitialized = onReady;
}
function saveanddownload()
{   
    var canvas1 = document.getElementById("canvasOutput")
    var element = document.createElement('a');
    element.setAttribute('href', canvas1.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    element.setAttribute('download', "effex.png");
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}
function finalchange(src,dst){
    out = new cv.Mat(height, width, cv.CV_8UC1);
    // var mode = document.getElementById("Effect").value;
    if(document.getElementById("mode1").checked==true){
        
        cv.cvtColor(src, out, cv.COLOR_RGBA2GRAY);
    }
    else if(document.getElementById("mode2").checked==true)
    {
        out=src;
        
    }
    else if(document.getElementById("thresh").checked==true)
    {
        cv.threshold(src, out, 177, 200, cv.THRESH_BINARY)
    }
    else if(document.getElementById("canny").checked==true)
    {
      cv.cvtColor(src, out, cv.COLOR_RGBA2GRAY);
      cv.Canny(out, out, 20, 90, 3, true);
      
    }
    
    else
    {
        out=src;
    }

    return out;

}
const video = document.getElementById('video');
const actionBtn = document.getElementById('actionBtn');
const width = 1280;
const height = 720;
const FPS = 30;
let stream;
let streaming = false;
function onReady () {
    let src;
    let dst;
    const cap = new cv.VideoCapture(video);

    actionBtn.addEventListener('click', () => {
        if (streaming) {
            stop();
            document.getElementById("actionBtn").style.backgroundColor = "white"; 

        } else {
            start();
            document.getElementById("actionBtn").style.backgroundColor = "red";
        }
    });

    function start () {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(_stream => {
            stream = _stream;
            console.log('stream', stream);
            video.srcObject = stream;
            video.play();
            streaming = true;
            src = new cv.Mat(height, width, cv.CV_8UC4);
            dst = new cv.Mat(height, width, cv.CV_8UC1);
            setTimeout(processVideo, 0)
        })
        .catch(err => console.log(`An error occurred: ${err}`));
    }

    function stop () {
        if (video) {
            video.pause();
            video.srcObject = null;
        }
        if (stream) {
            stream.getVideoTracks()[0].stop();
        }
        streaming = false;
    }

    function processVideo () {
        if (!streaming) {
            src.delete();
            dst.delete();
            return;
        }
        const begin = Date.now();
        cap.read(src)
        dst=finalchange(src)
        // cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
        cv.imshow('canvasOutput', dst);
        const delay = 1000/FPS - (Date.now() - begin);
        setTimeout(processVideo, delay);
    }
}
