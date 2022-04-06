
class ShareZone extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        shareDefinition: location.pathname === "/", // 0: daily, 1: definition
        shareMsg: "Check out http://answersmasher.com",
        noDefinition: false
      }
    }
  
    render() {
      return (
          <div id="shareModal">
            <img className="navButton closeMenu" src="/static/icons/close.svg" onClick={toggleShare} />
            <div className="center">
            <h1>Share</h1>
            <link rel="stylesheet" href="/static/styles/switch.css"></link>
            
            <div id="shareSelector">
              <span className={`switchOption ${this.state.shareDefinition ? "bold" : ""}`}>Definition</span>
              <br className="mobileOnly" />
              <span>
              <label className="switch">
                <input id="whatToShare" type="checkbox" checked={ !this.state.shareDefinition } onChange={toggleShareSwitch}/>
                <span className="slider round"></span>
              </label>
              </span>
              <br className="mobileOnly" />
              <span className={`switchOption ${this.state.shareDefinition ? "" : "bold"}`}>Challenge</span>
              <br />
              <span className={this.state.noDefinition ? "" : "invisible"}>You can't share the daily definition. Spoilers.</span>
            </div>
            <div id="shareButtons">
              <div id="twitter" className="shareButton">
                <a id="tweetButton" className="twitter-share-button button" target="_blank"
                  href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent(this.state.shareMsg)}>
                    Twitter</a>
              </div>
              <br />

              <div id="whatsapp" className="shareButton mobileOnly">
                <a id="whatsAppButton" className="button" target="_blank"
                  href={"whatsapp://send?text=" + encodeURIComponent(this.state.shareMsg)} data-action="share/whatsapp/share">
                    Whatsapp</a>
              </div>
              </div>
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

function toggleShareSwitch(){
  if ( !shareElem.state.shareDefinition ){
    if (location.pathname === "/daily"){
      shareElem.setState({
        noDefinition: true
      })
      return;
    }
    if (!isSolved()){
      window?.reveal();
    }
  }
  shareElem.setState({
    shareDefinition: !shareElem.state.shareDefinition
  }, setShareMsg)
}

function isSolved(){
  return !!document.getElementById("answer").innerText;
}

function setShareMsg(){
  var tryitOutMessage;
  /*
    Messages for sending a challenge
  */
  if(location.pathname === "/daily"){
    // Smash of the day
    tryitOutMessage = `See if you can beat me on the *AnswerSmash of the day* http://answersmasher.com/daily`;
  }
  else if (location.pathname !== "/" && isSolved() && !elem.state.isRevealed) {
    // Quiz, and I got it!
    tryitOutMessage = `I guessed today's AnswerSmash. Try it http://answersmasher.com/quiz?d=${window.digest}` ;
  }
  else {
    // Main page, or quiz but I didn't guess it
    tryitOutMessage = `See how you do on this AnswerSmash  http://answersmasher.com/quiz?d=${window.digest}` ;
  }

  var msg = shareElem.state.shareDefinition ? 
    `Check out the definition for _${document.getElementById("answer").innerText}_ \nhttp://answersmasher.com/?d=${window.digest}` :
    tryitOutMessage ;
  shareElem.setState({
    "shareMsg": msg
  });
}

setShareMsg();