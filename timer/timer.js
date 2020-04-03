const buttons = document.querySelectorAll('.mediaButtons');
let isPaused = false;
let interval;
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
                startTimer(Number(document.getElementById('sessionOutput').innerHTML));
            }
            isPaused = false;
            break;
        case 'pause':
            buttonSwitch(element, 'play');
            isPaused = true;
            //setBackground('rgba(150,150,150, .3)');
            break;
        case 'stop':
            setBackground('rgba(150,150,150, .3)');
            buttonSwitch(document.getElementById('pause'), 'play');
            document.getElementById('timeRemain').innerHTML = '00:00:00';
            clearInterval(interval);
            break;
        case 'ff':
            setBackground('rgba(150,250,150, .3)');
            buttonSwitch(document.getElementById('pause'), 'play');
            break;
        case 'sound':
            buttonSwitch(element, 'mute');
            break;
        case 'mute':
            buttonSwitch(element, 'sound');
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
            console.log(button);
            break;

    }
}

function startTimer(totalTime) {  
    let hours = Math.floor(totalTime / 60); 
    let minutes = (totalTime - (hours * 60))  
    let seconds = 0;

    interval = setInterval(function () {

        if (!isPaused) {
            document.getElementById('timeRemain').innerHTML = seconds;

            seconds > 0 ? seconds -= 1
                : minutes > 0 ? (minutes -= 1, seconds = 59)
                    : hours > 0 ? (hours -= 1, minutes = 59, seconds = 59) : 0;

            if (seconds == 0 && minutes == 0 && hours == 0) {
                clearInterval(interval);
                breakTimer();
            }
            document.getElementById('timeRemain').innerHTML =
                ('0' + hours.toString()).slice(-2) + ':' +
                ('0' + minutes.toString()).slice(-2) + ':' +
                ('0' + seconds.toString()).slice(-2);


            if(document.getElementById('twenty').checked = true) {
                
            }
        }

    }, 1000)
}

function breakTimer() {
    setBackground('rgba(150,250,150, .3)');
    startTimer(Number(document.getElementById('breakOutput').innerHTML));
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

buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
        let buttonPress = button.id;
        buttonCheck(buttonPress);
    });
});


function clockTime() {
    setInterval(function () {
        let now = new Date();
        let hour = ('0' + now.getHours().toString()).slice(-2);
        let meridiem;
        hour > 13 ? hour = (hour - 12, meridiem = ' PM') : meridiem = ' AM';
        let minutes = ('0' + now.getMinutes().toString()).slice(-2);
        document.getElementById('time').innerHTML = hour + ':' + minutes + meridiem;
        document.getElementById('day').innerHTML = weekday[now.getDay()] + ', ';
        document.getElementById('date').innerHTML = month[now.getDay()] + ' ' + now.getDate();

    }, 1000)
}
