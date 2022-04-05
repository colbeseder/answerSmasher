
class HeadZone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false
    }
  }

  render() {
    return (
      <div id="header">
        <div id="iconBox">
          <img className="navButton" src="/static/icons/menu.svg" onClick={toggleMenu} />
          <img className="navButton" src="/static/icons/help.svg" onClick={toggleHelp}  className="hidden" />
          <img className="navButton" src="/static/icons/share.svg" onClick={toggleShare}  className="hidden" />
          <div id="menuWrapper" className={`${this.state.showMenu ? "" : "slideOff"}`}>
          <img id="closeMenu" className="navButton" src="/static/icons/close.svg" onClick={hideMenu} />
          <br />
            <ul>
              <li>
                <a href="/">
                  <img className="navButton" src="/static/icons/tennis-blue.svg" />
                  Smashes
                </a>
              </li>
              <li>
                <a href="/quiz">
                  <img className="navButton" src="/static/icons/brain-user-blue.svg" />
                  Quiz
                </a>
              </li>
              <li>
                <a href="/daily">
                  <img className="navButton" src="/static/icons/badge.svg" />
                    Daily Smash
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div id="siteName">
          <a href="/">
            <span >Answer Smasher</span>
          </a>
        </div>
        <script src="app.jsx" type="text/jsx"></script>
      </div>
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
  document.getElementById('menuWrapper').style.left = headerElem.state.showMenu ? '0px' : '-200px';
}
