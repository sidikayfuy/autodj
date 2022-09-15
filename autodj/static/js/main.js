function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

$(document).ready(function(){

    //1 функция (увеличение картинок при наведении в блоке плюсов приложения)
    $('.advantages img').hover(function() {
        $(this).animate({width:"150px", height:"150px"}, 100);
        },
        function(){
         $(this).animate({width:"100px", height:"100px"}, 100);
        }
    );

    //2 функция появление информации при прокрутке
    $(window).scroll(function (){
        if($(window).scrollTop()>700){


           $('.elem').attr('style', 'opacity: 1; transition: 1s ease;')
        }
    });

    function reloadtrig(){
        $('#selecttriggers').empty();
        $.ajax({
            headers: {'X-CSRFToken': getCookie('csrftoken')},
            method: 'GET',
            url: '/loadtrigger/',
            success: function (data){
                let triggeri = data['data'];
                let combo = data['combo'];
                console.log(combo)
                $.each(combo, function (key, data){
                    $('#selecttriggers').append('<option id=opt'+key+'>' +
                    '<div className="col-8" id="wordstrigger'+key+'">' +
                    '<h2>Слова триггеры: </h2></option>')
                    let number = 'opt'+key
                    let num = key
                    $.each(data, function (key,value){
                        if (key === 'words'){
                            $.each(value, function (key,val){
                                $('#wordstrigger'+num).append('<p>'+val+' </p>')
                            });
                        }
                        if (key === 'file'){
                            $(document).find('#'+number).append('<div className="col-4">' +
                                '<h2> --- Песня: </h2>' +
                                '<p>'+value+'</p>' +
                                '</div>')
                        }
                    })
                });
                $.each(triggeri, function (key, data){
                    $('#selecttriggers').append('<option id=opt'+key+'>' +
                    '<div className="col-8" id="wordstrigger'+key+'">' +
                    '<h2>Слова триггеры: </h2></option>')
                    let number = 'opt'+key
                    let num = key
                    $.each(data, function (key,value){
                        if (key === 'words'){
                            $.each(value, function (key,val){
                                $('#wordstrigger'+num).append('<p>'+val+' </p>')
                            });
                        }
                        if (key === 'file'){
                            $(document).find('#'+number).append('<div className="col-4">' +
                                '<h2> --- Песня: </h2>' +
                                '<p>'+value+'</p>' +
                                '</div>')
                        }
                    })
                });
            }
        });
        $('#modal').modal('show')
    };

    $('#add_scen').on('click',function (){
        reloadtrig();
    });

    $('#save_scen').on('click', function (){
        let title = $('#titlescen').val()
        let triggers = '';
        $.each($('#selecttriggers option:selected'), function (){
           triggers += ($(this).attr('id'))+', '
        });
        console.log(triggers)
        $.ajax({
            headers: {'X-CSRFToken': getCookie('csrftoken')},
            url: '/addscen/',
            method: 'POST',
            data: {'title': title, 'triggers': triggers},
            success: function (){
                window.location.reload()
            }
        });
    });

    $('#save-trigger').on('click', function(){
        let data = new FormData();
        data.append("file", $("#filefortrigger").prop('files')[0]);
        data.append("words", document.getElementById('wordsfortrigger').value);
        $.ajax({
            headers: {'X-CSRFToken': getCookie('csrftoken')},
            method: 'POST',
            url: '/addtrigger/',
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            data: data,
            success: function (){

                $('#triggermodal').modal('hide');
                $('#add_scen').click();
            }
        })
    });

    $('.edit-scen').on('click', function (){
        let scen_id = $(this).parents()[1].id;
        let thistrig = $(this).parents()[1].getElementsByClassName('scen-trig')
        let anoter = document.getElementsByClassName('scen-trig')

        $.each(anoter,function (){
            $(this).empty();
            $(this).removeClass('active')
        })
        if ($(thistrig).hasClass('active')){
            $(thistrig).empty();
            $(thistrig).removeClass('active')
        }
        else {
            $(thistrig).addClass('active')

            $.ajax({
                headers: {'X-CSRFToken': getCookie('csrftoken')},
                method: 'GET',
                url: '/loadscentrig/',
                data: {'id': scen_id},
                success: function (data) {
                    let datas = data['data']
                    $.each(datas, function (key, data) {
                        $(thistrig).append('<option id=opt' + key + '>' +
                            '<div className="col-8" id="wordstrigger' + key + '">' +
                            '<h2>Слова триггеры: </h2></option>')
                        let number = 'opt' + key
                        let num = key
                        $.each(data, function (key, value) {
                            if (key === 'words') {
                                $.each(value, function (key, val) {
                                    $('#wordstrigger' + num).append('<p>' + val + ' </p>')
                                });
                            }
                            if (key === 'file') {
                                $(document).find('#' + number).append('<div className="col-4">' +
                                    '<h2> --- Песня: </h2>' +
                                    '<p>' + value + '</p>' +
                                    '</div>')
                            }
                        })


                    })
                    thistrig = null;
                }
            });
        }
    });




    $('#start').on('click', function (){
        let final = false;
        let finalstop = false;
        $('#mainplayer').attr('src', 'http://127.0.0.1:8000'+($(document).find('.file')[0]).innerText)
        let first = $(document).find('.words')[0];
        $(first).css('background-color', '#995757')
        $('.recording').show()
        let recog = new webkitSpeechRecognition;
        recog.lang = 'ru-RU';
        recog.interimResults = false;
        recog.continuous = false;
        recog.start();
        let interactive = null;
        recog.onresult = function (event){
            let finalcount = 0;
            let finalcheck = $(document).find('.words')
            $.each(finalcheck,function (){
                console.log($(this).css('background-color'))
                if ($(this).css('background-color') === 'rgb(153, 87, 87)'){
                    finalcount++
                }
                if (finalcount === finalcheck.length-1){
                    final = true
                }
            })
            let res = event.results[0][0].transcript
            recog.stop()
            $('#resultrec').val(res);

            $.each($('.words'), function (){
                let words = $(this)[0].innerText.replace('Слова триггеры:\n\n', '').trim().split('\n\n')
                for (let m=0; m<words.length; m++){
                    if (res.trim().toLowerCase().indexOf(words[m])>=0){
                        if (interactive !== null){
                            let parent = $(document).find('.combo div')
                            if (interactive === parent[0].innerText.replace('Слова триггеры:\n\n').toUpperCase()){
                                let childs = $(parent)
                                $.each(childs, function (){
                                    if ($(this).hasClass('childd')){
                                        let chwords = $(this)[0].innerText.replace('Слова триггеры:\n\n', '').trim().split('\n\n')
                                        for (let g=0; g<chwords.length; g++){
                                            if (res.trim().toLowerCase().indexOf(chwords[g])>=0) {
                                                $('#mainplayer').attr('src', 'http://127.0.0.1:8000' + $(this).find('.file').text().trim());
                                                if($(this).find('.type').text().trim()==='финал'){
                                                    interactive = null;
                                                }
                                                $(this).find('.words').css('background-color', '#995757')
                                                break
                                            }
                                        }
                                    }
                                })
                            }
                            break
                        }
                        if ($(this).parents()[1].className !== 'childd'){
                            if ($(this).parents()[0].getElementsByClassName('type')[0].innerText === 'финал'){

                                if (final === true){
                                    $('#mainplayer').attr('src', 'http://127.0.0.1:8000'+$(this).parents()[0].getElementsByClassName('file')[0].innerText)
                                    $(this).css('background-color', '#995757')
                                    finalstop = true
                                }
                            }
                            else {
                                $('#mainplayer').attr('src', 'http://127.0.0.1:8000'+$(this).parents()[0].getElementsByClassName('file')[0].innerText)
                                $(this).css('background-color', 'rgb(153, 87, 87)')
                            }

                        }

                        if ($(this).parents()[0].className.indexOf('combo') >=0){
                            interactive = $(this).parents()[0].getElementsByClassName('words')[0].innerText.replace('Слова триггеры:\n\n').toUpperCase()
                            console.log(interactive)
                            break
                        }
                    }
                }

            });

        }

        recog.onspeechstart = function (){
            console.log('poymala rech')
            $('#mainplayer').animate({volume:0.1},100)
        }
        recog.onstart = function (){
            console.log('raspoznavanie')
        }
        recog.onend = function (){
            console.log('molchu')
            $('#mainplayer').animate({volume:1},100)
            if(finalstop !== true){
                recog.start()
            }

        }
        // let i = 0;
        // recog.onspeechstart = function (event){
        //     console.log(event)
        //     console.log('govoru')
        //
        //     $('#mainplayer').animate({volume:0.5},100)
        // }
        // recog.onend = function (event){
        //     console.log(event)
        //     console.log('perestal')
        //
        //     $('#mainplayer').animate({volume:1},100)
        //
        //
        // }
        // recog.onresult = function (event){
        //     recog.stop()
        //     let res = event.results[i][0].transcript
        //     $('#resultrec').val(event.results[i][0].transcript);
        //     i++
        //     $('#mainplayer').animate({volume:1},100)
        //     $.each($('.words'), function (){
        //         let words = $(this)[0].innerText.replace('Слова триггеры:\n\n', '').trim().split('\n\n')
        //         for (let m=0; m<words.length; m++){
        //             if (res.trim().toLowerCase().indexOf(words[m])>=0){
        //                 if ($(this).parents()[0].className !== 'childd'){
        //                     $('#mainplayer').attr('src', 'http://127.0.0.1:8000'+$(this).parents()[0].getElementsByClassName('file')[0].innerText)
        //                 }
        //             }
        //         }
        //
        //     });
        //
        //
        // }

        // recognition = new webkitSpeechRecognition();

        // const soundclips = document.querySelector('#soundclips')
        //
        //
        // let audioCtx;
        //
        // function visualize(stream) {
        //     if(!audioCtx) {
        //     audioCtx = new AudioContext();
        //     }
        //     const source = audioCtx.createMediaStreamSource(stream);
        //     const analyser = audioCtx.createAnalyser();
        //     analyser.fftSize = 2048;
        //     source.connect(analyser);
        //     console.log(source)
        // }
        //
        // const constraints = { audio: true };
        // let chunks = [];
        //
        // let onSuccess = function(stream) {
        //     const mediaRecorder = new MediaRecorder(stream);
        //
        //     visualize(stream);
        //
        //     record.onclick = function() {
        //
        //     mediaRecorder.start();{
        //
        //     record.style.background = "red";
        //     stop.disabled = false;
        //     record.disabled = true;
        //     }
        //
        //     stop.onclick = function() {
        //     // mediaRecorder.stop();
        //     record.style.background = "";
        //     stop.disabled = true;
        //     record.disabled = false;
        //     }
        //
        //     mediaRecorder.onstop = function(e) {
        //         const blob = new Blob(chunks, { 'type' : 'audio/mpeg-3' });
        //         chunks = [];
        //
        //
        //         const audio = document.createElement('audio');
        //
        //
        //         audio.setAttribute('controls', '');
        //
        //         soundclips.appendChild(audio);
        //
        //         audio.controls = true;
        //
        //         const audioURL = window.URL.createObjectURL(blob);
        //         audio.src = audioURL;
        //
        //         var formData = new FormData();
        //         formData.append('file', blob);
        //         $.ajax('/send/', {
        //             method: "POST",
        //             data: formData,
        //             processData: false,
        //             contentType: false,
        //         });
        //     }
        //
        //     mediaRecorder.ondataavailable = function(e) {
        //         chunks.push(e.data);
        //     }
        // }
        //
        // navigator.mediaDevices.getUserMedia(constraints).then(onSuccess);
        // $('.recording').show()

    });
    // let keyPressed = false;



    // $(document).on('keydown',function(event){
    //     let keycode = (event.keyCode ? event.keyCode : event.which);
    //
    //     if (keyPressed === false){
    //         $('#mainplayer').animate({volume:0.1},500);
    //         if(keycode === 75){
    //             recognition.lang = 'ru';
    //             recognition.interimResults = true;
    //             recognition.start();
    //             recognition.onstart = function (event){
    //
    //             };
    //
    //             recognition.onend = function (){
    //
    //                 console.log('22222')
    //                 recognition.stop();
    //                 recognition.onresult = function (event){
    //                     recognition.stop();
    //                    let res = event['results'][0][0]['transcript'].toLowerCase().replace(',','').replace(' ','')
    //                     console.log('res='+res)
    //                    $('#resultrec').val(res);
    //                    $.each($('.scencard'), function (){
    //                        let tex = ($(this)[0].innerText.split('\n\n'))
    //                        let audio = tex[tex.length-1]
    //                        let words = $(this)[0].innerText.split(':')[1].split('/')[0].replace('\n\n', '').split('\n\n');
    //                        words.splice(-1);
    //                        console.log(words)
    //                        $.each(words, function (){
    //                            // console.log(this.toString())
    //                            // console.log(res.toString())
    //                           if (res.includes(this.toString().toLowerCase().replace(' ',''))){
    //                               console.log('!!!!!!!!!!')
    //                               if ($('#mainplayer').attr('src')!= audio){
    //
    //
    //                                   $('#mainplayer').attr('src', audio);
    //                                     // $('#mainplayer').animate({volume:1},100);
    //
    //                               }
    //
    //                           }
    //                        });
    //                    });
    //                    res=null;
    //                };
    //                 recognition.start();
    //             };
    //         }
    //     }
    //     keyPressed = true;
    //
    //     $(this).on('keyup', function() {
    //         if (keyPressed === true){
    //         $('#mainplayer').animate({volume:1},500);
    //     }
    //         keyPressed = false;
    //         recognition.stop()
    //         recognition.onend = function (){
    //             recognition.stop()
    //         }
    //         keyPressed = false;
    //
    //         // $('#mainplayer').prop("volume", 1);
    //     });
    // });

    // $('#recb').on('click',function (){
    //
    //     recognition.lang = 'ru';
    //     recognition.interimResults = true;
    //     recognition.start();
    //     recognition.onstart = function (event){
    //
    //     };
    //
    //     recognition.onend = function (){
    //
    //         console.log('22222')
    //         recognition.stop();
    //         recognition.onresult = function (event){
    //             recognition.stop();
    //            let res = event['results'][0][0]['transcript'].toLowerCase().split(' ')
    //             console.log('res='+res)
    //            $('#resultrec').val(res);
    //            $.each($('.scencard'), function (){
    //                let tex = ($(this)[0].innerText.split('\n\n'))
    //                let audio = tex[tex.length-1]
    //                let words = $(this)[0].innerText.split(':')[1].split('/')[0].replace('\n\n', '').split('\n\n');
    //                words.splice(-1);
    //                console.log(words)
    //                $.each(words, function (){
    //                    // console.log(this.toString())
    //                    // console.log(res.toString())
    //                   if (res.includes(this.toString())){
    //                       console.log('!!!!!!!!!!')
    //                       if ($('#mainplayer').attr('src')!= audio){
    //                           $('#mainplayer').attr('src', audio)
    //                           $('#mainplayer').prop("volume", 1);
    //                       }
    //
    //                   }
    //                });
    //            });
    //            res=null;
    //        };
    //         recognition.start();
    //     };
    //    if ($(this).attr('rec') === 'false'){
    //        $(this).attr('rec', 'true');
    //    //     recognition.lang = 'ru';
    //    //     recognition.interimResults = true;
    //    //     recognition.start();
    //    // }
    //    // else{
    //    //     $(this).attr('rec', 'false')
    //    //     recognition.stop();
    //    //     recognition.onresult = function (event){
    //    //         let res = event['results'][0][0]['transcript'].toLowerCase()
    //    //         $('#resultrec').val(res);
    //    //         $.each($('.scencard'), function (){
    //    //             let tex = ($(this)[0].innerText.split('\n\n'))
    //    //             let audio = tex[tex.length-1]
    //    //             let words = $(this)[0].innerText.split(':')[1].split('/')[0].replace('\n\n', '').split('\n\n');
    //    //             $.each(words, function (){
    //    //                 console.log(this.toString())
    //    //                 console.log(res.toString())
    //    //                if (this.toString() === res.toString()){
    //    //                    $('#mainplayer').attr('src', audio)
    //    //                }
    //    //             });
    //    //         });
    //    //     }
    //    // }
    // });
    //
    // $('#stoprecb').on('click',function (){
    //     recognition.stop()
    //     recognition.onend = function (){
    //         recognition.stop()
    //     }
    // });
});





