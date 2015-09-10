var data = [{name: 'super', id: 123}, {name: 'super2', id : 54}];

var Things = React.createClass({


    render: function () {

        return <div>
            {data.map(function (i) {
                return (<Thing name={i.name} id={i.id}/>);
            })
            }</div>
    }
});

var Thing = React.createClass({
    render: function () {
        var name = this.props.name;
        var id = this.props.id;
        return (
            <section className="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp mdl-cell mdl-cell--6-col">
                <div className="mdl-card mdl-cell mdl-cell--12-col">
                    <div className="mdl-card__supporting-text"><h4>{name} # {id}</h4> {name} 1 info...</div>
                    <div className="mdl-card__actions"><a href="#" className="mdl-button">Read our features</a></div>
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