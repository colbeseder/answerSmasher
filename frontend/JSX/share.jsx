
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
            <link rel="stylesheet" href="/static/styles/switch.css"></link>
            
            <div id="shareSelector">
              <span className="switchOption">Definition</span>
              <span>
              <label className="switch">
                <input id="whatToShare" type="checkbox" checked={ !this.state.shareDefinition } onChange={toggleShareSwitch}/>
                <span className="slider round"></span>
              </label>
              </span>
              <span className="switchOption">Challenge</span>
              <br />
              <span className={this.state.noDefinition ? "" : "invisible"}>You can't share the daily definition. Spoilers.</span>
            </div>
            <div id="shareButtons">
              <div id="twitter" className="shareButton">
                <a id="tweetButton" className="twitter-share-button button" target="_blank"
                  href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent(this.state.shareMsg)}>
                    Share on Twitter</a>
              </div>
              <br />

              <div id="whatsapp" className="shareButton mobileOnly">
                <a id="whatsAppButton" className="button" target="_blank"
                  href={"whatsapp://send?text=" + encodeURIComponent(this.state.shareMsg)} data-action="share/whatsapp/share">
                    Share on Whatsapp</a>
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
  if(location.pathname === "/daily"){
    tryitOutMessage = `See if you can beat me on today's AnswerSmash http://answersmash.com/daily`;
  }
  else if (location.pathname !== "/" && isSolved() && !elem.state.isRevealed) {
    tryitOutMessage = `I guessed today's Answer Smash. Try it http://answersmash.com/quiz?d=${window.digest}` ;
  }
  else {
    tryitOutMessage = `Try out today's Answer Smash  http://answersmash.com/quiz?d=${window.digest}` ;
  }

  var msg = shareElem.state.shareDefinition ? 
    `Check out the definition for _${document.getElementById("answer").innerText}_ \nhttp://answersmasher.com/?d=${window.digest}` :
    tryitOutMessage ;
  shareElem.setState({
    "shareMsg": msg
  });
}

setShareMsg();