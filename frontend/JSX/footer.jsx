
class FooterZone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
        <div id="foot">
            <a href="/">
                <img className="navButton" src="/static/icons/tennis-blue.svg" />
                Smashes
            </a>
            <a href="/quiz">
                <img className="navButton" src="/static/icons/brain-user-blue.svg" />
                quiz
            </a>
            
            <span id="credit">
                Created by&nbsp;
                <a href="https://twitter.com/bryapp">
                    @bryapp
                </a>
            </span>
        </div>
    )
  }
}

var footerElem = ReactDOM.render(React.createElement(FooterZone), document.querySelector('#footerContainer'));
