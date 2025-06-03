
class ShareZone extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        shareDefinition: location.pathname === "/", // 0: daily, 1: definition
        shareMsg: "Check out ",
        shareLink: "http://answersmasher.com",
        noDefinition: false,
        isCopied: false
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
                <a id="whatsAppButton" className="shareButtonLink" target="_blank"
                  href={"whatsapp://send?text=" + encodeURIComponent(this.state.shareMsg + this.state.shareLink)} data-action="share/whatsapp/share">
                  <div id="whatsapp" className="shareButton mobileOnly"></div>
                </a>
                <a id="tweetButton" className="twitter-share-button shareButtonLink" target="_blank"
                    href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent(this.state.shareMsg + this.state.shareLink)}>
                  <div id="twitter" className="shareButton"></div>
                </a>
                <a id="facebookButton" className="facebook-share-button shareButtonLink" target="_blank"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.state.shareLink)}&quote=${encodeURIComponent(this.state.shareMsg)}`}>
                  <div id="facebook" className="shareButton"></div>
                </a>
                </div>
                  <p className={`copyLinkButton ${navigator?.clipboard?.writeText ? '' : 'hidden'}`} onClick={() => {copyLink(this.state.shareLink)}} onTouchEnd={() => {copyLink(this.state.shareLink)}}>{this.state.isCopied ? 'Copied!' : 'Copy link' }</p>
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
  try {
    return elem.state.isCorrect;
  }
  catch(er){}
  return false;
}

function copyLink(link){
  navigator.clipboard.writeText(link).then(function() {
    shareElem.setState({"isCopied": true});
    setTimeout(
      () => {shareElem.setState({"isCopied": false});},
      2000
    )
  }, function() {
    /* clipboard write failed */
  });
}

function setShareMsg(){
  if (shareElem.state.shareDefinition){
    shareElem.setState({
      "shareMsg": `Check out the definition for _${elem.state.answer}_`,
      "shareLink": `http://answersmasher.com/?d=${window.digest}`
    });
    return;
  }

  var msg;
  var url;
  /*
    Messages for sending a challenge
  */
  if(location.pathname === "/daily"){
    // Smash of the day
    msg = `See if you can beat me on the *AnswerSmash of the day* `;
    url = "http://answersmasher.com/daily";
  }
  else if (location.pathname !== "/" && isSolved() && !elem.state.isRevealed) {
    // Quiz, and I got it!
    msg = `I guessed today's AnswerSmash. Try it `;
    url = `http://answersmasher.com/quiz?d=${window.digest}` ;
  }
  else {
    // Main page, or quiz but I didn't guess it
    msg = `See how you do on this AnswerSmash `;
    url = `http://answersmasher.com/quiz?d=${window.digest}` ;
  }

  shareElem.setState({
    "shareMsg": msg,
    "shareLink": url
  });
}

setShareMsg();