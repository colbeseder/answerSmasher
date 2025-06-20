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
            pronounciation: '',
            guess: '',
            isCorrect: false,
            isRevealed: false,
            isDailyPage: location.pathname === "/daily",
            isScorable: true,
            score: 0
        };

        this.handleChange = function(guess, event){
            let correct = guess.toUpperCase().trim() === this.state.answer.toUpperCase();
            let newState = {
                guess: guess.toUpperCase(),
                isCorrect: correct
            }
            if (correct && !this.state.isRevealed && this.state.isScorable){
                incrementScore();
                newState.isScorable = false;
                let score = getScore();
                newState.score = score;
            }
            this.setState(newState);
        }

        this.giveHint = function(){
            if (this.state.isCorrect || this.state.isRevealed){
                return;
            }
            let answerBox = document.getElementById('guessBox');
            let guess = answerBox.value;
            let firstPartLength = this.state.answer.length - this.state.secondAnswer.length; 

            while (guess.length <= firstPartLength){
                guess += ' ';
            }
            guess = this.state.firstAnswer[0] + guess.slice(1);
            guess = guess.slice(0, firstPartLength) + this.state.secondAnswer[0] + guess.slice(firstPartLength + 1)
            answerBox.value = guess;
            this.handleChange(guess);
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

        this.setPosition = function(index){
            let answerBox = document.getElementById('guessBox');
            let guess = answerBox.value;

            while (guess.length < index){
                guess += ' ';
            }
            answerBox.value = guess;
            answerBox.focus();
            setCaret('guessBox', index);
        }

        this.reveal = function(){
            location.hash = "reveal"
            document.title = combineSpelling(elem.state.firstAnswer, elem.state.secondAnswer);
            elem.setState({
                guess: elem.state.answer.toUpperCase(),
                isRevealed: true
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // Trigger confetti when isCorrect changes from false to true
        if (!prevState.isCorrect && this.state.isCorrect && !this.state.isRevealed) {
            if (window.explodeConfetti) {
                window.explodeConfetti();
            }
        }
    }

    render() {
        return (
                <div id="reactContainer" className={`${this.state.isCorrect ? "correct" : ""} ${this.state.isRevealed ? "revealed" : ""}`}>


                    <div className="clues">
                        <div className="clue-pair">
                            <div className="clue"><img className="clueIcon" src="/static/icons/magglass.png" />{cleanClue(this.state.firstClue, 3)} ({getWordLength(this.state.firstAnswer)})</div>
                            <div className="clue"><img className="clueIcon" src="/static/icons/magglass.png" />{cleanClue(this.state.secondClue, 3)} ({getWordLength(this.state.secondAnswer)})</div>
                        </div>
                    </div>

                    <div className="input-area">
                        <input id="guessBox"
                        type="text"
                        defaultValue={this.state.guess}
                        onInput={e => this.handleChange(e.target.value, e)}
                        maxLength={30}
                        placeholder="Enter your answer"
                        /> 
                    <img className={`message-icon ${(this.state.isCorrect || this.state.isRevealed) ? "" : "pointer"}`} onClick={x => this.giveHint()} src={`/static/icons/${this.state.isRevealed ? "revealed" : (this.state.isCorrect ? "correct" : "hint")}.png`} />
                    {(this.state.isRevealed || this.state.isCorrect) ?
                         (<span className="message">{this.state.isRevealed ? ' Revealed!' : this.state.isCorrect ? ' Correct!' : ''}</span> ): 
                         (<span className="hintButton" onClick={x => this.giveHint()}>{(this.state.isCorrect || this.state.isRevealed) ? '' : "hint ⁉️"}</span>) 
                    }

                    </div>

                    <div className="grid"  style={{width: 55*(this.state.answer?.length || 0), maxWidth: "90%"}} >
                        {this.state.answer.split('').map((char, index) => (
                        <div
                            key={index} onClick={x => this.setPosition(index)}
                            className={`tile ${!(index === 0 || index === this.state.answer.length - (this.state.secondAnswer.length)) || 'startLetter'} 
                            ${(this.state.guess[index]?.toUpperCase() === this.state.answer[index]?.toUpperCase()) || 
                                 (/[ -'_]/.test(this.state.answer[index]) && !this.state.guess[index] ) ? 'correct' : ((this.state.guess[index] && this.state.guess[index] !== ' ') ? 'wrong' : '')}`}
                        >
                            {/[ -'_]/.test(this.state.answer[index]) ? this.state.answer[index] : (this.state.guess[index]?.toUpperCase() || '')}
                        </div>
                        ))}
                    </div>

                    <div>
                        <span id="IPA">{(this.state.isCorrect || this.state.isRevealed) ? '/' + this.state.pronounciation + '/      ' + this.state.firstAnswer + '+' + this.state.secondAnswer: ''}</span>
                    </div>

                        <br />


                    <div id="buttonContainer" className={this.state.isDailyPage ? 'hidden': ''}>

                        {(this.state.isCorrect || this.state.isRevealed) ? <button id="nextButton" onClick={x => { next() }}>Next Smash</button> : <button id="revealButton" onClick={this.reveal}>Reveal</button>}
                    </div><br /><br />
            </div>
        )
    }
}


const domContainer = document.querySelector('#root');
window.elem = ReactDOM.render(e(QuoteZone), domContainer);

const input = document.getElementById('guessBox'); // or a textarea
input.addEventListener('keydown', function() {
  const s = this.selectionStart;
  this.value = this.value.slice(0, s) + this.value.slice(s + 1);
  this.selectionEnd = s;
}, false);

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