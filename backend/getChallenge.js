// new Date().setUTCHours(0,0,0,0)
const EPOCH = 1649203200000 ;

function getChallengeNumber(){
    return Math.floor((Date.now() - EPOCH) / (24*60*60*1000))
}

function getChallenge() {
    return challenges[getChallengeNumber() % challenges.length];
}

var challenges = [
    "Z2xvc3NhcnksYXJlbmE=",
    "Y2hvY29sYXRlLGxpdGVyYWN5",
    "Y2hhbXBhZ25lLGFuZ2Vs",
    "Z3JhYixyYWJiaXQ",
    "bmV2ZXJ0aGVsZXNzLGxlc3Nlcg==",
    "c3ByaW50LGludGVyZmFjZQ==",
    "Y2F0aG9saWMsbGlja2luZw==",
    "dGFyZ2V0LGd1aXRhcg==",
    "ZHJpbmssaW5jcmVkaWJsZQ==",
    "c3F1ZWFtaXNoLG1pc3Npb24=",
    "dG9vdGhicnVzaCxSdXNzaWFu",
    "cHVycGxlLHBvbGx1dGlvbg==",
    "bWVjaGFuaWMsbmlja25hbWU=",
    "c3dpbSx3aGltc2ljYWw=",
    "aGVyb24scmVuYWlzc2FuY2U=",
    "Z3JpbixyaW5zZQ==",
    "cmVtYXJrLGFyY2FkZQ==",
    "d2hhbGUsYWxpZW4=",
    "bWFybW90LG1hdHVyZQ=="
];

module.exports = getChallenge;