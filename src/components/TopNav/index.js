import './style.scss';

import React from 'react';

export default class TopNav extends React.PureComponent {
    constructor(props){
        super(props);
    }

    render(){

        const appTitleText = this.props.activeStorm ? `HURRICANE AWARE (${this.props.activeStorm})` : 'HURRICANE AWARE';

        return (
            <div className='top-nav-for-phone-view'>
                <div className='app-title'>
                    <span className='text-white font-size-0 avenir-light'> {appTitleText} </span>
                </div>
                <div className='top-nav-btn' onClick={this.props.menuBtnOnClick}>
                    <span className='text-white icon-ui-menu'></span>
                </div>
            </div>
        )
    }
}