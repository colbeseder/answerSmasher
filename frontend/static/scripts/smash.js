var currentSmash = {};

var apiUrl = "http://api." + location.host

function next(){
    getNewSmash()
        .then(r => {
            updateSmash(r);
            window.history.pushState('', '', '?d=' + createDigest(currentSmash));
        })
        .catch(next)
}

function getNewSmash(){
    return new Promise((resolve, reject) => {
        fetch(apiUrl + "/api/smash").then(r => r.json())
            .then(r => {
                if (r.firstAnswer) {
                    resolve(r);
                }
                else {
                    reject();
                }
            })
        .catch();
    });
}

function updateSmash(smash){
    currentSmash = smash;
    document.getElementById("clue1").innerText = removeBrackets(currentSmash?.firstClue) ;
    document.getElementById("clue2").innerText = removeBrackets(currentSmash?.secondClue);
    document.getElementById("answer1").innerHTML = "";
    document.getElementById("answer2").innerHTML = "";
    document.getElementById("result").innerText = "";
    document.getElementById("answer").innerText = "";
    document.getElementById("IPA").innerText = "";
    document.getElementById("meaning").innerText = "";

    document.getElementById("buttonGroup1").style.display = "block";
    document.getElementById("buttonGroup2").style.display = "none";
    document.getElementById("answer1").focus();
}

function reveal(){
    location.hash = 'reveal';
    document.getElementById("answer1").innerHTML = currentSmash.firstAnswer;
    document.getElementById("answer2").innerHTML = currentSmash.secondAnswer;
    document.getElementById("result").innerText = "Revealed";
    document.getElementById("answer").innerText = combineSpelling(currentSmash.firstAnswer, currentSmash.secondAnswer);
    document.getElementById("IPA").innerText = `/${currentSmash.pronounciation}/`
    document.getElementById("meaning").innerText = `1. ${combineDef()}`

    document.getElementById("buttonGroup1").style.display = "none";
    document.getElementById("buttonGroup2").style.display = "block";
    document.getElementById("next").focus();
}

function checkSmash(){
    if (document.getElementById("answer1").innerHTML.toLowerCase() === currentSmash.firstAnswer.toLowerCase()
        && document.getElementById("answer2").innerHTML.toLowerCase() === currentSmash.secondAnswer.toLowerCase()){
            // Answer is Correct!
            document.getElementById("result").innerText = "Correct";
            location.hash = 'reveal';
            document.getElementById("answer").innerText = combineSpelling(currentSmash.firstAnswer, currentSmash.secondAnswer);
            document.getElementById("IPA").innerText = `/${currentSmash.pronounciation}/`
            document.getElementById("meaning").innerText = `1. ${combineDef()}`;

            document.getElementById("shareButton")?.classList.remove('hidden');
            document.getElementById("next").focus();
        }
}

function leadCapital(s){
    return s.replace(/^./, x => x.toUpperCase())
}

function combineSpelling(a, b){
    if (!a) {
        return b;
    }
    if (!b){
        return leadCapital(a);
    }
    var joint = b.charAt(0);
    if (a.indexOf(joint) === -1){
        return `${leadCapital(a)}-${leadCapital(b)}`;
    }
    else {
        var parts = a.split(joint);
        parts.pop();
        return leadCapital(parts.join(joint) + b)
    }
}

function createDigest(smash){
    return btoa(smash.firstAnswer + "," + smash.secondAnswer);
}

function removeBrackets(s){
    if (!s){
        return '';
    }
    return s.replace(/\([^)]*\)\s*/g, '');
}

function leadingLower(s){
    return s.replace(/^\s*[A-Z]/, x => x.toLowerCase());
}

var breakers = "(,|\\band\\b|\\bor\\b|\\bwith\\b|\\bfor\\b|\\bof\\b|\\bin\\b|\\bis\\b)";

function combineDef(){
    var joiner = ' ';
    var re = new RegExp(breakers, 'i');
    if (!re.test(currentSmash.firstClue) && !re.test(currentSmash.firstClue)){
        joiner = ' with ';
    }

    return removeBrackets(currentSmash.firstClue).replace(new RegExp("^(.*?)" + breakers + ".*$", 'i'), '$1$2') +
            joiner +
            leadingLower(removeBrackets(currentSmash.secondClue)).replace(new RegExp(".*" + breakers, 'i'), '');
}

function getSmashfromDigest(digest){
    return new Promise((resolve, reject) => {
        fetch(apiUrl + "/api/combine/" + digest).then(r => r.json()).then(smash => {
            if (smash.firstAnswer) {
                updateSmash(smash);
                if(!window.isDailyPage && /reveal/.test(location.hash)){
                    reveal();
                }
            }
            else {
                next();
            }
        });
    });
}

function attempt(){
    var attempt1 = document.getElementById("answer1").innerText;
    var attempt2 = document.getElementById("answer2").innerText;
    document.getElementById("answer").innerText = combineSpelling(attempt1.toLowerCase(), attempt2.toLowerCase());
    checkSmash();
}

function revealOnEnter(ev){
    if (ev.key ===  "Enter") {
        checkSmash();
        ev.preventDefault();
    }
}

//document.getElementById("submit").addEventListener("click", checkSmash);
document.getElementById("next")?.addEventListener("click", next);
document.getElementById("reveal").addEventListener("click", reveal);
document.getElementById("answer1").addEventListener("input", attempt);
document.getElementById("answer2").addEventListener("input", attempt);
