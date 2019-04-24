import React from 'react';

export default class TwoLineLabel extends React.PureComponent {
    constructor(props){
        super(props);
    }

    render(){
        const value = this.props.value || '';
        const label = this.props.label || '';
        
        return(
            <div style={{color: 'rgba(255,255,255,.8)'}}>
                <h6 className='trailer-0'>{value}</h6>
                <p className='font-size--3 trailer-0'>{label}</p>
            </div>
        )
    }
};