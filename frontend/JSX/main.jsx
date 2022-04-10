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
        visibleTip: null
    };
  }

  render() {
    return (
        <div className={`${this.state.firstAnswer ? "" : "hidden"} `}>
            <div id="parts">
                <span id="part1" onMouseOver={_=>{this.setState({visibleTip: 1})}} onMouseOut={_=>{this.setState({visibleTip: null})}}>
                    {`${this.state.visibleTip === 1 ? this.state.firstClue : this.state.firstAnswer}`}
                </span>
                <span id="part2" onMouseOver={_=>{this.setState({visibleTip: 2})}} onMouseOut={_=>{this.setState({visibleTip: null})}}>
                {`${this.state.visibleTip === 2 ? this.state.secondClue : this.state.secondAnswer}`}&nbsp;
                </span>
            </div>
            <div id="reactContainer" onClick={next} onKeyPress={nextOnEnter}>
            <div id="answerBlock">
                <span id="answer">{combineSpelling(this.state.firstAnswer, this.state.secondAnswer)}</span><br></br>
                <span id="IPA">{this.state.pronounciation ? '/' + this.state.pronounciation + '/' : ''}</span><br />
                <div id="meaning">{combineDef(this.state.firstClue, this.state.secondClue, this.state.firstTarget, this.state.secondTarget)}</div>
            </div>
            <div id="buttonContainer"><button>Generate</button></div>
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