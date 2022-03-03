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
    var joint = b.charAt(0);
    if (a.slice(1, -1).indexOf(joint.toLowerCase()) === -1){
        // Failed to combine
        if (falseIfFailed){
            return false;
        }
        return `${leadCapital(a)}-${leadCapital(b)}`;
    }
    else {
        var combo = a.replace(new RegExp('(.+)' + joint.toLowerCase() + ".+", "i"), "$1" + b);
        return leadCapital(combo)
    }
}

function createDigest(smash){
    return btoa(smash.firstAnswer + "," + smash.secondAnswer);
}

function removeBrackets(s){
    return s.replace(/\([^)]*\)?\s*/g, '');
}

function cleanClue(clue, synCount){
    clue = removeBrackets(clue);
    var synonym = extractSynonyms(clue, synCount);
    if (synonym){
        return synonym;
    }
    return clue;
}

function leadingLower(s){
    return s.replace(/^\s*[A-Z]/, x => x.toLowerCase());
}

function normalizeCommas(s){
    return s.replace(/ +,/g, ',');
}

function hash(s){
    return parseInt(s.toLowerCase().replace(/[^a-w]/g, ''), 32);
}

function extractSynonyms(clue, maxCount){
    maxCount = maxCount || 1;
    var re = /Synonyms?\s*:\s*([\w ,]+)/i
    var match = re.exec(clue);
    if (match){
        var words = match[1].split(/, */g)
        return words.slice(0, maxCount).join(', ');
    }
    return '';
}

function aAn(s){
    if (/s$/i.test(s)){
        return '';
    }
    return /^[aeiou]/i.test(s) ? 'an' : 'a';
}

function getSubject(s){
    var re = new RegExp("\\b(An?|The|Any|Or|From|As|Of|And|With|To)\\b(.+?)" + breakersRE, "i");
    var m = re.exec(s);
    var subject;
    var words;
    if (m) {
        subject = m[2].trim();
    }
    else {
        words = s.split(/[^A-Z]+/ig).filter(x => x.trim());
        subject = words[words.length-1];
    }
    return `${aAn(subject)} ${words ? '*' : ''}${subject.toLowerCase()}`
}
function combineDef(a, b){
    a = cleanClue(a);
    b = cleanClue(b);
    var joiner = joiners[hash(a)%joiners.length]

    var wholeClue = `${getSubject(a)} ${joiner} ${getSubject(b)}`;
    
    return leadCapital(normalizeCommas(wholeClue).trim());
}

var breakers = ['and', 'or', 'with', 'for', 'of', 'in', 'is', 'from', 'as'];
var breakersRE = `(,|\\b${breakers.join('\\b|\\b')}\\b|$)`;

var joiners = [
'in',
'on',
'is',
'with',
'from',
];

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
        document.title = 'Answer Smasher';
        document.getElementsByTagName('input')[0].focus();
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
    }, x => {document.getElementById('guess2').focus()});
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

function nextOnEnter(ev){
    if (ev.key ===  "Enter" && (!isQuizPage || elem.state.isRevealed)) {
        next();
    }
}