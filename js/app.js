var contact_list = [
  {
    nick: 'Саша Печкин',
    about: 'В четчерг, четвертого числа',
    status: 'Online',
    onlineDate: '',
    self: false
  },
  {
    nick: 'Просто Вася',
    about: 'Считаю, что $ должен стоить 35 рублей!',
    status: 'Online',
    onlineDate: '',
    self: false
  },
  {
    nick: 'Маша',
    about: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
    status: 'Offline',
    onlineDate: '24.06.2016 15:00',
    self: false
  },
  {
    nick: 'Саша Печкин',
    about: 'В четчерг, четвертого числа',
    status: 'Online',
    onlineDate: '',
    self: false
  },
  {
    nick: 'Просто Вася',
    about: 'Считаю, что $ должен стоить 35 рублей!',
    status: 'Online',
    onlineDate: '',
    self: false
  },
  {
    nick: 'Катя',
    about: '',
    status: 'Offline',
    onlineDate: '24.06.2016 15:00',
    self: false
  },
  {
    nick: 'Катя',
    about: '',
    status: 'Offline',
    onlineDate: '24.06.2016 15:00',
    self: false
  }];

var message_list = [
  {
    nick: 'Саша Печкин',
    mstext: 'Всем привет!',
    self: false
  },
  {
    nick: 'Просто Вася',
    mstext: 'привет!',
    self: false
  },
  {
    nick: 'Маша',
    mstext: 'Redux is a predictable state container for JavaScript apps.',
    self: false
  },
  {
    nick: 'Саша Печкин',
    mstext: 'Всем привет!',
    self: false
  },
  {
    nick: 'Просто Вася',
    mstext: 'привет!',
    self: false
  },
  {
    nick: 'Маша',
    mstext: 'Redux is a predictable state container for JavaScript apps.',
    self: false
  },
  {
    nick: 'Саша Печкин',
    mstext: 'Всем привет!',
    self: false
  },
  {
    nick: 'Просто Вася',
    mstext: 'привет!',
    self: false
  }
];

window.ee = new EventEmitter();

var ListItem = React.createClass({
  propTypes: {
    data: React.PropTypes.shape({
      nick: React.PropTypes.string.isRequired,
      about: React.PropTypes.string.isRequired,
      status: React.PropTypes.string.isRequired,
      self: React.PropTypes.bool.isRequired
    })
  },
  getInitialState: function() {
    return {
      extStatusVisible: false,
      extAboutVisible: false
    };
  },
  readmoreClick: function(fieldName,e) {
    e.preventDefault();
    if ((this.props.data.status=='Offline' && fieldName=='extStatusVisible') || fieldName=='extAboutVisible') {
      this.setState({[''+fieldName]: fieldName=='extAboutVisible' ? !this.state.extAboutVisible : true});
    }
  },
  render: function() {
    var nick = this.props.data.nick,
        shortAbout = this.props.data.about.length>28 ? this.props.data.about.substr(0,28)+'...' : this.props.data.about.substr(0,28),
        extAbout = this.props.data.about,
        status = this.props.data.status,
        self = this.props.data.self,
        onlineDate = this.props.data.onlineDate,
        extStatusVisible = this.state.extStatusVisible,
        extAboutVisible = this.state.extAboutVisible,
        about = extAboutVisible ? extAbout : shortAbout;

    return (
      <div className='contact'>
        <p className={self ? 'contact__nick_self' : 'contact__nick'}>{nick}
          <label> </label>
          <a href="#"
            onClick={this.readmoreClick.bind(this, 'extStatusVisible')}
            className={'contact__status ' + (extStatusVisible ? 'none': '')}>
            {status}
          </a>
          <i className={'contact__status_ext ' + (extStatusVisible ? '': 'none')}>Был онлайн {onlineDate}</i>
        </p>
        <i onClick={this.readmoreClick.bind(this, 'extAboutVisible')} className='contact__about'>О себе: {about}</i>
      </div>
    )
  }
});

