import React from 'react';

export default class StormOption extends React.PureComponent {

    constructor(props){
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick(){
        this.props.onClick(this.props.value);
    }

    render(){
        return (
            <span className="side-nav-link" onClick={this.onClick}>{this.props.label}</span>
        )
    }
}