const buttons = document.querySelectorAll('.mediaButtons');
let isPaused = false;
let whatPaused;
let interval;
let intervalTwenty;
let mute = false;
let playTitle = "Start the Timer(s)";
let pauseTitle = "Pause the Timer(s)";

let alertAudio = new Audio('alert.wav');
let hours;
let minutes;
let seconds;


let month = new Array(12);
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

let weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

function buttonCheck(button) {
    let element = document.getElementById(button);
    switch (button) {
        case 'play':
            playButton();
            break;
        case 'pause':
            pauseTimer();
            break;
        case 'stop':
            stopAll();
            break;
        case 'sound':
            buttonSwitch(element, 'mute');
            audioOff();
            mute = true;
            break;
        case 'mute':
            buttonSwitch(element, 'sound');
            mute = false;
            break;
        case 'sessionUp':
            changeValue(1, 'session');
            break;
        case 'sessionDown':
            changeValue(-1, 'session');
            break;
        case 'breakUp':
            changeValue(1, 'break');
            break;
        case 'breakDown':
            changeValue(-1, 'break');
               break;
        case 'twenty':
            twentyToggle();
            break;
        case 'sessionOutput':
        case 'breakOutput':
            captureNumber(button);
            document.getElementById('lengthButton').setAttribute('data-key',button);
            break;
        case 'lengthButton':
            submitButton(button, 'numberInput');
            hideToggle('timer', 'lengthQuest');
            break;
        case 'ff':
            seconds = 0;
            minutes = 0;
            hours = 0;
            buttonSwitch(document.getElementById('play'), 'pause');
            isPaused = false;
            break;
        case 'yesBreak':
            hideToggle('timer', 'breakQuest');
            audioOff();
            breakTime();
            break;
        case 'noBreak':
            audioOff();
            buttonSwitch(document.getElementById('play'), 'pause');
            hideToggle('timer', 'breakQuest');
            startTimer(10,'timeRemain','work');
            setBackground('rgba(150,150,250, .3)');
            break;
        case 'yesResume':
            stopAll();
            hideToggle('timer', 'breakQuest');
            whatPaused = undefined;
            audioOff();
            playButton();
            break;
        case 'noResume':
            stopAll();
            hideToggle('timer', 'breakQuest');
            audioOff();
            break;
    }
}

function playButton() {
    if (document.getElementById('play')) {
        buttonSwitch(document.getElementById('play'), 'pause', pauseTitle);
    }

    let status;
    if(whatPaused == undefined || whatPaused == 'Working Session') {
        setBackground('rgba(150,150,250, .3)');
        status = 'work';
    } else {
        setBackground('rgba(150,250,150, .3)');
        status = 'break'
    }
    console.log('Status at playButton:' + status);
    if (!isPaused) {
        startTimer(Number(document.getElementById('sessionOutput').innerHTML),'timeRemain',status);
        if(document.getElementById('twenty').checked == true) {  //deal with 20/20/20
            startTwenty(20,'twentyRemain');

        }
    }
    isPaused = false;
    whatPaused = undefined;

}

function pauseTimer() {
    if (document.getElementById('pause')) {
        buttonSwitch(document.getElementById('pause'), 'play',playTitle);
    }
    isPaused = true;
    setBackground('rgba(150,150,150, .3)');
    whatPaused = document.getElementById('status').innerHTML;
}

function audioOff() {
    alertAudio.pause();
    alertAudio.currentTime = 0;
}

function stopAll() {
    setBackground('rgba(150,150,150, .3)');
    buttonSwitch(document.getElementById('pause'), 'play');
    document.getElementById('timeRemain').innerHTML = '00:00:00';
    document.getElementById('twentyRemain').innerHTML = '20:00';
    displayStatus('');
    clearInterval(interval);
    clearInterval(intervalTwenty);
    isPaused = false;
    audioOff();
}

function displayStatus(status) {
    document.getElementById('status').innerHTML = status;
}


function breakTime() {
    stopAll();
    setBackground('rgba(150,250,150, .3)');
    playButton();
    startTimer(Number(document.getElementById('breakOutput').innerHTML),'timeRemain','break');
    displayStatus('Breaktime');
    buttonSwitch(document.getElementById('play'), 'pause');
}

function submitButton(button, input) {
    let key = document.getElementById(button).dataset.key;
    let value = document.getElementById(input).value;
    document.getElementById(key).innerHTML = value;

}

function captureNumber(button) {
    let element = document.getElementById('numberInput');
    document.getElementById('numberInput').value = '';
    hideToggle('timer', 'lengthQuest');
    let buttonStatus = (button).substring(0, button.length-6);
    element.innerHTML = buttonStatus + ' duration.';
    let current = Number(document.getElementById(button).innerHTML);
    element.setAttribute('value', current);
    element.value = current;
    element.select();
    element.focus();
}

