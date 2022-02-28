const e = React.createElement;
const apiUrl = "http://api." + location.host


function leadCapital(s){
    return s.replace(/^./, x => x.toUpperCase())
}

function combineSpelling(a, b){
    if (!a) {
        return b;
    }
    if (!b){
        return leadCapital(a);
    }
    var joint = b.charAt(0);
    if (a.indexOf(joint) === -1){
        return `${leadCapital(a)}-${leadCapital(b)}`;
    }
    else {
        var parts = a.split(joint);
        parts.pop();
        return leadCapital(parts.join(joint) + b)
    }
}

function createDigest(smash){
    return btoa(smash.firstAnswer + "," + smash.secondAnswer);
}

function removeBrackets(s){
    return s.replace(/\([^)]*\)\s*/g, '');
}

function leadingLower(s){
    return s.replace(/^\s*[A-Z]/, x => x.toLowerCase());
}

var breakers = "(,|\\band\\b|\\bor\\b|\\bwith\\b|\\bfor\\b|\\bof\\b|\\bin\\b|\\bis\\b)";

function combineDef(a, b){
    var joiner = ' ';
    var re = new RegExp(breakers, 'i');
    if (!re.test(a) && !re.test(b)){
        joiner = ' with ';
    }

    return removeBrackets(a).replace(new RegExp("^(.*?)" + breakers + ".*$", 'i'), '$1$2') +
            joiner +
            leadingLower(removeBrackets(b)).replace(new RegExp(".*" + breakers, 'i'), '');
}

function getSmashfromDigest(digest){
    return new Promise((resolve, reject) => {
        fetch(apiUrl + "/api/combine/" + digest).then(r => r.json()).then(smash => {
            if (smash.firstAnswer) {
                updateSmash(smash);
                if(/reveal/.test(location.hash)){
                    reveal();
                }
            }
            else {
                next();
            }
        });
    });
}



function next(){
    fetch(apiUrl + "/api/smash").then(r => r.json())
        .then(r => { elem.setState(r) })
        .catch();
}

class QuoteZone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        firstAnswer: '',
        firstClue: '',
        secondAnswer: '',
        secondClue: '',
        pronounciation: ''
    };
  }

  render() {
    return (
        <div>
        <span id="answer">{combineSpelling(this.state.firstAnswer, this.state.secondAnswer)}</span><br></br>
        <span id="IPA">/{this.state.pronounciation}/</span><br />
        <span>{this.state.firstAnswer} {this.state.secondAnswer}</span><br />
        <span id="meaning">1. {combineDef(this.state.firstClue, this.state.secondClue)}</span><br></br>
        <button onClick={x=>{next(this)}}>Next Smash</button>
        </div>

    )
  }
}



const domContainer = document.querySelector('#root');
var elem = ReactDOM.render(e(QuoteZone), domContainer);
next(elem);