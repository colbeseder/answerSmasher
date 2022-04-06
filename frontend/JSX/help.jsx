
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
            <h1>What's an Answer-Smash?</h1>
            <p>You can make an answer-smash by combining two words with overlapping sounds. 
              For example <i>Bowtie</i> and <i>Tiger</i> become <i><a href="/?d=Ym93dGllLHRpZ2Vy">Bowtiger</a></i></p>
            <h1>How to Play</h1>
            <p>The <a href="/quiz">Quiz page</a> will give you two definitions, whose answers combine to form an answersmash</p>
            <p>The <a href="/daily">Smash of the Day</a> gives you the day's answersmasher challenge. Can you get it before your friends? </p>
        </div>
    )
  }
}

var helpElem = ReactDOM.render(React.createElement(HelpZone), document.querySelector('#helpContainer'));