var ContactList = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired
  },
  getInitialState: function() {
    return {
      counter: 0
    }
  },
  render: function() {
    var data = this.props.data;
    var contactsTemplate;

    if (data.length > 0) {
      contactsTemplate = data.map(function(item, index) {
        return (
          <div key={index}>
            <ListItem data={item} />
          </div>
        )
      })
    } else {
      contactsTemplate = <p>К сожалению, участников нет</p>
    }

    return (
      <div className='add'>
        <div className='contact__list'>
          {contactsTemplate}
        </div>
        <strong
          className={'contact__count ' + (data.length > 0 ? '':'none') }>Участников: {data.length}</strong>
      </div>
    );
  }
});

var Register = React.createClass({
  getInitialState: function() {
    return {
      agreeNotChecked: true,
      authorIsEmpty: true,
      textIsEmpty: true,
      registered: false
    };
  },
  componentDidMount: function() {
    ReactDOM.findDOMNode(this.refs.nick).focus();
  },
  onBtnClickHandler: function(e) {
    e.preventDefault();
    var textEl = ReactDOM.findDOMNode(this.refs.about);

    var nick = ReactDOM.findDOMNode(this.refs.nick).value;
    var about = textEl.value;

    var item = [{
      nick: nick,
      about: about,
      status: 'Online',
      self:true
    }];

    window.ee.emit('ContactList.add', item);

    textEl.value = '';
    this.setState({textIsEmpty: true, registered: true});
  },
  onCheckRuleClick: function(e) {
    this.setState({agreeNotChecked: !this.state.agreeNotChecked});
  },
  onFieldChange: function(fieldName, e) {
    if (e.target.value.trim().length > 0) {
      this.setState({[''+fieldName]:false})
    } else {
      this.setState({[''+fieldName]:true})
    }
  },
  render: function() {
    var agreeNotChecked = this.state.agreeNotChecked,
        authorIsEmpty = this.state.authorIsEmpty,
        textIsEmpty = this.state.textIsEmpty,
        registered = this.state.registered;
    return (
      <form className={'add cf' + (registered ? ' none': '')}>
        <input
          type='text'
          className='add__author'
          onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
          placeholder='Ваше имя'
          ref='nick'
        />
        <textarea
          className='add__text'
          onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
          placeholder='О себе'
          ref='about'
        ></textarea>
        <label className='add__checkrule'>
          <input type='checkbox' ref='checkrule' onChange={this.onCheckRuleClick}/>Я согласен с правилами
        </label>

        <button
          className='add__btn upper'
          onClick={this.onBtnClickHandler}
          ref='alert_button'
          disabled={agreeNotChecked || authorIsEmpty || textIsEmpty}
          >
          Зарегистрироваться
        </button>
      </form>
    );
  }
});

var Message = React.createClass({
  propTypes: {
    data: React.PropTypes.shape({
      nick: React.PropTypes.string.isRequired,
      mstext: React.PropTypes.string.isRequired,
      self: React.PropTypes.bool.isRequired
    }),
    currnick: React.PropTypes.string
  },
  render: function() {
    var nick = this.props.data.nick,
        text = this.props.data.mstext,
        self = this.props.data.nick == this.props.currnick;
    return (
      <div className='message'>
        <p className={self ? 'contact__nick_self' : 'contact__nick'}>{nick}</p>
        <label className='message__text'>{text}</label>
      </div>
    )
  }
});

var MessageList = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired,
    currnick: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      counter: 0
    }
  },
  componentDidUpdate: function() {
    var mdiv = ReactDOM.findDOMNode(this.refs.msglist);debugger
    mdiv.scrollTop = mdiv.scrollHeight;
  },
  render: function() {
    var data = this.props.data;
    var messageTemplate;
    var curmem = this.props.currnick;

    if (data.length > 0) {
      messageTemplate = data.map(function(item, index) {
        return (
          <div key={index}>
            <Message data={item} currnick={curmem} />
          </div>
        )
      })
    } else {
      messageTemplate = <p>К сожалению, сообщений нет</p>
    }

    return (
      <div ref='msglist' className='message__list'>
        {messageTemplate}
      </div>
    );
  }
});

