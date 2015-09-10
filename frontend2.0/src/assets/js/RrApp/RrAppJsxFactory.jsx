angular.module('JsxFactory', [])
    .factory('JsxThingsFactory', function () {

        var Things = React.createClass({
            render: function () {
            var scope = this.props.scope;
                return <div>
                    {this.props.data.map(function (i) {
                        return (<Thing name={i.name} id={i.id} scope = {scope} initialAttached = {false} />);
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

            render: function () {
                var name = this.props.name;
                var id = this.props.id;

                return (
                    <section className="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp mdl-cell mdl-cell--6-col">
                        <div className="mdl-card mdl-cell mdl-cell--12-col">
                            <div className="mdl-card__supporting-text"><h4>{name} # {id}</h4> {name} 1 info...</div>
                            <div className="mdl-card__actions"><a href="#" className="mdl-button" onClick={this.AttachThing}>{this.state.attached ? 'Detach thing' : 'Attach thing'}</a></div>
                        </div>
                        <button id={"btn" + id} className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon">
                            <i className="material-icons">more_vert</i>
                        </button>
                        <ul htmlFor={"btn" + id} className="mdl-menu mdl-js-menu mdl-menu--bottom-right">
                            <li className="mdl-menu__item">Lorem</li>
                            <li disabled="" className="mdl-menu__item">Ipsum</li>
                            <li className="mdl-menu__item">Dolor</li>
                        </ul>
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
    });