
class HeadZone extends React.Component {
    constructor(props) {
      super(props);
      this.state = {}
    }
  
    render() {
      return (
          <div id="header">
                <span id="siteName">Answer Smasher</span>
          </div>
      )
    }
  }
  
  var footerElem = ReactDOM.render(React.createElement(HeadZone), document.querySelector('#headerContainer'));
  