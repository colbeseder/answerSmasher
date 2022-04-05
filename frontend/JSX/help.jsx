
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
            help
        </div>
    )
  }
}

var helpElem = ReactDOM.render(React.createElement(HelpZone), document.querySelector('#helpContainer'));
