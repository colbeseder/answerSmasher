
class HelpZone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showHelp: false
    }
  }

  render() {
    return (
        <div id="helpModal">
            <img className="navButton closeMenu" src="/static/icons/close.svg" onClick={_=>toggleHelp(false)} />
            <h1>What's an AnswerSmash?</h1>
            <p>You can make an AnswerSmash by combining two words with overlapping sounds. 
              For example <i>Bowtie</i> and <i>Tiger</i> become <i><a href="/?d=Ym93dGllLHRpZ2Vy">Bowtiger</a></i></p>
            <h1>How to Play</h1>
            <p>The <a href="/quiz">Quiz page</a> will give you two definitions, whose answers combine to form an AnswerSmash</p>
            <p>The <a href="/daily">Smash of the Day</a> gives you the day's AnswerSmasher challenge. Can you get it before your friends? </p>
        </div>
    )
  }
}

var helpElem = ReactDOM.render(React.createElement(HelpZone), document.querySelector('#helpContainer'));
