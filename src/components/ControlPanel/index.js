import React from 'react';

import StormInfoWindow from '../StormInfoWindow';
import StormSelector from './StormSelector';


const styles = {
    controlPanelDiv: {
        // position: 'absolute',
        // top: '1rem',
        // right: '1rem',
        width: '100%',
        zIndex: '5'
    },
    addressLocatorDiv: {
        width: '100%',
        border: 'solid 1px #999'
    },
    controlPanelContent: {
        width: '100%'
    }
};

class ControlPanel extends React.PureComponent {
    
    constructor(props){
        super(props);

        this.state = {
            isAboutInfoVisible: false
        };

    };

    getStormSelectorWindow(){

        return this.props.isMobile 
        ? null 
        : (
            <div className='phone-hide'>
                <div className='trailer-half'>
                    <span className='font-size-2'>HURRICANE AWARE</span>
                    <span className='right icon-ui-question cursor-pointer js-modal-toggle' data-modal='about-this-app'></span>
                </div>
                
                <p className='trailer-half font-size--3'>For community awareness within the US about a hurricane in your area, click on the map or search below</p>
                <div id='addressLocatorDiv' className='trailer-half' style={styles.addressLocatorDiv}></div>
                {/* <p className='trailer-half font-size--3'>Look up a specific storm to find out more information here.</p> */}
                
                <StormSelector
                    data={this.props.activeStorms}
                    activeStorm={this.props.activeStorm}
                    onSelect={this.props.stormSelectorOnChange}
                />
            </div>
        );

    }

    getComponentJsx(){

        const stormSelectorWindow = this.getStormSelectorWindow();

        return (
            <div style={styles.controlPanelContent}>

                {stormSelectorWindow}
                
                <StormInfoWindow
                    data={this.props.stormData}
                    onClick={this.props.stormListOnClick}
                    onMouseEnter={this.props.stormListOnMouseEnter}
                    onMouseLeave={this.props.stormListOnMouseLeave}
                    isMobile = {this.props.isMobile}
                />

            </div>
        );

    };

    render(){
        const componentJsx = this.getComponentJsx();

        const alertMessage = (
            <div className='alert-message-no-active-storm trailer-half'>
                 <span className='font-size--3'><a className='link-light-blue' onClick={this.props.openDrawerMenuOnClick}>Select an active storm</a> to view detailed information.</span>
            </div> 
        );

        return (
            <div id='controlPanelDiv' className='trailer-1 phone-trailer-0'>
                {
                    this.props.isMobile && !this.props.stormData.length 
                    ? alertMessage
                    : componentJsx
                }
            </div>
        );
    }
};

export default ControlPanel;