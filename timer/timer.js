const buttons = document.querySelectorAll('.mediaButtons');
let isPaused = false;
let whatPaused;
let interval;
let intervalTwenty;
let mute = false;

let alertAudio = new Audio('alert.wav');



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
            buttonSwitch(element, 'pause');
            setBackground('rgba(150,150,250, .3)');
            if (!isPaused) {
                startTimer(Number(document.getElementById('sessionOutput').innerHTML),'timeRemain');
                if(document.getElementById('twenty').checked == true) {  //deal with 20/20/20
                    startTwenty(20,'twentyRemain');

                }
            }
            isPaused = false;
            break;
        case 'pause':
            buttonSwitch(element, 'play');
            isPaused = true;
            setBackground('rgba(150,150,150, .3)');
            whatPaused = document.getElementById('status').innerHTML;
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
            
            break
        case 'lengthButton':
            submitButton(button, 'numberInput');
            hideToggle('timer', 'lengthQuest');
            break;
        case 'ff':
            stopAll();
            breakTime();
            buttonSwitch(document.getElementById('play'), 'pause');
            break;
        case 'yesBreak':
            hideToggle('timer', 'breakQuest');
            audioOff();
            breakTime();
            break;
        case 'noBreak':
            audioOff();
            hideToggle('timer', 'breakQuest');
            startTimer(10,'timeRemain');
            
            break;
    }
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


function breakTime(status) {
    setBackground('rgba(150,250,150, .3)');
    startTimer(Number(document.getElementById('breakOutput').innerHTML),'timeRemain',true);
    displayStatus('Breaktime');
    buttonSwitch(document.getElementById('play'), 'pause');
    whatPaused = 'break';
}

function submitButton(button, input) {
    let key = document.getElementById(button).dataset.key;
    let value = document.getElementById(input).value;
    document.getElementById(key).innerHTML = value;
}

function captureNumber(button) {
    hideToggle('timer', 'lengthQuest');
    let status = (button).substring(0, button.length-6);
    document.getElementById('theStatus').innerHTML = status + ' duration.';
    document.getElementById('numberInput').focus();
    let current = Number(document.getElementById(button).innerHTML);
    document.getElementById('numberInput').setAttribute('value', current);
    document.getElementById('numberInput').select();
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


function startTimer(totalTime, location, breakTest) {  
    let hours = Math.floor(totalTime / 60); 
    let minutes = (totalTime - (hours * 60));
    let seconds = 0;

    
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
                //clearInterval(interval);
                //breakTimer();
                stopAll();
                clearInterval(interval);
                if(mute == false) {
                    alertAudio.addEventListener('ended', function() {
                        this.currentTime = 0;
                        this.play();

                    },false);
                    alertAudio.play();
                }
                if(breakTest != true && location == 'timeRemain') {
                    hideToggle('timer', 'breakQuest');
                } 
            }

            document.getElementById(location).innerHTML =
                ('0' + hours.toString()).slice(-2) + ':' +
                ('0' + minutes.toString()).slice(-2) + ':' +
                ('0' + seconds.toString()).slice(-2);
        }
    }, 1000)
}



function changeValue(direction, timer) { // this needs to account for hours and should probably give an option to up the number by more than 1
    let time = Number(document.getElementById(timer + 'Output').innerHTML) + direction;
    document.getElementById(timer + 'Output').innerHTML = time;
}


function setBackground(color) {
    document.getElementById("timerContain").style.backgroundColor = color;
}

function buttonSwitch(element, nextButton) {
    if (element !== null) {
        element.src = nextButton + '.png';
        element.setAttribute('id', nextButton);
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
