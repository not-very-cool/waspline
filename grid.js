import words from './words.json' assert {type: 'json'};
let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
let loaded = false;

function shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function loadvalues() {
    let condition = false;
    let commonletters;
    let subjects;
    while (!condition) {
        subjects = shuffle(Object.keys(words)).slice(0, 5).sort();
        let firstletters = {};
        for (var i in subjects) {
            firstletters[subjects[i]] = [];
            for (var j in words[subjects[i]]) {
                firstletters[subjects[i]].push(words[subjects[i]][j][0]);
            }
        }
        commonletters = _.intersection.apply(_, Object.values(firstletters));
        condition = commonletters.length >= 5
    }

    //console.log(subjects)
    commonletters = [...new Set(commonletters)];
    commonletters = shuffle(commonletters).slice(0, 5).sort();
    
    let text = "";
    
    for (let i = 0; i < 5; i++) {
        document.getElementById("ltr"+String(i+1)).innerHTML = commonletters[i];
        for (let j = 0; j < 5; j++) {
            const td = document.createElement("td");
            const inp = document.createElement("input");
            inp.removeAttribute('class')
            inp.setAttribute("id", String(i)+String(j));
            inp.setAttribute("autocomplete", "off");
            td.appendChild(inp);
            const element = document.getElementById("row" + String(i+1));
            element.appendChild(td);
        }
    }
    for (let i = 0; i < 5; i++) {
        document.getElementById("cat"+String(i+1)).innerHTML = subjects[i];
    }

    function score() {
        let correctwords;
        let wordstomatch;
        
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                correctwords = words[subjects[j]].filter(word => word[0] == commonletters[i]);
                
                wordstomatch = correctwords.map(word => word.toLowerCase());
                let input = document.getElementById(String(i)+String(j));
                console.log(input.value)
                //input.setAttribute("value", correctwords[0]);
                if (wordstomatch.includes(input.value.toLowerCase())) {
                    input.className = "correct"
                } else {
                    input.value = correctwords.join(", ");
                    input.className = "incorrect";
                }
                
            }
        }
    }

    let submit = document.getElementById("submit");
    function submitsheet() {
        score()
        submit = document.getElementById("submit");
        submit.className = "hidden";
        let nextbutton = document.getElementById("nextbutton");
        nextbutton.className = "shown";
        submit.removeEventListener("click", submitsheet);
        function next() {
            let submit = document.getElementById("submit");
            submit.className = "shown";
            let nextbutton = document.getElementById("nextbutton");
            nextbutton.className = "hidden";
            document.querySelectorAll("td").forEach(word => word.remove());
            loadvalues();
        }
        nextbutton.addEventListener("click", next);
    }
    submit.addEventListener("click", submitsheet);
    loaded = true;
    
}

window.addEventListener('load', loadvalues)
    
