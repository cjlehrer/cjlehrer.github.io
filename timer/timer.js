const buttons = document.querySelectorAll('.mediaButtons');

let isPaused = false;

let interval;
let hours;
let minutes;
let seconds;

let intervalTwenty;
let mute = false;
let playTitle = "Start the Timer(s)";
let pauseTitle = "Pause the Timer(s)";
let status = 'work';
let alertAudio = new Audio('alert.wav');



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
            break;
        case 'lengthButton':
            submitButton(button, 'numberInput');
            hideToggle('timer');
            break;
        case 'ff':
            seconds = 0;
            minutes = 0;
            hours = 0;
            buttonSwitch(document.getElementById('play'), 'pause');
            isPaused = false;
            break;
        case 'yesBreak':
            hideToggle('timer');
            audioOff();
            isPaused = false;
            playButton();
            break;
        case 'noBreak':
            audioOff();
            buttonSwitch(document.getElementById('play'), 'pause');
            hideToggle('timer');
            playButton();
            setBackground('rgba(150,150,250, .3)');
            break;
        case 'yesResume':
            stopAll();
            hideToggle('timer');

            audioOff();
            playButton();
            break;
        case 'noResume':
            stopAll();
            hideToggle('timer');
            audioOff();
            break;
    }
}

function playButton() {
    if (document.getElementById('play')) {
        buttonSwitch(document.getElementById('play'), 'pause', pauseTitle);
    }
    let timer;
    if(status == 'work') {
        setBackground('rgba(150,150,250, .3)');
        timer = Number(document.getElementById('sessionOutput').innerHTML)
    } else {
        setBackground('rgba(150,250,150, .3)');
        timer = Number(document.getElementById('breakOutput').innerHTML)
    }
    console.log('Status at playButton:' + status);
    if (!isPaused) {
        startTimer(timer,'timeRemain');
        if(document.getElementById('twenty').checked == true) {  //deal with 20/20/20
            startTwenty(20,'twentyRemain');

        }
    }
    isPaused = false;


}

function pauseTimer() {
    if (document.getElementById('pause')) {
        buttonSwitch(document.getElementById('pause'), 'play',playTitle);
    }
    isPaused = true;
    setBackground('rgba(150,150,150, .3)');

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

function displayStatus(dispStatus) {
    document.getElementById('status').innerHTML = dispStatus;
}

function submitButton(button, input) {
    let key = document.getElementById(button).dataset.key;
    let value = document.getElementById(input).value;
    document.getElementById(key).innerHTML = value;

}

function captureNumber(button) {  //this is a problem.
    let thisValue = document.getElementById(button).innerHTML;
    document.getElementById('numberInput').setAttribute('value',thisValue);
    document.getElementById('lengthButton').setAttribute('data-key', button);
    let element = document.getElementById('numberInput')
    hideToggle('lengthQuest');
    let buttonStatus = (button).substring(0, button.length-6);
    document.getElementById('theStatus').innerHTML = buttonStatus + ' duration.';
    let current = Number(document.getElementById(button).innerHTML);
    element.setAttribute('value', current);
    element.select();
    element.focus();
}

function hideToggle(show) {  
    const panels = document.querySelectorAll('.panel')
    panels.forEach(panel => {
        panel.id == show ? 
        document.getElementById(panel.id).classList.remove('hidden'): 
        document.getElementById(panel.id).classList.add('hidden');
    });
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


function startTimer(totalTime, location) {  
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
                console.log('status at startTimer: ' + status + ' ' + status=='work');
                if(status == 'work') {
                    if(mute == false) {
                        alertAudio.addEventListener('ended', function() {
                            this.currentTime = 0;
                            this.play();
    
                        },false);
                        alertAudio.play();
                    }
                    hideToggle('breakQuest');
                    status = 'break';
                } else {
                    document.getElementById('resumeAmt').innerHTML = document.getElementById('sessionOutput').innerHTML;
                    alertAudio.play();
                    hideToggle('resumeQuest');
                    status = 'work';
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