function hideToggle() {
    for (let i = 0; i < arguments.length; i++) {
        document.getElementById(arguments[i]).hidden == false ? 
            document.getElementById(arguments[i]).hidden = true:
            document.getElementById(arguments[i]).hidden = false;     
    }
}

function startTwenty() {
    let minutesTwenty = 20;
    let secondsTwenty = 0;

    
    intervalTwenty = setInterval(function () {

        if (!isPaused) {
            document.getElementById('twentyRemain').innerHTML = secondsTwenty;

            secondsTwenty > 0 ? secondsTwenty -= 1: 
                minutesTwenty > 0 ? (minutesTwenty -= 1, secondsTwenty = 59) : 0;

            if (secondsTwenty == 0 && minutesTwenty == 0) {  //ask if they want to start break
                clearInterval(intervalTwenty);
                startTwenty();

                if(mute == false) {
                    alertAudio.play();
                }
            }
            document.getElementById('twentyRemain').innerHTML =
                ('0' + minutesTwenty.toString()).slice(-2) + ':' +
                ('0' + secondsTwenty.toString()).slice(-2);
        }
    }, 1000)
}


function startTimer(totalTime, location, status) {  
    hours = Math.floor(totalTime / 60); 
    minutes = (totalTime - (hours * 60));
    seconds = 0;
    document.getElementById(location).innerHTML =
        ('0' + hours.toString()).slice(-2) + ':' +
        ('0' + minutes.toString()).slice(-2) + ':' +
        ('0' + seconds.toString()).slice(-2);

    displayStatus('Working Session');
    interval = setInterval(function () {

        if (!isPaused) {
            document.getElementById(location).innerHTML = seconds;

            seconds > 0 ? seconds -= 1: 
                minutes > 0 ? (minutes -= 1, seconds = 59): 
                    hours > 0 ? (hours -= 1, minutes = 59, seconds = 59) : 0;

            if (seconds == 0 && minutes == 0 && hours == 0) {  //ask if they want to start break
                clearInterval(interval);
                pauseTimer();
                setBackground('rgba(150,150,150, .3)');
                //status == 'break' ? console.log('should go to resumeQuest'): console.log('should go to breakQuest');
                console.log('status at startTimer:' + status);
                if(status == 'break') {
                    document.getElementById('resumeAmt').innerHTML = document.getElementById('sessionOutput').innerHTML;
                    alertAudio.play();
                    hideToggle('resumeQuest', 'timer');

                } else {
                    if(mute == false) {
                        alertAudio.addEventListener('ended', function() {
                            this.currentTime = 0;
                            this.play();
    
                        },false);
                        alertAudio.play();
                    }
                    hideToggle('timer', 'breakQuest');

                }
                    console.log('******');
            }

            document.getElementById(location).innerHTML =
                ('0' + hours.toString()).slice(-2) + ':' +
                ('0' + minutes.toString()).slice(-2) + ':' +
                ('0' + seconds.toString()).slice(-2);
        }
    }, 1)
}



function changeValue(direction, timer) { // this needs to account for hours and should probably give an option to up the number by more than 1
    let time = Number(document.getElementById(timer + 'Output').innerHTML) + direction;
    document.getElementById(timer + 'Output').innerHTML = time;
}


function setBackground(color) {
    document.getElementById("timerContain").style.backgroundColor = color;
}

function buttonSwitch(element, nextButton, title) {
    if (element !== null) {
        element.src = nextButton + '.png';
        element.setAttribute('id', nextButton);
        element.setAttribute('title', title);
    }
}

function twentyToggle() {
    document.getElementById('twenty').checked == true ? 
        document.getElementById('twentyRemain').innerHTML = '00:20:00': 
        document.getElementById('twentyRemain').innerHTML = '';
    }


buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
        let buttonPress = button.id;
        buttonCheck(buttonPress);
    });
});

function clockTime() {
    setInterval(function () {

        let now = new Date();
        let hour = now.getHours().toString();
        let meridiem;
        hour > 12 ? (hour = hour -= 12, meridiem = ' PM') : meridiem = ' AM';
        let minutes = ('0' + now.getMinutes().toString()).slice(-2);
        document.getElementById('time').innerHTML = hour + ':' + minutes + meridiem;
        document.getElementById('day').innerHTML = weekday[now.getDay()] + ', ';
        document.getElementById('date').innerHTML = month[now.getDay()] + ' ' + now.getDate();

    }, 1000)
}
