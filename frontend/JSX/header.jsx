
class HeadZone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false
    }
  }

  render() {
    return (
  <header id="header">
    <div className="title">
      <span className="title-icon">🧠</span>
      AnswerSmasher
    </div>
    <div className="icons">
      <span title="How to Play" onClick={_=>toggleHelp()}><img className="navButton notMobile" src="/static/icons/help.svg" /></span>
      <span title="Menu"  onClick={toggleMenu}><img className="navButton" src="/static/icons/menu.svg" /></span>
      <span title="Share" onClick={toggleShare}><img className="navButton" src="/static/icons/share.svg" /></span>
    </div>
        <div id="iconBoxLeft">
          <div id="menuWrapper" className={`${this.state.showMenu ? "" : "slideOff"}`}>
          <br />
            <ul>
              <li className="mobileOnly" onClick={function(){toggleHelp();hideMenu()}}>
                <span>
                  <img className="navButton" src="/static/icons/help-blue.svg" />
                  How to Play
                </span>
              </li>
              <li>
                <a href="/">
                  <img className="navButton flipped" src="/static/icons/tennis-blue.svg" />
                  Smashes
                </a>
              </li>
              <li>
                <a href="/quiz">
                  <img className="navButton flipped" src="/static/icons/brain-user-blue.svg" />
                  Quiz
                </a>
              </li>
              <li>
                <a href="/daily">
                  <img className="navButton" src="/static/icons/badge.svg" />
                    Smash of the Day
                </a>
              </li>
            </ul>
          </div>
        </div>
      </header>

    )
  }
}
  
var headerElem = ReactDOM.render(React.createElement(HeadZone), document.querySelector('#headerContainer'));

function toggleMenu(){
  headerElem.setState(prevState => ({
    showMenu: !prevState.showMenu
  }), updateMenu);
}

function hideMenu(){
  headerElem.setState(prevState => ({
    showMenu: false
  }), updateMenu);
}

function updateMenu() {
  document.getElementById('menuWrapper').style.right = headerElem.state.showMenu ? '0px' : '-300px';
}
