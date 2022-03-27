
class ShareZone extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        toShare: 0, // 0: daily, 1: definition
        shareMsg: "I guessed today's Answer Smash\n" + location.href
      }
    }
  
    render() {
      return (
          <div id="shareModal">
            <link rel="stylesheet" href="/static/styles/switch.css"></link>
              <div>
                <div className="switch-button">
                  <input id="whatToShare" className="switch-button-checkbox" type="checkbox"></input>
                  <label className="switch-button-label" for="">
                    <span className="switch-button-label-span">Challenge</span>
                  </label>
                </div>
              </div>

              <div id="twitter">
                <a id="tweetButton" className="twitter-share-button button" target="_blank"
                  href={"https://twitter.com/intent/tweet?text=" + shareMsg}>
                    Share on Twitter</a>
              </div>

              <div id="whatsapp">
                <a id="whatsAppButton" className="button" target="_blank"
                  href={"whatsapp://send?text=" + shareMsg} data-action="share/whatsapp/share">
                    Share on Whatsapp</a>
              </div>
              
          </div>
      )
    }
  }
  
var shareElem = ReactDOM.render(React.createElement(ShareZone), document.querySelector('#shareContainer'));


function updateShareContent(msg) {
    document.getElementById("tweetButton").href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(msg);
    document.getElementById("whatsAppButton").href = "whatsapp://send?text=" + encodeURIComponent(msg);
}

document.getElementById("whatToShare").addEventListener("input", 
  function(){
    shareElem.state.toShare = this.checked ? 1 : 0;
    shareElem.state.shareMsg = this.checked ? 
      `Check out the definition for ${document.getElementById("answer").innerText} \nhttp://answersmasher.com/?d=${window.digest}` :
      "I guessed today's Answer Smash\n" + location.href ;
  });