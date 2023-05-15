import words from './words.json' assert {type: 'json'};
let loaded = false;

function shuffle(o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

//Gets called on load and whenever you create a new grid
function loadvalues(seed=null) {
    let condition = false;
    let commonletters = [];
    let subjects;
    document.getElementById("score").className = "hidden";

    
    //Pick subjects
    while (commonletters.length < 5) {
        subjects = shuffle(Object.keys(words)).slice(0, 5).sort();
        let firstletters = [];
        for (var i in subjects) {
            firstletters.push(Object.keys(words[subjects[i]]))
        }
        commonletters = _.intersection.apply(_, firstletters);
        //if (!commonletters.includes("X")) {commonletters = [];}
    }

    //Pick letters
    commonletters = [...new Set(commonletters)];
    commonletters = shuffle(commonletters).slice(0, 5).sort();

    //Create grid
    let text = "";
    for (let i = 0; i < 5; i++) {
        document.getElementById("ltr" + String(i + 1)).innerHTML = commonletters[i];
        for (let j = 0; j < 5; j++) {
            const td = document.createElement("td");
            const inp = document.createElement("input");
            inp.removeAttribute('class')
            inp.setAttribute("id", String(i) + String(j));
            inp.setAttribute("autocomplete", "off");
            td.appendChild(inp);
            const element = document.getElementById("row" + String(i + 1));
            element.appendChild(td);
        }
    }
    for (let i = 0; i < 5; i++) {
        document.getElementById("cat" + String(i + 1)).innerHTML = subjects[i];
    }

    /*Copy a seed because reasons
    copybutton = document.getElementById("copyseed")
    copybutton.addEventListener("click", () => {
        alert("hi")
        let tocopy = "";
        let zfillto = String(Object.keys(words).length).length
        for (let i = 0; i < 5; i++) {
            tocopy += String(Object.keys(words).indexOf(subjects[i]))
        }
        for (let i = 0; i < 5; i++) {
            tocopy += commonletters[i]
        }
        document.getElementById("seed").value = tocopy
        navigator.clipboard.writeText(tocopy);
    });*/

    //Mark answers as correct or incorrect
    function score() {
        let correctwords;
        let wordstomatch;
        let correctlist = [];

        for (let i = 0; i < 5; i++) {
            correctlist[i] = [];
            for (let j = 0; j < 5; j++) {
                correctwords = words[subjects[j]][commonletters[i]];

                wordstomatch = correctwords.map(word => word.toLowerCase());
                let input = document.getElementById(String(i) + String(j));
                input.setAttribute("readonly", "");
                if (wordstomatch.includes(input.value.toLowerCase())) {
                    input.className = "correct";
                    correctlist[i].push(true);
                } else {
                    input.className = "incorrect";
                    correctlist[i].push(false);
                }

            }
        }
        return correctlist
    }

    //Submit grid
    let submit = document.getElementById("submit");
    submit.addEventListener("click", () => {
        //get score
        let correctlist = score();
        let points = 0;
        for (let i = 0; i < correctlist.length; i++) {
            points += correctlist[i].filter(x => x).length ** 2;
        }
        correctlist = _.unzip(correctlist);
        for (let i = 0; i < correctlist[0].length; i++) {
            points += correctlist[i].filter(x => x).length ** 2;
        }
        let scoredisp = document.getElementById("score");
        scoredisp.className = "";
        scoredisp.innerHTML = points + " points";
        submit = document.getElementById("submit");
        submit.className = "hidden";

        //Toggle between correct answers and your answers
        let oldbutton = document.getElementById("showbutton");
        let showbutton = oldbutton.cloneNode(true);
        oldbutton.parentNode.replaceChild(showbutton, oldbutton);
        showbutton.value = "Show Correct Answers";
        showbutton.className = "";
        let correctwords;
        function showanswers() {
            let inputs = [];
            for (let i = 0; i < 5; i++) {
                inputs.push([])
                for (let j = 0; j < 5; j++) {
                    correctwords = words[subjects[j]][commonletters[i]];
                    let input = document.getElementById(String(i) + String(j));
                    inputs[i].push(input.value);
                    input.value = correctwords.join(", ");
                }
            }
            showbutton.value = "Show Your Answers";
            function showinputs() {
                for (let i = 0; i < 5; i++) {
                    for (let j = 0; j < 5; j++) {
                        let input = document.getElementById(String(i) + String(j));
                        input.value = inputs[i][j];
                    }
                }
                showbutton.value = "Show Correct Answers";
                showbutton.addEventListener("click", showanswers, { once: true });
            }
            showbutton.addEventListener("click", showinputs, { once: true });
        }
        showbutton.addEventListener("click", showanswers, { once: true });

        //Create new grid when the user is done
        let nextbutton = document.getElementById("nextbutton");
        nextbutton.className = "";
        function next() {
            let showbutton = document.getElementById("showbutton");
            showbutton.className = "hidden";
            let submit = document.getElementById("submit");
            submit.className = "";
            let nextbutton = document.getElementById("nextbutton");
            nextbutton.className = "hidden";
            document.querySelectorAll("td").forEach(word => word.remove());
            loadvalues();
        }
        nextbutton.addEventListener("click", next, { once: true });
    }, { once: true });
}

window.addEventListener('load', loadvalues)