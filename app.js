var accessToken = "1dd7d5b1ef0d43af8ccae2e065a4a985",
baseUrl = "https://api.api.ai/v1/",
$textInput, // What client fills in text inputfield
$recBtn, // Send button
recognition, // var to store webkitSpeechRecognition()
messageRecording = "Recording...",
messageCouldntHear = "Could you repeat that please?",
messageInternalError = "Oh no, there has been an internal server error",
messageSorry = "I'm sorry, I don't have the answer to that yet.";

$(document).ready(function() {
$textInput = $("#text_input");
$recBtn = $(".record_button");

var inputReceived = false,
    greetings = ["Hello", "Bonjour", "Guten Tag"],
    randomGreeting = getRandomGreeting(greetings);

function greet(greeting){
    $('#chat-area').append('<div><img id="author-response" class="img-responsive author-response" src="/images/2sqrs_textual-logo.svg">' + '<strong class="chatdesk-response">  ' + greeting + ' </strong></div>');
    console.log('greeting');
    console.log(greeting);
    console.log('this4')
    console.log(this);
}
    
function getRandomGreeting(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}
    
setTimeout(function(){
    if(!inputReceived){ // if ( inputRecieved !== true)
        greet(randomGreeting);
    }
}, 5000);

// If user press enter, send data to Api.ai via send()function
$textInput.keypress(function (event) {


    if (event.which == 13) {
        event.preventDefault();
    
        send();
        // if (this.id == 'text_input') {
        // 	console.log('this1');
        // 	console.log(this);
        // 	alert('text input is pressed');

        // 	send();
        // } else { 
        // 	function greet(greeting){
        // 		console.log('greeting')
        // 		console.log(greeting);
        // 	  }
              
        // 	  function getRandom(arr){
        // 		return arr[Math.floor(Math.random()*arr.length)];
        // 	  }
              
        // 	  var greetings = ["Hello", "Bonjour", "Guten Tag"],
        // 		  randomGreeting = getRandom(greetings);
              
        // 	  setTimeout(function(){
        // 		greet(randomGreeting);
        // 	  }, 1000);
        // }

        console.log('this3')
        console.log(this)
        $('#chat-area').append('<div><h4 class="visitor-response">You</h4>' + '<strong class="myInput"> ' + $(this).val() + ' </strong></div>');
    
        
        
    
    }

    
});
// If user clicks send button, run switchRecognition()
// $recBtn.on("click", function (event) {
$recBtn.on("click", function (event) {
    // switchRecognition(); 
    send();

    // console.log(this);
    // if(this.class == $recBtn) {
    // 	alert('recBtn is clicked')
    
    
});


$(".debug__button").on("click", function () {
    $(this).toggleClass("is-active");
    $(this).next().toggleClass("is-active");
    return false;
});

// HTML5 Speech Recognition
function startRecognition() {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function (event) {
        respond(messageRecording);
        updateRec();
    };
    // parse result of data being recorded
    recognition.onresult = function (event) {
        recognition.onend = null;

        var text = "";
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
        }
        setInput(text);
        stopRecognition();
    };
    // when the voice recognition ends..
    recognition.onend = function () {
        respond(messageCouldntHear);
        stopRecognition();
    };
    recognition.lang = "en-US";
    recognition.start();
}

function stopRecognition() {
    if (recognition) {
        recognition.stop();
        recognition = null;
    }
    updateRec();
}

// toggle function to check if user starts or stops recognition
function switchRecognition() {
    if (recognition) {
        stopRecognition();
    } else {
        startRecognition();
    }
}

function setInput(text) {
    $textInput.val(text);
    send();
}

// switches text for recording from stop to speak
function updateRec() {
    $recBtn.text(recognition ? "Stop" : "Speak");
}

// sending json data to api.ai function
function send() {
    var text = $textInput.val();
    inputReceived = true;
    $.ajax({
        type: "POST",
        url: baseUrl + "query",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        data: JSON.stringify({query: text, lang: "en", sessionId: "somerandomthingr"}),

        success: function (data) {
            prepareResponse(data);
        },
        error: function () {
            respond(messageInternalError);
        }
    });
}

// Returned json data from api.ai
function prepareResponse(val) {
    console.log('val');
    console.log(val);
    var debugJSON = JSON.stringify(val, undefined, 2),
        apiaiResponse = val.result.speech;

    respond(apiaiResponse);
    console.log('apiapiResponse');
    console.log(apiaiResponse);
    
    debugRespond(debugJSON);
    console.log('debugJSON');
    console.log(debugJSON);
}

function debugRespond(val) {
    $('#response').text(val);
    console.log('val2');
    console.log(val);
}


function respond(val) {
    console.log('val2');
    console.log(val);
    if (val == "") {
        val = messageSorry;
    }
    // if recording then use voice response
    if (val !== messageRecording) {
        var msg = new SpeechSynthesisUtterance();
        msg.voiceURI = "native";
        msg.text = val;
        msg.lang = "en-US";
        window.speechSynthesis.speak(msg);
        console.log('msgtext');
        console.log(msg.text);
        $('#chat-area').append('<div><img id="author-response" class="img-responsive author-response" src="/images/2sqrs_textual-logo.svg">' + '<strong class="chatdesk-response">  ' + msg.text + ' </strong></div>');
    }
}
});

