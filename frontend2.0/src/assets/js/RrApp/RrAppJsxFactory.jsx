angular.module('JsxFactory', [])
    .factory('JsxThingsFactory', function () {

        var Things = React.createClass({
            render: function () {
            var scope = this.props.scope;
                console.log(this.props.data);
                return <div>
                    {this.props.data.map(function (i) {
                        return (<Thing name={i.name} id={i.id} states={i.state} io = {i.socketObj.io} scope = {scope} initialAttached = {false} />);
                    })
                    }</div>
            }
        });

        var Thing = React.createClass({
            getInitialState: function(){
                return {attached: this.props.initialAttached}
            },
            AttachThing: function(evt) {
                this.setState({ attached: !this.state.attached });
                this.props.scope.AttachThing();
            },

            ChangeOption: function(option, evt) {
                console.log(option);
                var newState = !this.props.states[option];
                console.log(this);
                this.props.scope.ChangeOption(this.props, option, newState);
            },

            componentDidMount: function() {
                var id = this.props.id;
                componentHandler.upgradeElements(document.getElementsByClassName('btn-' + id));
                componentHandler.upgradeElement(document.getElementById('btn-' + id));
            },

                render: function () {
                var name = this.props.name;
                var id = this.props.id;
                var states = [];
                    console.log(this.props);
                    for(var i in this.props.states){
                        states.push(<li className="mdl-menu__item" onClick={this.ChangeOption.bind(this, i)}>
                            <span data-badge="" className={"mdl-badge " + (this.props.states[i] ? 'green' : 'red')}>{i.replace("State", "")}</span>
                        </li>);
                    }
                return (
                    <section className="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp mdl-cell mdl-cell--6-col">
                        <div className="mdl-card mdl-cell mdl-cell--12-col">
                            <div className="mdl-card__supporting-text"><h4>{name} # {id}</h4> {name} 1 info...</div>

                            <div className="mdl-card__actions"><a href="#" className="mdl-button" onClick={this.AttachThing}>{this.state.attached ? 'Detach thing' : 'Attach thing'}</a></div>

                        <button id={"btn-" + id} className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon">
                            <i className="material-icons">more_vert</i>
                        </button>
                        <ul htmlFor={"btn-" + id} className={"mdl-menu mdl-js-menu mdl-menu--bottom-right " + 'btn-' + id} >
                            {states}
                        </ul>
                        </div>
                    </section>
                );
            }
        });

        var thingsRender = function(data, scope) {

            if(scope == null || scope == undefined){
                return;
            }

             return React.render(
                <Things data = {data} scope = {scope} />,
                document.getElementById('thingsSet')
            )};

        return {
            thingsRender: thingsRender
        }
    })

    .factory('JsxAuthFactory', function () {

        var Logout = React.createClass({

            logout: function(ev) {
                this.props.scope.logout();
            },


            render: function () {

                var name = this.props.data.username;
                return (
                    <section className="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp width-fourth">
                        <div className="mdl-card mdl-cell mdl-cell--12-col">
                            <div className="mdl-card__supporting-text"><h4>Welcome, </h4> {name}</div>
                            <div className="mdl-card__actions"><a href="#" className="mdl-button" onClick={this.logout}>Logout</a></div>
                        </div>
                    </section>
                );
            }
        });

        var Login = React.createClass({

            login: function(ev) {
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
                                    <input className="mdl-textfield__input" type="text" onChange={this.setUserName} />
                                    <label className="mdl-textfield__label" htmlFor="sample3">Username...</label>
                                </div>
                            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                <input className="mdl-textfield__input" type="text" onChange={this.setPassword} />
                                <label className="mdl-textfield__label" htmlFor="sample3">Password...</label>
                            </div>
                            <div className="mdl-card__actions"><a href="#" className="mdl-button" onClick={this.login}>Login</a></div>
                        </div>
                    </section>
                );
            }
        });

        var LoginRender = function(data, scope) {

            if(scope == null || scope == undefined){
                return;
            }

            return React.render(
                <Login data = {data} scope = {scope} />,
                document.getElementById('loginMe')
            )};


        var LogoutRender = function(data, scope) {

            if(scope == null || scope == undefined){
                return;
            }

            return React.render(
                <Logout data = {data} scope = {scope} />,
                document.getElementById('loginMe')
            )};

        return {
            LoginRender: LoginRender,
            LogoutRender: LogoutRender
        }
    });