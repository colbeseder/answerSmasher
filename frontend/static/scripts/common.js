const apiUrl = "http://api." + location.host


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
    return s.replace(/\([^)]*\)?\s*/g, '');
}

function leadingLower(s){
    return s.replace(/^\s*[A-Z]/, x => x.toLowerCase());
}

var breakers = "(,|\\band\\b|\\bor\\b|\\bwith\\b|\\bfor\\b|\\bof\\b|\\bin\\b|\\bis\\b)";

function combineDef(a, b){
    var joiner = ' ';
    var re = new RegExp(breakers, 'i');
    if (!re.test(a) && !re.test(b)){
        joiner = ' with ';
    }

    return removeBrackets(a).replace(new RegExp("^(.*?)" + breakers + ".*$", 'i'), '$1$2') +
            joiner +
            leadingLower(removeBrackets(b)).replace(new RegExp(".*" + breakers, 'i'), '');
}

function getSmashfromDigest(digest){
        fetch(apiUrl + "/api/combine/" + digest)
            .then(r => r.json())
            .then(smash => {
                if (smash.firstAnswer) {
                    elem.setState(smash, equalizeGuessBoxes);
                    if(/reveal/.test(location.hash)){
                        reveal();
                    }
                }
                else {
                    next();
                }
            })
            .catch(er => next());
}

function next(){
    fetch(apiUrl + "/api/smash").then(r => r.json())
        .then(smash => {
            clear();
            elem.setState(smash, equalizeGuessBoxes);
            window.history.pushState('', '', '?d=' + createDigest(smash));
         })
        .catch();
}

function checkSmash(){
    if (elem.state.guess1 === elem.state.firstAnswer && elem.state.guess2 === elem.state.secondAnswer){
        elem.setState({isCorrect: true});
    }
    else {
        elem.setState({isCorrect: false});
    }

}

var isQuizPage = false;

function reveal(){
    if (!isQuizPage){
        // Not Quiz Page
        return;
    }
    location.hash = "reveal"
    document.getElementById("guess1").value = elem.state.firstAnswer;
    document.getElementById("guess2").value = elem.state.secondAnswer;
    elem.setState({
        isCorrect: true,
        isRevealed: true
    });
}

function clear(){
    if(!isQuizPage){
        return;
    }
    document.getElementById("guess1").value = '';
    document.getElementById("guess2").value = '';
    elem.setState({
        isCorrect: false,
        isRevealed: false,
        guess1: '',
        guess2: ''
    });
}

function equalizeGuessBoxes(){
    if(!isQuizPage){
        return;
    }
    var boxes = document.querySelectorAll(".guessBox>div");
    boxes[0].style.height = 'auto';
    boxes[1].style.height = 'auto';
    var newHeight = Math.max(boxes[0].offsetHeight, boxes[1].offsetHeight);
    boxes[0].style.height = newHeight;
    boxes[1].style.height = newHeight;
}