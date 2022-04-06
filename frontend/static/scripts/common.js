
window.apiUrl = window.apiUrl || "http://api.answersmasher.com";

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
    return parseInt(s.toLowerCase().replace(/[^a-v]/g, ''), 32);
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
    if (!s){
        return '';
    }
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
    return `${aAn(subject)} ${subject.toLowerCase()}`
}

function oldCombineDef(a, b){
    a = cleanClue(a);
    b = cleanClue(b);
    var joiner = joiners[hash(a)%joiners.length]

    var wholeClue = `${getSubject(a)} ${joiner} ${getSubject(b)}`;
    
    return leadCapital(normalizeCommas(wholeClue).trim());
}

function combineDef(a, b, target_a, target_b){
    a = removeBrackets(a);
    b = removeBrackets(b);
    var combo;
    if (target_a && target_b){
        if (a.length > b.length){
            combo = a.replace(target_a, target_b);
        }
        else {
            combo = b.replace(target_b, target_a);
        }
        return leadCapital(combo);
    }
    else {
        return oldCombineDef(a, b);
    }
    
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
        window.digest = window.digest = digest;
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
            var digest = createDigest(smash);
            window.digest = digest;
            window.history.pushState('', '', '?d=' + digest);
         })
        .catch();
}

function handleUpdate(smash){
    if (window.isQuizPage || window.isDailyPage){
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

function reveal(){
    if (!window.isQuizPage){
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
    if(!window.isQuizPage){
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
    if(!window.isQuizPage && !window.isDailyPage){
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
    if (ev.key ===  "Enter" && (!window.isQuizPage || elem.state.isRevealed)) {
        next();
    }
}

function toggleShare(){
    document.getElementById("shareContainer")?.classList.toggle('hidden');
}

function toggleHelp(){
    document.getElementById("helpContainer")?.classList.toggle('hidden');
}