
class ShareZone extends React.Component {
    constructor(props) {
      super(props);
      this.state = {}
    }
  
    render() {
      return (
          <div id="shareModal">
              <div id="twitter">
              <a id="tweetButton" className="twitter-share-button"
                href="https://twitter.com/intent/tweet?text=">
                    Share on Twitter</a>
              </div>
          </div>
      )
    }
  }
  
var footerElem = ReactDOM.render(React.createElement(ShareZone), document.querySelector('#shareContainer'));


function updateShareContent(msg) {
    document.getElementById("tweetButton").href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(msg);
}

updateShareContent("I guessed today's answersmash\n" + location.href);