const pathToFfmpeg        = require('ffmpeg-static-electron');
const Ffmpeg              = require('fluent-ffmpeg');
const ffdevices           = require('ffdevices');

Ffmpeg.setFfmpegPath(pathToFfmpeg.path);
// ffdevices.getAll(function(error, devices) {
//     if(!error) {
//       console.log(devices)
//     }
//   })
module.exports = {

    stream: ({video, audio, fbkey, url, audiobitrate, size, framerate}) => {
        return Ffmpeg()
        // only for windows
        .input(`video=${video}:audio=${audio}`)
        .inputFormat("dshow")  
        .addOutput(`${url}${fbkey}`)
        .outputOption([
            "-vcodec libx264",
            "-preset ultrafast",
            "-acodec aac",
            "-pix_fmt yuv422p"
        ])
        .audioBitrate(audiobitrate)
        .fps(framerate)
        .size(size)
        .format("flv")
    },
    setEvents: (emit, stream) => {
        stream
        .on('progress', function(progress) {
            console.log(progress);
            emit('streamOnProgress', progress)
        })
        .on('error', function(err) {
            // emit('streamError', err)
        })
        .on('end', function() {
            // emit('streamEnd')
        });

        return stream
    }

}