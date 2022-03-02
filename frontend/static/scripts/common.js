const apiUrl = "http://api." + location.host


function leadCapital(s){
    return s.replace(/^./, x => x.toUpperCase())
}

function combineSpelling(a, b, falseIfFailed){
    if (!a) {
        return b;
    }
    if (!b){
        return leadCapital(a);
    }
    var joint = b.charAt(0).toLowerCase();
    if (a.slice(1, -1).indexOf(joint) === -1){
        // Failed to combine
        if (falseIfFailed){
            return false;
        }
        return `${leadCapital(a)}-${leadCapital(b)}`;
    }
    else {
        var combo = a.replace(new RegExp('(.+)' + joint + ".+", "i"), "$1" + b);
        return leadCapital(combo)
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

    return removeBrackets(a).replace(new RegExp("^(.{8,}?)" + breakers + ".*$", 'i'), '$1') +
            joiner +
            leadingLower(removeBrackets(b)).replace(new RegExp(".*" + breakers + "(.{5,})", 'i'), '$1$2');
}

function getSmashfromDigest(digest){
        fetch(apiUrl + "/api/combine/" + digest)
            .then(r => r.json())
            .then(smash => {
                if (smash.firstAnswer) {
                    elem.setState(smash, x => handleUpdate(smash));
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
            elem.setState(smash, x => handleUpdate(smash));
            window.history.pushState('', '', '?d=' + createDigest(smash));
         })
        .catch();
}

function handleUpdate(smash){
    if (isQuizPage){
        document.title = "Answer Smasher";
    }
    else {
        document.title = combineSpelling(smash.firstAnswer, smash.secondAnswer);
    }
    equalizeGuessBoxes()
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
    document.title = combineSpelling(elem.state.firstAnswer, elem.state.secondAnswer);
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