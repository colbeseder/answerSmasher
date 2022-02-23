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
    document.getElementById("clue1").innerText = currentSmash?.firstClue + "    |      ";
    document.getElementById("clue2").innerText = currentSmash?.secondClue;
    document.getElementById("answer1").innerHTML = ""
    document.getElementById("answer2").innerHTML = ""
    document.getElementById("result").innerText = "";
}

function reveal(){
    document.getElementById("result").innerText = currentSmash.firstAnswer + ", " + currentSmash.secondAnswer;
}

function checkSmash(){
    if (document.getElementById("answer1").innerHTML.toLowerCase() === currentSmash.firstAnswer.toLowerCase()
        && document.getElementById("answer2").innerHTML.toLowerCase() === currentSmash.secondAnswer.toLowerCase()){
            document.getElementById("result").innerText = "Correct"
        }
    else{
        document.getElementById("result").innerText = "Wrong"
    }
}

document.getElementById("submit").addEventListener("click", checkSmash);
document.getElementById("next").addEventListener("click", next);
document.getElementById("reveal").addEventListener("click", reveal);