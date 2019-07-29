import './style.scss';
import React from 'react';

import TabNavBtn from './TabNavBtn';

export default class TabNavControl extends React.PureComponent {
    constructor(props){
        super(props);

        this.state = {
            activeItemIndex: 0
        };

        this.onClickHandeler = this.onClickHandeler.bind(this);
    }

    onClickHandeler(val){
        this.props.onClick(val);
        this.setActiveItemIndex(val);
    }

    setActiveItemIndex(val){
        let newIdx = 0
        for(let i = 0, len = this.props.data.length; i < len ; i++){
            if(this.props.data[i].value === val){
                newIdx = i;
            }
        }

        this.setState({
            activeItemIndex: newIdx
        });
    }

    render(){

        const navBtns = this.props.data.map((d,i)=>{
            return <TabNavBtn 
                key={`tab-nav-btn-${i}`}
                label={d.label}
                value={d.value}
                onClick={this.onClickHandeler}
                isActive={ d.value===this.props.visiblePanel ? true : false }
            />;
        });

        return(
            <div className='tab-nav-control'>
                {navBtns}
            </div>
        )
    }
}