var AddMessage = React.createClass({
  propTypes: {
    currnick: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      textIsEmpty: true
    };
  },
  componentDidMount: function() {
    ReactDOM.findDOMNode(this.refs.mstext).focus();
  },
  onBtnClickHandler: function(e) {
    e.preventDefault();
    var textEl = ReactDOM.findDOMNode(this.refs.mstext);
    var text = textEl.value;

    if (this.props.currnick!='') {
      var item = [{
        nick: this.props.currnick,
        mstext: text,
        self: true
      }];

      window.ee.emit('MessageList.add', item);

      textEl.value = '';
      this.setState({textIsEmpty: true});
    } else {
      alert('Для отправки сообщений нужно зарегистрироваться!');
    }
  },
  onFieldChange: function(fieldName, e) {
    if (e.target.value.trim().length > 0) {
      this.setState({[''+fieldName]:false})
    } else {
      this.setState({[''+fieldName]:true})
    }
  },
  render: function() {
    var textIsEmpty = this.state.textIsEmpty;
    var userRegistered = this.props.currnick!='';
    return (
      <form className='add_message__form'>
        <div className='flexible_div'>
            <textarea
              className='add_message__text'
              onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
              placeholder='Сообщение'
              ref='mstext'
            ></textarea>

        <button
          className='add_message__btn'
          onClick={this.onBtnClickHandler}
          ref='msg_button'
          disabled={textIsEmpty || !userRegistered}
          >
          Отправить
        </button>
        </div>
      </form>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      contactlist: contact_list,
      currnick: '',
      messagelist: message_list
    };
  },
  componentDidMount: function() {
    var self = this;
    window.ee.addListener('ContactList.add', function(item) {
      var newList = item.concat(self.state.contactlist);
      self.setState({contactlist: newList, currnick: item[0].nick});
    });
    window.ee.addListener('MessageList.add', function(item) {
      var nextMessage = self.state.messagelist.concat(item);
      self.setState({messagelist: nextMessage});
    });
  },
  componentWillUnmount: function() {
    window.ee.removeListener('ContactList.add');
    window.ee.removeListener('MessageList.add');
  },
  render: function() {
    //console.log('render');
    return (
      <div>
        <table>
          <tbody className='top'>
            <tr>
              <td>
                <h3>Участники</h3>
                <ContactList data={this.state.contactlist} />
                <Register />
              </td>
              <td className='table__chat_row'>
                <h3>Чат</h3>
                <MessageList data={this.state.messagelist} currnick={this.state.currnick}/>
                <AddMessage currnick={this.state.currnick} />
              </td>
              <td>
                <div className='weather'>
                {/*<a href="https://clck.yandex.ru/redir/dtype=stred/pid=7/cid=1228/*https://pogoda.yandex.ru/213" target="_blank"><img className='witem' src="//info.weather.yandex.net/213/2_white.ru.png?domain=ru" border="0" alt="Яндекс.Погода"/><img width="1" height="1" src="https://clck.yandex.ru/click/dtype=stred/pid=7/cid=1227/*https://img.yandex.ru/i/pix.gif" alt="" border="0"/></a>              
                  <a href="https://clck.yandex.ru/redir/dtype=stred/pid=7/cid=1228/*https://pogoda.yandex.ru/2" target="_blank"><img className='witem' src="//info.weather.yandex.net/2/2_white.ru.png?domain=ru" border="0" alt="Яндекс.Погода"/><img width="1" height="1" src="https://clck.yandex.ru/click/dtype=stred/pid=7/cid=1227/*https://img.yandex.ru/i/pix.gif" alt="" border="0"/></a>
                  <a href="https://clck.yandex.ru/redir/dtype=stred/pid=7/cid=1228/*https://pogoda.yandex.ru/51" target="_blank"><img className='witem' src="//info.weather.yandex.net/51/2_white.ru.png?domain=ru" border="0" alt="Яндекс.Погода"/><img width="1" height="1" src="https://clck.yandex.ru/click/dtype=stred/pid=7/cid=1227/*https://img.yandex.ru/i/pix.gif" alt="" border="0"/></a>*/}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
