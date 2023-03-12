var doVisualUpdates = true; 
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

        var created = new Date();
        var stored = new Date(parseInt(window.localStorage.getItem("created")));
        if (stored && stored.getDate() == created.getDate() && stored.getMonth() == created.getMonth() && stored.getFullYear() == created.getFullYear()) {
            this.setTimer(parseInt(window.localStorage.getItem("minutes")), parseInt(window.localStorage.getItem("seconds")));
            this.setSessions(parseInt(window.localStorage.getItem("sessions")));
            this.setBreak((window.localStorage.getItem("onBreak")) === "true");
        } else {
            window.localStorage.setItem("created", created.valueOf());
            this.setTimer(25, 0);
            this.setSessions(0);
            this.setBreak(false);
        }
        
        this.running = false;
        this.ret = null;

        this.setTitle();
        this.setSVG();

        this.startButton.addEventListener("click", () => {
            this.click.play();
            this.running = !this.running;
            if (this.running) {
                this.countDownDate = new Date().getTime() + (1000*60*this.minutes) + (1000*this.seconds);
                this.startButton.innerHTML = "Pause";
                this.ret = setInterval(() => {
                    var now = new Date().getTime();
                    var timeleft = this.countDownDate - now;
                    var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.round((timeleft % (1000 * 60)) / 1000);
                    if (seconds == 60) {
                        seconds = 0;
                        minutes++;
                    }
                    // seconds = seconds == 60 ? 0 : seconds;
                    
                    if (timeleft <= 0) {
                        this.changeBreak();                    
                    } else {
                        this.setTimer(minutes, seconds);
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
            this.countdownDate = null;
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

        if (doVisualUpdates) {
            this.minElement.innerHTML = minutes < 10 ? "0" + minutes.toString() : minutes;
            this.secElement.innerHTML = seconds < 10 ? "0" + seconds.toString() : seconds;
        }
    }

    setBreak(onBreak) {
        this.onBreak = onBreak;
    }
    
    setSessions(sessions) {
        this.sessions = sessions;
        this.sessionElement.innerHTML = sessions;
    }

    changeBreak() {
        this.setBreak(!this.onBreak);
        this.notif.play();
        this.setSVG();

        if (this.onBreak) {

            this.setSessions(this.sessions + 1);
            if (this.sessions % 4 == 0) {
                this.countDownDate = new Date().getTime() + (1000*60*15);
                this.setTimer(15, 0);
            } else {
                this.countDownDate = new Date().getTime() + (1000*60*5);
                this.setTimer(5,0); 
            }
        } else {
            this.countDownDate = new Date().getTime() + (1000*60*25);
        } 
    }

    setSVG() {
        while (this.ico.hasChildNodes()) {
            this.ico.removeChild(this.ico.firstChild);
        }

        if (this.onBreak) {
            let path1 = document.createElementNS('http://www.w3.org/2000/svg', "path");
            path1.setAttribute("fill-rule", "evenodd");
            path1.setAttribute("d","M.5 6a.5.5 0 0 0-.488.608l1.652 7.434A2.5 2.5 0 0 0 4.104 16h5.792a2.5 2.5 0 0 0 2.44-1.958l.131-.59a3 3 0 0 0 1.3-5.854l.221-.99A.5.5 0 0 0 13.5 6H.5ZM13 12.5a2.01 2.01 0 0 1-.316-.025l.867-3.898A2.001 2.001 0 0 1 13 12.5Z");

            let path2 = document.createElementNS('http://www.w3.org/2000/svg', "path");
            path2.setAttribute("d", "m4.4.8-.003.004-.014.019a4.167 4.167 0 0 0-.204.31 2.327 2.327 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.593.593 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3.31 3.31 0 0 1-.202.388 5.444 5.444 0 0 1-.253.382l-.018.025-.005.008-.002.002A.5.5 0 0 1 3.6 4.2l.003-.004.014-.019a4.149 4.149 0 0 0 .204-.31 2.06 2.06 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.593.593 0 0 0-.09-.252A4.334 4.334 0 0 0 3.6 2.8l-.01-.012a5.099 5.099 0 0 1-.37-.543A1.53 1.53 0 0 1 3 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a5.446 5.446 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 4.4.8Zm3 0-.003.004-.014.019a4.167 4.167 0 0 0-.204.31 2.327 2.327 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.593.593 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3.31 3.31 0 0 1-.202.388 5.444 5.444 0 0 1-.253.382l-.018.025-.005.008-.002.002A.5.5 0 0 1 6.6 4.2l.003-.004.014-.019a4.149 4.149 0 0 0 .204-.31 2.06 2.06 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.593.593 0 0 0-.09-.252A4.334 4.334 0 0 0 6.6 2.8l-.01-.012a5.099 5.099 0 0 1-.37-.543A1.53 1.53 0 0 1 6 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a5.446 5.446 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 7.4.8Zm3 0-.003.004-.014.019a4.077 4.077 0 0 0-.204.31 2.337 2.337 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.593.593 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3.198 3.198 0 0 1-.202.388 5.385 5.385 0 0 1-.252.382l-.019.025-.005.008-.002.002A.5.5 0 0 1 9.6 4.2l.003-.004.014-.019a4.149 4.149 0 0 0 .204-.31 2.06 2.06 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.593.593 0 0 0-.09-.252A4.334 4.334 0 0 0 9.6 2.8l-.01-.012a5.099 5.099 0 0 1-.37-.543A1.53 1.53 0 0 1 9 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a5.446 5.446 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 10.4.8Z");
            
            this.ico.appendChild(path1);
            this.ico.appendChild(path2);
        } else {
            let path = document.createElementNS('http://www.w3.org/2000/svg', "path");
            
            path.setAttribute("d", "m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z");
            this.ico.appendChild(path);
        }
    }
}

function main() {
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.has("bg")) {
        document.body.style.backgroundColor = urlParams.get("bg");
    }
    
    var styleString = "";
    if (urlParams.has("font")) {
        document.head.innerHTML = document.head.innerHTML + "<style type='text/css'>*{font-family: " + urlParams.get("font") + "!important }</style>";
        styleString += "font-family: " + urlParams.get("font") + "!important;"
    }

    if (urlParams.has("fontColour")) {
        styleString += "color: " + urlParams.get("fontColour") + "!important;"
        var buttons = document.getElementsByClassName("access-buttons");
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].style.borderColor = urlParams.get("fontColour");
        }
    }

    document.head.innerHTML = document.head.innerHTML + "<style type='text/css'>*{ " + styleString + "}</style>"
    
    var timer = new Timer();

    document.addEventListener('visibilitychange', function(){
        doVisualUpdates = !document.hidden;
        window.localStorage.setItem("minutes", timer.minutes);
        window.localStorage.setItem("seconds", timer.seconds);
        window.localStorage.setItem("sessions", timer.sessions);
        window.localStorage.setItem("onBreak", timer.onBreak);
    });
}

window.onload = function() {
    main();
}
