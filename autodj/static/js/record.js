$(document).ready(function() {
    const record = document.querySelector('#rec');
    const stop = document.querySelector('#stoprec');
    const soundclips = document.querySelector('#soundclips')

    $('#stoprec').attr('disabled', true)

    let audioCtx;

    function visualize(stream) {
        if(!audioCtx) {
        audioCtx = new AudioContext();
        }
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        console.log(source)
    }

    const constraints = { audio: true };
    let chunks = [];

    let onSuccess = function(stream) {
        const mediaRecorder = new MediaRecorder(stream);

        visualize(stream);

        record.onclick = function() {
        mediaRecorder.start();
        record.style.background = "red";
        stop.disabled = false;
        record.disabled = true;
        }

        stop.onclick = function() {
        mediaRecorder.stop();
        record.style.background = "";
        stop.disabled = true;
        record.disabled = false;
        }

        mediaRecorder.onstop = function(e) {
            const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
            chunks = [];


            const audio = document.createElement('audio');


            audio.setAttribute('controls', '');

            soundclips.appendChild(audio);

            audio.controls = true;

            const audioURL = window.URL.createObjectURL(blob);
            audio.src = audioURL;

            var formData = new FormData();
            formData.append('file', blob);
            $.ajax('/send/', {
                method: "POST",
                data: formData,
                processData: false,
                contentType: false,
            });
        }

        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data);
        }
    }

    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess);
});