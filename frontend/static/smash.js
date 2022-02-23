var currentSmash = {};

function next(){
    getNewSmash()
        .then(r => updateSmash(r))
        .catch(next)
}

function getNewSmash(){
    return new Promise((resolve, reject) => {
        fetch("http://localhost:3000/api/smash").then(r => r.json()).then(r => {
            if (r.firstAnswer) {
                resolve(r);
            }
            else {
                reject();
            }
        });
    });
}

function updateSmash(smash){
    currentSmash = smash;
    document.getElementById("clue1").innerText = currentSmash?.firstClue ;
    document.getElementById("clue2").innerText = currentSmash?.secondClue;
    document.getElementById("answer1").innerHTML = "";
    document.getElementById("answer2").innerHTML = "";
    document.getElementById("result").innerText = "";
    document.getElementById("answer").innerText = "";
    document.getElementById("IPA").innerText = "";

    document.getElementById("buttonGroup1").style.display = "block";
    document.getElementById("buttonGroup2").style.display = "none";
    document.getElementById("answer1").focus();
}

function reveal(){
    document.getElementById("answer1").innerHTML = currentSmash.firstAnswer;
    document.getElementById("answer2").innerHTML = currentSmash.secondAnswer;
    document.getElementById("result").innerText = "Revealed";
    document.getElementById("answer").innerText = combineSpelling();
    document.getElementById("IPA").innerText = `/${currentSmash.pronounciation}/`

    document.getElementById("buttonGroup1").style.display = "none";
    document.getElementById("buttonGroup2").style.display = "block";
    document.getElementById("next").focus();
}

function checkSmash(){
    if (document.getElementById("answer1").innerHTML.toLowerCase() === currentSmash.firstAnswer.toLowerCase()
        && document.getElementById("answer2").innerHTML.toLowerCase() === currentSmash.secondAnswer.toLowerCase()){
            document.getElementById("result").innerText = "Correct";
            document.getElementById("answer").innerText = combineSpelling();
            document.getElementById("IPA").innerText = `/${currentSmash.pronounciation}/`

            document.getElementById("buttonGroup1").style.display = "none";
            document.getElementById("buttonGroup2").style.display = "block";
            document.getElementById("next").focus();
        }
    else{
        document.getElementById("result").innerText = "Wrong";
    }
}

function leadCapital(s){
    return s.replace(/^./, x => x.toUpperCase())
}

function combineSpelling(){
    var a = currentSmash.firstAnswer;
    var b = currentSmash.secondAnswer;
    var joint = b.charAt(0);
    if (a.indexOf(joint) === -1){
        return `${leadCapital(a)}-${leadCapital(b)}`;
    }
    else {
        var parts = a.split(joint);
        parts.pop();
        return leadCapital(parts.join(joint)) + leadCapital(b)
    }
}

function revealOnEnter(ev){
    if (ev.key ===  "Enter") {
        checkSmash();
        ev.preventDefault();
    }
}

document.getElementById("submit").addEventListener("click", checkSmash);
document.getElementById("next")?.addEventListener("click", next);
document.getElementById("reveal").addEventListener("click", reveal);
document.getElementById("answer1").addEventListener("keypress", revealOnEnter);
document.getElementById("answer2").addEventListener("keypress", revealOnEnter);
next();