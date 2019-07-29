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
                    <span className='font-size-1 avenir-light'> {appTitleText} </span>
                </div>
                <div className='top-nav-btn' onClick={this.props.menuBtnOnClick}>
                    {/* <span className='icon-ui-menu'></span> */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24" width="24"><path d="M21 6H3V5h18zm0 6H3v1h18zm0 7H3v1h18z"/></svg>
                </div>
            </div>
        )
    }
}