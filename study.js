import words from './words.json' assert {type: 'json'};
let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
let allsubjects = Object.keys(words);
let corrects;

//Called on load and when you press "Go Back" (Creates grid of subject links you press to study)
function loadTable() {
    let grid = document.getElementById("grid");
    for (let i = 0; i < allsubjects.length; i++) {
        let td = document.createElement("td");
        let link = document.createElement("a");
        link.setAttribute("id", i);
        link.setAttribute("href", "#");
        link.setAttribute("onclick", "study(this.id)");
        link.appendChild(document.createTextNode(allsubjects[i]));
        td.appendChild(link);
        grid.appendChild(td);
    }
}
window.addEventListener('load', loadTable);

//Code stolen and modified from stackoverflow
var Stopwatch = function(elem, options) {
    var timer = elem, offset, clock, interval;

    // default options
    options = options || {};
    options.delay = options.delay || 1;

    // initialize
    reset();

    // private functions
    function createTimer() {
        return document.createElement("span");
    }

    function start() {
        if (!interval) {
            offset = Date.now();
            interval = setInterval(update, options.delay);
        }
    }

    function stop() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    }

    function reset() {
        clock = 0;
        render(0);
    }

    function update() {
        clock += delta();
        render();
    }

    function render() {
        let seconds = Math.round(clock) / 1000;
        let minutes = Math.floor(seconds/60)
        seconds %= 60;
        timer.innerHTML = String(minutes) + ":" + String(seconds.toFixed(3).padStart(6, "0"));
    }

    function delta() {
        var now = Date.now(),
            d = now - offset;

        offset = now;
        return d;
    }

    // public API
    this.start = start;
    this.stop = stop;
    this.reset = reset;
};

var thyme;

//Gets called when you press a link
function study(id) {
    //Hide stuff
    let input = document.getElementById("input");
    input.value = "";
    input.removeAttribute("readonly");
    document.getElementById("table").innerHTML = "";
    document.getElementById("giveup").className = "";
    document.getElementById("restart").className = "hidden";
    document.getElementById("subject").innerHTML = allsubjects[id];
    document.getElementById("grid").className = "hidden";
    document.getElementById("rand").className = "hidden";
    document.getElementById("quiz").className = "";

    //Timer stuff
    thyme = new Stopwatch(document.getElementById("timer"));
    document.getElementById("input").addEventListener("focus", () => {
        thyme.start();
    }, {once: true});
    //thyme.start()

    //Reset confetti counter
    corrects = 0;

    //Create the form where your answers show up
    let table = document.getElementById("table");
    table.className = "";
    let correctanswers = words[allsubjects[id]];
    let letterslist = Object.keys(correctanswers);
    for (let i = 0; i < letterslist.length; i++) {
        //Create a bunch of elements for every letter
        let row = document.createElement("tr");
        let th = document.createElement("th")
        th.appendChild(document.createTextNode(letterslist[i]));
        let td = document.createElement("td");
        let out = document.createElement("input");
        out.setAttribute("readonly", "");
        out.setAttribute("id", letterslist[i]);
        out.className = "smallfont";
        td.appendChild(out);
        row.appendChild(th);
        row.appendChild(td);
        table.appendChild(row);
    }
}
window.study = study;

//Gets called when you click "Random Topic"
function studyrand() {
    study(Math.floor(Math.random() * allsubjects.length));
}
window.studyrand = studyrand

//Gets called when you hit enter after typing a guess
function guess(value, inputbox) {
    //Define variables
    let correctanswers = words[document.getElementById("subject").innerHTML];
    let letterslist = Object.keys(correctanswers);

    //Iterate through the answers to find one that matches
    for (let i = 0; i < letterslist.length; i++) {
        //Account for plurals and missing punctuation
        let wordstomatch = correctanswers[letterslist[i]].map(word => pluralize.singular(word).toLowerCase().replace(/ |-|'/g, ""));
        if (wordstomatch.includes(pluralize.singular(value).toLowerCase().replace(/ |-|'/g, ""))) {
            //Mark as correct or incorrect
            let answerbox = document.getElementById(letterslist[i]);
            if (answerbox.className != "smallfont correct") {
                inputbox.value = "";
                answerbox.className = "smallfont correct";
                answerbox.value = correctanswers[letterslist[i]].join(", ");
                corrects++;
                if (corrects == letterslist.length) {
                    //Called when you get everything right. Confetti :)
                    let input = document.getElementById("input");
                    input.value = "";
                    input.setAttribute("readonly", "");
                    thyme.stop()
                    document.getElementById("giveup").className = "hidden"
                    document.getElementById("restart").className = "";
                    startConfetti()
                }
            }
            break
        }
    }
}
window.guess = guess;

//Called when you press "Give Up"
function giveup() {
    //Mark stuff as incorrect
    let correctanswers = words[document.getElementById("subject").innerHTML];
    let letterslist = Object.keys(correctanswers);
    for (let i = 0; i < letterslist.length; i++) {
        let answerbox = document.getElementById(letterslist[i]);
        for (let j = 0; j < correctanswers[letterslist[i]].length; j++) {
            if (answerbox.className != "smallfont correct") {
                answerbox.value = correctanswers[letterslist[i]].join(", ");
                answerbox.className = "smallfont incorrect"
            }
        }
    }

    //Hide stuff
    //You 
    thyme.start()
    thyme.stop()
    document.getElementById("input").setAttribute("readonly", "");
    document.getElementById("giveup").className = "hidden"
    document.getElementById("restart").className = ""
}
window.giveup = giveup

//Called when you press "Restart"
function restart() {
    stopConfetti()
    let id = allsubjects.indexOf(document.getElementById("subject").innerHTML)
    study(id)
}
window.restart = restart;

//Called when you press "Go Back"
function goback() {
    //Hide stuff
    thyme.stop()
    document.getElementById("input").value = "";
    document.getElementById("grid").className = "";
    document.getElementById("rand").className = "margintop";
    document.getElementById("quiz").className = "hidden"
    document.getElementById("table").innerHTML = "";
    removeConfetti()
}
window.goback = goback