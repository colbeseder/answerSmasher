// new Date().setUTCHours(0,0,0,0)
const EPOCH = 1649203200000 ;

function getChallengeNumber(){
    return Math.floor((Date.now() - EPOCH) / (24*60*60*1000))
}

function getChallenge() {
    return challenges[getChallengeNumber() % challenges.length];
}

function padRight(str, p){
    if (str.length >= p){
        return str;
    }
    var x = p - str.length;
    var pad = new Array(x +1).join(' ');
    return str + pad;
}

function showAllChallenges(){
    var days = 0;
    for (var days = 0; days < challenges.length; days++){
        var c = challenges[days];
        var pair = atob(c);
        console.log(`${new Date(EPOCH + 8.64e7 ).toDateString()}: ${padRight('"' + pair + '"', 25)}\t http://answersmasher.com/quiz?d=${c}`);
    }
}

var challenges = [
    "Z2xvc3NhcnksYXJlbmE=",
    "Y2hvY29sYXRlLGxpdGVyYWN5",
    "Y2hhbXBhZ25lLGFuZ2Vs",
    "Z3JhYixyYWJiaXQ",
    "bmV2ZXJ0aGVsZXNzLGxlc3Nlcg==",
    "c3ByaW50LGludGVyZmFjZQ==",
    "c3F1ZWFtaXNoLG1pc3Npb24=",
    "UmljaGFyZCBPc21hbixtYW5vcg==",
    "dGFyZ2V0LGd1aXRhcg==",
    "ZHJpbmssaW5jcmVkaWJsZQ==",
    "dG9vdGhicnVzaCxSdXNzaWFu",
    "cHVycGxlLHBvbGx1dGlvbg==",
    "bWVjaGFuaWMsbmlja25hbWU=",
    "c3dpbSx3aGltc2ljYWw=",
    "aGVyb24scmVuYWlzc2FuY2U=",
    "Z3JpbixyaW5zZQ==",
    "cmVtYXJrLGFyY2FkZQ==",
    "d2hhbGUsYWxpZW4=",
    "bWFybW90LG1hdHVyZQ==",
    "d2hpbXNpY2FsLGNvbGxlY3RpYmxl",
    "cHJvdGVzdCxlc3R1YXJ5",
    "Y2FsbCxhbHJlYWR5",
    "c2ltdWx0YW5lb3VzbHksc2xlZXA",
    "dHJhZmZpYyxmaWN0aW9u"
];

module.exports = getChallenge;

if (require.main === module) {
    showAllChallenges();
}