
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

module.exports = combineSpelling;