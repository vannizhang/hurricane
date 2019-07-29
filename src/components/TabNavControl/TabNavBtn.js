import React from 'react';

export default class TabNavBtn extends React.PureComponent {
    constructor(props){
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick(){
        if(this.props.onClick){
            this.props.onClick(this.props.value)
        }
    }

    render(){
        const isActive = this.props.isActive ? 'is-active' : '';
        return(
            <div className={`tab-nav-btn text-center ${isActive}`} onClick={this.onClick}>
                <span className='font-size--2'>{this.props.label}</span>
            </div>
        )
    }
}