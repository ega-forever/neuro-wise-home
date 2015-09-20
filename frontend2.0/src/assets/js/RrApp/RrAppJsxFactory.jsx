angular.module('JsxFactory', [])
    .factory('JsxThingsFactory', function () {

        var Things = React.createClass({
            render: function () {
                var scope = this.props.scope;
                console.log(this.props.data);
                return <div>
                    {this.props.data.map(function (i) {
                        return (<Thing name={i.name} id={i.id} states={i.state} io={i.socketObj.io} scope={scope}
                                       initialAttached={false} voice={i.voice}/>);
                    })
                    }</div>
            }
        });

        var Thing = React.createClass({
            getInitialState: function () {
                return {attached: this.props.initialAttached, edit: false}
            },

            AttachThing: function (evt) {
                this.setState({attached: !this.state.attached});
                this.props.scope.AttachThing();
            },

            EditThing: function (evt) {
                this.setState({edit: true});
                setTimeout(this.componentDidMount.bind(this), 50);
            },

            SaveVoiceThing: function (evt) {
                this.setState({edit: false});
                setTimeout(this.componentDidMount.bind(this), 50);
                this.props.scope.SaveVoiceThing();//todo implement save in controller
            },

            ChangeOption: function (option, evt) {
                var newState = !this.props.states[option];
                this.props.scope.ChangeOption(this.props, option, newState);
            },

            changeAction: function (action, evt) {

                if (this.props.newVoice == null) {
                    this.props.newVoice = [{action: action, pattern: evt.target.value}];
                } else if (_.chain(this.props.newVoice).find({action: action}).result('pattern').value() != null) {
                    this.props.newVoice.forEach(function (t) {
                        if (t.action == action) {
                           t.pattern =  evt.target.value;
                        }
                    })
                }else{
                    this.props.newVoice.push({action: action, pattern: evt.target.value});
                }
            },

            componentDidMount: function () {
                console.log(this.props);
                if (!this.state.edit) {
                    var id = this.props.id;
                    componentHandler.upgradeElements(document.getElementsByClassName('btn-' + id));
                    componentHandler.upgradeElement(document.getElementById('btn-' + id));
                    componentHandler.upgradeElements(document.getElementsByClassName('btn-' + id + '-left'));
                }

                if (this.state.edit) {
                    var name = this.props.name;
                    componentHandler.upgradeElements(document.getElementsByClassName("edit-input-" + name));
                }
            },

            render: function () {
                var name = this.props.name;
                var id = this.props.id;
                var states = [];
                if (!this.state.edit) {
                    for (var i in this.props.states) {
                        states.push(<li className="mdl-menu__item" onClick={this.ChangeOption.bind(this, i)}>
                        <span data-badge=""
                              className={"mdl-badge " + (this.props.states[i] ? 'green' : 'red')}>{i.replace("State", "")}</span>
                        </li>);
                    }
                } else if (this.state.edit) {

                    for (var i in this.props.states) {
                        states.push(<tr>
                            <td className="initial-height">
                                <div
                                    className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label" + " edit-input-" + name}>
                                    <input className="mdl-textfield__input" type="text"
                                           onChange={this.changeAction.bind(this, i.replace("State", "")) }/>
                                    <label className="mdl-textfield__label"
                                           htmlFor="sample3">{i.replace("State", "")}: {_.chain(this.props.voice).find('action', i.replace("State", "")).result('pattern').value()}</label>
                                </div>
                            </td>
                        </tr>);
                    }
                }

                var static = (
                    <section
                        className="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp mdl-cell mdl-cell--6-col">
                        <div className="mdl-card mdl-cell mdl-cell--12-col">


                            <div className="mdl-card__supporting-text"><h4>{name} # {id}</h4> {name} 1 info...</div>

                            <div className="mdl-card__actions"><a href="#" className="mdl-button"
                                                                  onClick={this.AttachThing}>{this.state.attached ? 'Detach thing' : 'Attach thing'}</a>
                            </div>

                            <button id={"btn-" + id + '-left'}
                                    className="mdl-button mdl-js-button mdl-button--icon left">
                                <i className="material-icons">more_vert</i>
                            </button>

                            <ul className={"mdl-menu mdl-js-menu mdl-menu--bottom-left " + 'btn-' + id + '-left'}
                                htmlFor={"btn-" + id + '-left'}>
                                <li className="mdl-menu__item" onClick={this.EditThing}>edit</li>
                            </ul>


                            <button id={"btn-" + id}
                                    className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon">
                                <i className="material-icons">more_vert</i>
                            </button>
                            <ul htmlFor={"btn-" + id}
                                className={"mdl-menu mdl-js-menu mdl-menu--bottom-right " + 'btn-' + id}>
                                {states}
                            </ul>


                        </div>
                    </section>
                );


                var edit = (
                    <section
                        className="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp mdl-cell mdl-cell--6-col">
                        <div className="mdl-card mdl-cell mdl-cell--12-col">

                            <div className="mdl-card__supporting-text"><h4>{name} # {id}</h4> {name} 1 info...</div>

                            <table
                                className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">
                                <tbody>
                                {states}
                                </tbody>
                            </table>


                            <div className="mdl-card__actions"><a href="#" className="mdl-button"
                                                                  onClick={this.SaveVoiceThing}>Save thing</a>
                            </div>


                        </div>
                    </section>
                );

                return this.state.edit ? edit : static;
            }
        });

        var thingsRender = function (data, scope) {

            if (scope == null || scope == undefined) {
                return;
            }

            return React.render(
                <Things data={data} scope={scope}/>,
                document.getElementById('thingsSet')
            )
        };

        return {
            thingsRender: thingsRender
        }
    })

    .factory('JsxAuthFactory', function () {

        var Logout = React.createClass({

            logout: function (ev) {
                this.props.scope.logout();
            },


            render: function () {

                var name = this.props.data.username;
                return (
                    <section className="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp width-fourth">
                        <div className="mdl-card mdl-cell mdl-cell--12-col">
                            <div className="mdl-card__supporting-text"><h4>Welcome, </h4> {name}</div>
                            <div className="mdl-card__actions"><a href="#" className="mdl-button" onClick={this.logout}>Logout</a>
                            </div>
                        </div>
                    </section>
                );
            }
        });

        var Login = React.createClass({

            login: function (ev) {
                this.props.scope.login(this.props.name, this.props.pass);
            },

            setUserName(ev){
                this.props.name = ev.target.value;
            },

            setPassword(ev){
                this.props.pass = ev.target.value;
            },

            render: function () {
                //var name = this.props.name;
                //var pass = this.props.id;

                return (
                    <section className="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp square-card">
                        <div className="mdl-card mdl-cell mdl-cell--12-col">
                            <div className="mdl-card__supporting-text"><h4>Login</h4> with your username and pass</div>
                            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                <input className="mdl-textfield__input" type="text" onChange={this.setUserName}/>
                                <label className="mdl-textfield__label" htmlFor="sample3">Username...</label>
                            </div>
                            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                <input className="mdl-textfield__input" type="text" onChange={this.setPassword}/>
                                <label className="mdl-textfield__label" htmlFor="sample3">Password...</label>
                            </div>
                            <div className="mdl-card__actions"><a href="#" className="mdl-button" onClick={this.login}>Login</a>
                            </div>
                        </div>
                    </section>
                );
            }
        });

        var LoginRender = function (data, scope) {

            if (scope == null || scope == undefined) {
                return;
            }

            return React.render(
                <Login data={data} scope={scope}/>,
                document.getElementById('loginMe')
            )
        };


        var LogoutRender = function (data, scope) {

            if (scope == null || scope == undefined) {
                return;
            }

            return React.render(
                <Logout data={data} scope={scope}/>,
                document.getElementById('loginMe')
            )
        };

        return {
            LoginRender: LoginRender,
            LogoutRender: LogoutRender
        }
    })

    .factory('JsxWnetFactory', function () {

        var Wnet = React.createClass({

            render: function () {
                var attention = this.props.data.attention;
                var meditation = this.props.data.meditation;
                return (
                    <section className="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp">
                        <header
                            className="section__play-btn mdl-cell mdl-cell--3-col-desktop mdl-cell--2-col-tablet mdl-cell--4-col-phone mdl-color--teal-100 mdl-color-text--white">
                            <i className="material-icons">play_circle_filled</i>
                        </header>
                        <div
                            className="mdl-card mdl-cell mdl-cell--9-col-desktop mdl-cell--6-col-tablet mdl-cell--4-col-phone">
                            <div className="mdl-card__supporting-text">
                                <h4>Status</h4>
                            </div>
                            <div
                                className="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid">
                                <div style={{"width":"100%"}} className="attention">
                                    <p>meditation:&nbsp
                                        <strong>{attention}%</strong>
                                    </p>
                                </div>
                                <div style={{"width":"100%"}} className="meditation">
                                    <p>attention:&nbsp
                                        <strong>{meditation}%</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                );
            }
        });

        var WNetRender = function (data, scope) {

            if (scope == null || scope == undefined) {
                return;
            }

            return React.render(
                <Wnet data={data} scope={scope}/>,
                document.getElementById('wNetSet')
            )
        };


        return {
            WNetRender: WNetRender
        }
    });