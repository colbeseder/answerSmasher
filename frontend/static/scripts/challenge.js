// new Date().setUTCHours(0,0,0,0)
const EPOCH = 1649203200000 ;

function getChallengeNumber(){
    return Math.floor((Date.now() - EPOCH) / (24*60*60*1000))
}

function getChallenge() {
    return new Promise((resolve, reject) => {
        fetch("/static/scripts/challenges.json")
            .then(r => r.json())
            .then(r => {
                resolve(r[getChallengeNumber()])
            })
    });
}