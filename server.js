const express = require('express');
const Ziggeo = require('ziggeo');
const ZiggeoSdk = new Ziggeo(process.env.ZIGGEO_APP_TOKEN, process.env.ZIGGEO_PRIVATE_KEY, process.env.ZIGGEO_ENCRYPTION_KEY);
const app = require('express')();
const bodyParser = require('body-parser');
const port = 3000;

const fs = require('fs');

const cv = require('opencv4nodejs');

const smileClassifier = new cv.CascadeClassifier(cv.HAAR_SMILE);
const faceClassifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_DEFAULT)

app.use(bodyParser.json()); // for parsing application/json

// post route for processing videos.
// expected body: {'videoToken': as7sd79d}.
// app.post('/process-video', function (req, res) {
//     token = req.body.videoToken;
//     data = ZiggeoSdk.Videos.download_video(token);
//     // saving the data / persisting it

//     // ml magic 
//     newVideo = detectAndAnnotateSmile(data);
    
//     // fill in arguments with new video
//     ZiggeoSdk.Videos.create(arguments, [callbacks]);
//     res.send('OK');
// })


// annotate a new video with smiles if they exist.
// if exist return filePath else return empty string.
const annotateSmile = filePath => {
    // open file path as video capture stream and annotated path as video writer stream.
    newFilePath = 'annotated_' + filePath;
    vCap = new cv.VideoCapture(filePath);
    vWriter = new cv.VideoWriter(newFilePath, cv.VideoWriter.fourcc('MJPG'), 24, new cv.Size(640, 480));

    // iterate over frames, annotate them with smiles, and write them.
    hasSmile = false;
    done = false;
    while (!done) {
        let frame = vCap.read();
        if (frame.empty) {
            done = true;
        }

        // detect faces and smiles.
        faces = faceClassifier.detectMultiScale(frame);
        smiles = smileClassifier.detectMultiScaleWithRejectLevels(frame);

        // for each face, detect if a smile is in it and draw a rectangle around that smile and face.
        faces.objects.forEach(face => {
            frame.drawRectangle(new cv.Rect(face.x, face.y, face.width, face.height), new cv.Vec3(0,255,0));
            smiles.objects.forEach((smile, i) => {
                if(smiles.levelWeights[i] > 3.6 && inFace(smile, face)) {
                    frame.drawRectangle(new cv.Rect(smile.x, smile.y, smile.width, smile.height), new cv.Vec3(255,0,0));
                    hasSmile = true;
                }
            })
        });

        // write the frame to the video steam.
        vWriter.write(frame);
    }
    
    vWriter.release();
    if(hasSmile) {
        return newFilePath;
    }

    fs.unlinkSync(newFilePath)
    return '';
}

// check if the coordinates of the smile is within the coordinaes of the face.
const inFace = (smile, face) => {
    smileX1 = smile.x
    smileY1 = smile.y
    smileX2 = smile.x + smile.width
    smileY2 = smile.y + smile.height
   
    faceX1 = face.x
    faceY1 = face.y
    faceX2 = face.x + face.width
    faceY2 = face.y + face.height

    if ((smileX1 > faceX1 && smileX1 < faceX2) && (smileX2 > faceX1 && smileX2 < faceX2)
        &&  (smileY1 > faceY1 && smileY1 < faceY2) && (smileY2 > faceY1 && smileY2 < faceY2)) {
        return true
    }
    return false
}

videoToken = 'de2839177944158707d89fe4af808207';
annotatedVideo = '';
ZiggeoSdk.Videos.download_video(videoToken, {
    success: function(result) {
        fs.writeFile(videoToken + '.mp4', result, {}, (err, res) => {
            if(err){
                console.error(err)
                return
            }
            console.log('video saved')
            annotatedVideo = annotateSmile(videoToken + '.mp4');
            ZiggeoSdk.Videos.create({
                file: annotatedVideo,
            }, {
                success: function(result) {
                    console.log(result.token)
                }
            });
        })

        
    }
});
//app.listen(port);



