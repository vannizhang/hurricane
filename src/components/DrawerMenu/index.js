import './style.scss';

import React from 'react';

import StormOption from './StormOption';

export default class DrawerMenu extends React.PureComponent {

    constructor(props){
        super(props);
    }

    render(){

        console.log(this.props.activeStorms)

        const stormOptions = this.props.activeStorms.map((d,i)=>{
            return <StormOption 
                key={`drawer-menu-storm-option-${i}`}
                label={d.label}
                value={d.value}
                onClick={this.props.stormOnChange}
            />
        });

        return (
            <div className="drawer drawer-right drawer-hurricane-theme js-drawer" data-drawer="drawer-menu">
                <nav className="drawer-nav" role="navigation">
                    <aside className="side-nav">
                        <div id='addressLocatorMobileDiv' style={{width: '100%'}}></div>
                    </aside>
                    <aside className="side-nav">
                        <h2 className="side-nav-title">Active Storms</h2>
                        {stormOptions}
                    </aside>
                    <aside className="side-nav">
                        <h2 className="side-nav-title">
                            <span onClick={this.props.openAboutModal}>
                                About this app
                            </span>
                        </h2>
                    </aside>
                </nav>
          </div>
        )
    }
}