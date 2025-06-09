
window.apiUrl = window.apiUrl || "http://api.answersmasher.com";

function incrementScore(x){
    if (typeof x !== 'number'){
        x = 1;
    }
    let current = getScore();
    
    localStorage.score = current + x;
}

function getScore(){
    return localStorage.score ? parseInt(localStorage.score, 10) : 0;
}

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
    // Edge case for ti=sh (eg.  illustration+shenanigans)
    if (/^sh/i.test(b) && /ti/i.test(a)){
        joint = "(?:sh|ti)"
    }
    if (!new RegExp(joint, "i").test(a.slice(1, -1))){
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

function getWordLength(s){
    let parts = s.split(/(?<=\W)|(?=\W)/g);
    let results = parts.map(part => /^\W+$/.test(part) ? part : part.length);
    return results.join(',').replace(/, ,/g, ',').replace(/,(\D+),/g, '$1');
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
                smash.answer = combineSpelling(smash.firstAnswer, smash.secondAnswer);
                if (smash.firstAnswer) {
                    elem.setState(smash, x => handleUpdate(smash));
                    if(/reveal/.test(location.hash)){
                        try {
                            window.elem.reveal();
                        }
                        catch(er){}
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
                smash.answer = combineSpelling(smash.firstAnswer, smash.secondAnswer);
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
    if (window.isDailyPage){
        document.getElementsByTagName('input')[0].focus();
    }
    window?.setShareMsg();
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
    document.title = combineSpelling(elem.state.firstAnswer, elem.state.secondAnswer);
    elem.setState({
        isCorrect: true,
        isRevealed: true
    });
}

function clear(){
    if(window.isQuizPage){
       window.elem.clear();
    }
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

function explodeConfetti() {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 1000,
        scalar: 2 // << Bigger particles
      };
    const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
        return clearInterval(interval);
    }

    const particleCount = 100 * (timeLeft / duration);
    // random origin point
    confetti(Object.assign({}, defaults, {
        particleCount,
        origin: {
        x: Math.random(),
        y: Math.random() - 0.2
        }
    }));
    }, 250);
}

function setCaret(elemId, caret){
    let box = document.getElementById(elemId);
    box.setSelectionRange(caret, caret);
}

function LOG(msg){
    var logFoot = document.getElementById("logFoot");
    if (logFoot && msg){
        logFoot.innerText = msg;
    }
    console.log(msg);
}

if (/help/.test(location.hash)){
    document.getElementById("helpContainer")?.classList.remove('hidden')
}

document.getElementById('root')?.addEventListener('click', closeAllModals);