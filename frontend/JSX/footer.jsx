
class FooterZone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
        <div id="foot" class="footer">
          <span id="logFoot" className={/SamsungBrowser/i.test(navigator.userAgent) ? '' : 'hidden'}></span>
                <a href="/daily">Daily Puzzle</a> • <a onClick={toggleShare}>Share</a> • Created by&nbsp;
                <a href="https://twitter.com/bryapp">
                    @bryapp
                </a>
        </div>
    )
  }
}

var footerElem = ReactDOM.render(React.createElement(FooterZone), document.querySelector('#footerContainer'));
