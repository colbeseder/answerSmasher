window.isQuizPage = true;

const e = React.createElement;

class QuoteZone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answer: '',
            firstAnswer: '',
            firstClue: '',
            secondAnswer: '',
            secondClue: '',
            firstTarget: '',
            secondTarget: '',
            pronounciation: '',
            guess: '',
            guess1: '',
            guess2: '',
            isCorrect: false,
            isRevealed: false
        };

        this.handleChange = function(guess){
            this.setState({guess: guess.toUpperCase(),
                isCorrect: guess.toUpperCase() === this.state.answer.toUpperCase()
            });
        }

        this.clear = function(){
            document.getElementById("guessBox").value = '';
            document.title = 'AnswerSmasher'
            this.setState({
                isCorrect: false,
                isRevealed: false,
                guess: ''
            });
            document.getElementById("guessBox").focus();
        }

        this.reveal = function(){
            location.hash = "reveal"
            document.title = combineSpelling(elem.state.firstAnswer, elem.state.secondAnswer);
            elem.setState({
                guess: this.state.answer.toUpperCase(),
                isRevealed: true
            });
        }
    }

    render() {
        return (
                <div id="reactContainer" className={`${this.state.isCorrect ? "correct" : ""} ${this.state.isRevealed ? "revealed" : ""}`}>


                    <div className="clues">
                        <div className="clue-pair">
                            <div className="clue">{cleanClue(this.state.firstClue, 3)}</div>
                            <div className="clue">{cleanClue(this.state.secondClue, 3)}</div>
                        </div>
                    </div>

                    <div className="input-area">
                        <input id="guessBox"
                        type="text"
                        defaultValue={this.state.guess}
                        onInput={e => this.handleChange(e.target.value)}
                        maxLength={30}
                        placeholder="Enter your answer"
                        />
                    </div>

                    <div className="grid">
                        {this.state.answer.split('').map((char, index) => (
                        <div
                            key={index}
                            className={`tile ${this.state.guess[index]?.toUpperCase() === this.state.answer[index]?.toUpperCase() ? 'correct' : ''}`}
                        >
                            {this.state.guess[index]?.toUpperCase() || ''}
                        </div>
                        ))}
                    </div>

                    <div>
                        <span id="IPA">{this.state.isCorrect ? '/' + this.state.pronounciation + '/' : ''}</span>
                        <div className="message">{this.state.isRevealed ? '🧐 Revealed!' : this.state.isCorrect ? '🎉 Correct!' : ''}</div>
                    </div>

                        <br />


                    <div id="buttonContainer">

                        {(this.state.isCorrect || this.state.isRevealed) ? <button id="nextButton" onClick={x => { next() }}>Next Smash</button> : <button id="revealButton" onClick={this.reveal}>Reveal</button>}
                    </div><br /><br />
            </div>
        )
    }
}


const domContainer = document.querySelector('#root');
window.elem = ReactDOM.render(e(QuoteZone), domContainer);

function loadPage() {
    try{
        var digest = /[?&]d=([A-Z0-9/+=]+)/i.exec(location.search)?.at(1);
        if (digest) {
            getSmashfromDigest(digest);
        }
        else {
            next();
        }
    }
    catch(er){
        console.log(er);
    }
}

window.onpopstate = loadPage;

loadPage();