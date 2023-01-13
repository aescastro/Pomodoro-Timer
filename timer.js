
class Timer {
    constructor() {
        this.minElement = document.getElementById("mins");
        this.secElement = document.getElementById("secs");
        this.ico = document.getElementById("ico");
        this.sessionElement = document.getElementById("session-display");
        this.startButton = document.getElementById("start");
        this.cancelButton = document.getElementById("cancel");

        this.notif = document.createElement("AUDIO");
        this.click = document.createElement("AUDIO");
        this.notif.src = "./sounds/Notification_Sound.wav"
        this.click.src = "./sounds/Click_Sound.wav";

        this.minutes = window.sessionStorage.getItem("minutes") ?? 25;
        this.seconds = window.sessionStorage.getItem("seconds") ?? 0;
        this.sessions = window.sessionStorage.getItem("sessions") ?? 0;
        this.onBreak = window.sessionStorage.getItem("onBreak") ?? false;
        this.running = false;
        this.ret = null;

        this.setTimer(this.minutes, this.seconds);
        this.setTitle();
        this.sessionElement.innerHTML = this.sessions;

        if (this.onBreak) {
            this.ico.src = "./icons/cup-hot-fill.svg";
        } else {
            this.ico.src = "./icons/pen-fill.svg";
        }

        this.startButton.addEventListener("click", () => {
            this.click.play();
            this.running = !this.running;
            if (this.running) {
                this.startButton.innerHTML = "Pause";
                this.ret = setInterval(() => {
                    if (this.seconds == 0 && this.minutes == 0) {
                        this.changeBreak();                    
                    } else if (this.seconds == 0) {
                        this.setTimer(this.minutes - 1, 59);
                    } else {
                        this.setTimer(this.minutes, this.seconds - 1);
                    }
                    this.setTitle();
                }, 1000);
            } else {
                this.setTitle();
                this.startButton.innerHTML = "Start";
                clearInterval(this.ret);
                this.running = false;
            }
        });

        this.cancelButton.addEventListener("click", () => {
            this.click.play();
            this.startButton.innerHTML = "Start";
            clearInterval(this.ret);
            this.running = false;
            
            if (this.onBreak && this.sessions % 4 == 0) {
                this.setTimer(15, 0);
            } else if (this.onBreak) {
                this.setTimer(5, 0);
            } else {
                this.setTimer(25, 0);
            }
            
            this.setTitle();
        });
    }

    setTitle() {
        var newTitle = !this.running ? "Paused" : this.onBreak ? "Break" : "Focus"
        newTitle += " - " + (this.minutes < 10 ? "0" + this.minutes.toString() : this.minutes) + ":" + (this.seconds < 10 ? "0" + this.seconds.toString() : this.seconds);
        document.title = newTitle;
    }

    setTimer(minutes, seconds) {
        this.minutes = minutes;
        this.seconds = seconds;

        window.sessionStorage.setItem("minutes", minutes);
        window.sessionStorage.setItem("seconds", seconds);

        this.minElement.innerHTML = minutes < 10 ? "0" + minutes.toString() : minutes;
        this.secElement.innerHTML = seconds < 10 ? "0" + seconds.toString() : seconds;
    }

    setBreak(onBreak) {
        this.onBreak = onBreak;
        window.sessionStorage.setItem("onBreak", this.onBreak);
    }

    changeBreak() {
        this.setBreak(!this.onBreak);
        this.notif.play();

        if (this.onBreak) {
            this.ico.src = "./icons/cup-hot-fill.svg";

            this.incSessions();
            if (this.sessions % 4 == 0) {
                this.setTimer(15, 0);
            } else {
                this.setTimer(5,0); 
            }
        } else {
            this.ico.src = "./icons/pen-fill.svg";
            this.setTimer(25, 0);
        } 
        
    }

    incSessions() {
        this.sessions++;
        this.sessionElement.innerHTML = this.sessions;
        window.sessionStorage.setItem("sessions", this.sessions);
    }
}

function main() {
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.has("bg")) {
        document.body.style.backgroundColor = urlParams.get("bg");
    }
    
    if (urlParams.has("font")) {
        document.head.innerHTML = document.head.innerHTML + "<style type='text/css'>*{font-family: " + urlParams.get("font") + "!important }</style>";

    }
    
    new Timer();
}

window.onload = function() {
    main();
}
