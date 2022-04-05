
class FooterZone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
        <div id="foot">
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
