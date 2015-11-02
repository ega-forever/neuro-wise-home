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
                var _this = this;
                this.props.scope.SaveVoiceThing(this.props.name, this.props.newVoice).then(function (state) {
                    if (state) {
                        _this.props.voice.forEach(function (v) {
                            if (v != null && v.action != null) {
                                v.pattern = _.chain(_this.props.newVoice).find({action: v.action}).result('pattern').value();
                            }
                        });
                        _this.setState({edit: false});
                        setTimeout(_this.componentDidMount.bind(_this), 50);
                    }
                });
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
                            t.pattern = evt.target.value;
                        }
                    })
                } else {
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


            componentDidMount: function () {

                var authDom = document.getElementsByClassName('auth')[0];
                componentHandler.upgradeElements(authDom.getElementsByClassName('username'));
                componentHandler.upgradeElements(authDom.getElementsByClassName('password'));

            },


            render: function () {

                return (
                    <section className="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp square-card">
                        <div className="mdl-card mdl-cell mdl-cell--12-col auth">
                            <div className="mdl-card__supporting-text"><h4>Login</h4> with your username and pass</div>
                            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label username">
                                <input className="mdl-textfield__input" type="text" onChange={this.setUserName}/>
                                <label className="mdl-textfield__label" username="username">Username...</label>
                            </div>
                            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label password">
                                <input className="mdl-textfield__input" type="text" onChange={this.setPassword}/>
                                <label className="mdl-textfield__label" htmlFor="password">Password...</label>
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

        function pieChart(percentage) {


            percentage = 100 - percentage;
            size = 1;
            // primary wedge
            var unit = (Math.PI *2) / 100;
            var startangle = 0;
            var endangle = percentage * unit - 0.001;
            var x2 = (size / 2) + (size / 2) * Math.sin(endangle);
            var y2 = (size / 2) - (size / 2) * Math.cos(endangle);
            var big = 0;
            if (endangle - startangle > Math.PI) {
                big = 1;
            }

            return {big: big,x2: x2,y2: y2};
        }


        var Wnet = React.createClass({

            render: function () {
                var attention = this.props.data.attention;
                var drawA = pieChart(attention);
                var meditation = this.props.data.meditation;
                var drawM = pieChart(meditation);

                return (

                        <div className="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid" dangerouslySetInnerHTML={{__html:
                        `
                        <svg fill="currentColor" width="200px" height="200px" viewBox="0 0 1 1" class="demo-chart mdl-cell mdl-cell--4-col mdl-cell--6-col-desktop">
                            <use xlink:href="#piechartM" mask="url(#piemask)" />
                            <text x="0.5" y="0.5" font-family="Roboto" font-size="0.3" fill="#888" text-anchor="middle" dy="0.1">` + attention + `<tspan font-size="0.2" dy="-0.07">%</tspan></text>
                        </svg>
                        <svg fill="currentColor" width="200px" height="200px" viewBox="0 0 1 1" class="demo-chart mdl-cell mdl-cell--4-col mdl-cell--6-col-desktop">
                            <use xlink:href="#piechartA" mask="url(#piemask)" />
                            <text x="0.5" y="0.5" font-family="Roboto" font-size="0.3" fill="#888" text-anchor="middle" dy="0.1">` + meditation+ `<tspan dy="-0.07" font-size="0.2">%</tspan></text>
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" style="position: fixed; left: -1000px; height: -1000px;">
                            <defs>
                              <mask id="piemask" maskContentUnits="objectBoundingBox">
                                <circle cx=0.5 cy=0.5 r=0.49 fill="white" />
                                <circle cx=0.5 cy=0.5 r=0.40 fill="black" />
                              </mask>
                              <g id="piechartM">
                                <circle cx=0.5 cy=0.5 r=0.5 />
                                <path d="M 0.5 0.5 0.5 0 A 0.5 0.5 0 ` + drawA.big +`  1 ` + drawA.x2 + ` ` + drawA.y2 + `z" stroke="none" fill="rgba(255, 255, 255, 0.75)" />
                              </g>

                              <g id="piechartA">
                                <circle cx=0.5 cy=0.5 r=0.5 />
                                <path d="M 0.5 0.5 0.5 0 A 0.5 0.5 0 `  + drawM.big +`  1 ` + drawM.x2 + ` ` + drawM.y2 + `z" stroke="none" fill="rgba(255, 255, 255, 0.75)" />
                              </g>
                            </defs>
                        </svg>
                        `}} ></div>
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
    })

.factory('JsxSettingsFactory', function () {


    var Settings = React.createClass({

        change: function (ev) {
            this.props.scope.change(this.props.name, this.props.pass);
        },

        setUserName(ev){
            this.props.name = ev.target.value;
        },

        setPassword(ev){
            this.props.pass = ev.target.value;
        },


        componentDidMount: function () {

            var authDom = document.getElementsByClassName('newAuth')[0];
            componentHandler.upgradeElements(authDom.getElementsByClassName('username'));
            componentHandler.upgradeElements(authDom.getElementsByClassName('password'));

        },


        render: function () {

            return (
                <section className="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp square-card">
                    <div className="mdl-card mdl-cell mdl-cell--12-col newAuth">
                        <div className="mdl-card__supporting-text"><h4>Change</h4> your username and pass</div>
                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label username">
                            <input className="mdl-textfield__input" type="text" onChange={this.setUserName}/>
                            <label className="mdl-textfield__label" username="username">{this.props.data.name}</label>
                        </div>
                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label password">
                            <input className="mdl-textfield__input" type="text" onChange={this.setPassword}/>
                            <label className="mdl-textfield__label" htmlFor="password">******</label>
                        </div>
                        <div className="mdl-card__actions"><a href="#" className="mdl-button" onClick={this.change}>Change it!</a>
                        </div>
                    </div>
                </section>
            );
        }
    });

    var SettingsRender = function (data, scope) {

        if (scope == null || scope == undefined) {
            return;
        }

        return React.render(
            <Settings data={data} scope={scope}/>,
            document.getElementById('settingsSet')
        )
    };


    return {
        SettingsRender: SettingsRender
    }
})