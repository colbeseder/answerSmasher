isQuizPage = true;

const e = React.createElement;

class QuoteZone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        firstAnswer: '',
        firstClue: '',
        secondAnswer: '',
        secondClue: '',
        pronounciation: '',
        guess1: '',
        guess2: '',
        isCorrect: false,
        isRevealed: false
    };
  }

  render() {
    return (
        <div>
            <div id="reactContainer" className={`${this.state.isCorrect ? "correct" : ""} ${this.state.isRevealed ? "revealed": ""}`}>
                <div id="answerBlock">
                    <span id="answer">{this.state.isCorrect ? combineSpelling(this.state.firstAnswer, this.state.secondAnswer) 
                        : combineSpelling(this.state.guess1, this.state.guess2) || ' '}</span><br></br>
                    <span id="IPA">{this.state.isCorrect ? '/' + this.state.pronounciation + '/' : ''}</span><br />
                    <div id="meaning">{this.state.isCorrect ? combineDef(this.state.firstClue, this.state.secondClue) : ''}</div><br></br>
                </div>
                <div id="guesses">
                    <div className="guessBox" id="guessBox1">
                        <div>{removeBrackets(this.state.firstClue)}</div><br />
                        <input id="guess1" onInput={ev => {this.setState({guess1: ev.target.value.toLowerCase()}, checkSmash)}} />
                    </div>
                    <div className="guessBox" id="guessBox2">
                        <div>{removeBrackets(this.state.secondClue)}</div><br />
                        <input id="guess2" onInput={ev => {this.setState({guess2: ev.target.value.toLowerCase()}, checkSmash)}} />
                    </div>
                </div>
                <div id="buttonContainer">
                    <button id="revealButton" onClick={reveal}>Reveal</button>
                    <button id="nextButton" onClick={x=>{next()}}>Next Smash</button>
                </div><br /><br />
            </div>
        </div>
    )
  }
}



const domContainer = document.querySelector('#root');
var elem = ReactDOM.render(e(QuoteZone), domContainer);

function loadPage(){
    var digest = /[?&]d=([A-Z0-9/+=]+)/i.exec(location.search)?.at(1);
    if (digest){
        getSmashfromDigest(digest);
    }
    else {
        next();
    }
    
}

window.onpopstate = loadPage;

loadPage();