
class ShareZone extends React.Component {
    constructor(props) {
      super(props);
      this.state = {}
    }
  
    render() {
      return (
          <div id="shareModal">
              <div id="twitter">
                <a id="tweetButton" className="twitter-share-button button" target="_blank"
                  href="https://twitter.com/intent/tweet?text=">
                    Share on Twitter</a>
              </div>

              <div id="whatsapp">
                <a id="whatsAppButton" className="button" target="_blank"
                  href="whatsapp://send?text=" data-action="share/whatsapp/share">
                    Share on Whatsapp</a>
              </div>
              
          </div>
      )
    }
  }
  
var footerElem = ReactDOM.render(React.createElement(ShareZone), document.querySelector('#shareContainer'));


function updateShareContent(msg) {
    document.getElementById("tweetButton").href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(msg);
    document.getElementById("whatsAppButton").href = "whatsapp://send?text=" + encodeURIComponent(msg);
}

updateShareContent("I guessed today's Answer Smash\n" + location.href);