
window.apiUrl = window.apiUrl || "http://api.answersmasher.com";

function leadCapital(s){
    return s.replace(/^./, x => x.toUpperCase())
}

/*
 * RiCHaRd OSmAn -> richard Osman
 */
function toLowerPreserveSurname(s){
    return s.replace(/ ?[A-Z]/g, function(x){
        if (x[0] !== ' '){
            return x.toLowerCase();
        }
        else {
            return x;
        }
    });
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
    return clue.replace(/[\. ]+$/, '')
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
            combo = a.replace(target_a, leadingLower(target_b));
        }
        else {
            combo = b.replace(target_b, leadingLower(target_a));
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

function getDaily(digest){
    fetch(apiUrl + "/api/daily")
        .then(r => r.json())
        .then(smash => {
            if (smash.firstAnswer) {
                elem.setState(smash, x => handleUpdate(smash));
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
            try {
                clear();
                elem.setState(smash, x => handleUpdate(smash));
                var digest = createDigest(smash);
                window.digest = digest;
                window.history.pushState('', '', '?d=' + digest);
            }
            catch(er){
                LOG(er);
            }
         })
        .catch(er => LOG(er));
}

function handleUpdate(smash){
    if (window.isQuizPage || window.isDailyPage){
        document.title = 'Answer Smasher';
        document.getElementsByTagName('input')[0].focus();
    }
    else {
        document.title = combineSpelling(smash.firstAnswer, smash.secondAnswer);
    }
    window?.setShareMsg();
    equalizeGuessBoxes()
}

function checkSmash(){
    if (elem.state.guess1.toLowerCase() === elem.state.firstAnswer.toLowerCase() && 
            elem.state.guess2.toLowerCase() === elem.state.secondAnswer.toLowerCase()){
        elem.setState({isCorrect: true}, window?.setShareMsg);
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

function toggleShare(show){
    if(window.setShareMsg){
        setShareMsg()
    }
    var modal = document.getElementById("shareContainer");
    if (show === true){
        modal?.classList.remove('hidden');
    }
    else if (show === false){
        modal?.classList.add('hidden');
    }
    else {
        document.getElementById("shareContainer")?.classList.toggle('hidden');
    }
}

function toggleHelp(show){
    var helpModal = document.getElementById("helpContainer");
    if (!helpModal) {
        return;
    }
    if (typeof show !== 'boolean'){
        show = helpModal.classList.contains('hidden');
    }
    if (show){
        helpModal.classList.remove('hidden');
        location.hash = 'help';
    }
    else {
        helpModal.classList.add('hidden');
        location.hash = '';
    }
}

function closeAllModals(){
    toggleShare(false);
    toggleHelp(false);
}

function getGuesses(){
    return {
        guess1: toLowerPreserveSurname(document.getElementById('guess1').value.trim()),
        guess2: toLowerPreserveSurname(document.getElementById('guess2').value.trim()),
    }
}

function LOG(msg){
    var logFoot = document.getElementById("logFoot");
    if (logFoot && msg){
        logFoot.innerText = msg;
    }
}

if (/help/.test(location.hash)){
    document.getElementById("helpContainer")?.classList.remove('hidden')
}

document.getElementById('root')?.addEventListener('click', closeAllModals);