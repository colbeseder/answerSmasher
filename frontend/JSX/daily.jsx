window.isDailyPage = true;

const e = React.createElement;

class QuoteZone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        firstAnswer: '',
        firstClue: '',
        secondAnswer: '',
        secondClue: '',
        firstTarget: '',
        secondTarget: '',
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
                <div id="guesses">
                    <div className="guessBox" id="guessBox1">
                        <div>{cleanClue(this.state.firstClue, 3)}</div><br />
                        <div>{cleanClue(this.state.secondClue, 3)}</div><br />
                    </div>
                </div>

                <div id="answerBlock">
                    <span id="answer">{this.state.isCorrect ? combineSpelling(this.state.firstAnswer, this.state.secondAnswer) 
                        : combineSpelling(this.state.guess1, this.state.guess2) || ' '}</span>
                        <img className={`${this.state.isCorrect && !this.state.isRevealed ? '' : 'shrunk'}`} src="/static/icons/check-mark.svg" id="correctImage" /><br />
                    <span id="IPA">{this.state.isCorrect ? '/' + this.state.pronounciation + '/' : ''}</span><br />
                </div>

                <div className="guessBox" id="answerBox">
                        <input id="guess1" onKeyPress={nextOnEnter} onInput={ev => {this.setState(getGuesses(), checkSmash)}} />
                        <input id="guess2" onKeyPress={nextOnEnter} onInput={ev => {this.setState(getGuesses(), checkSmash)}} />
                    </div>
                    <br /><br />
            </div>
        </div>
    )
  }

}

const domContainer = document.querySelector('#root');
var elem = ReactDOM.render(e(QuoteZone), domContainer);

getDaily();