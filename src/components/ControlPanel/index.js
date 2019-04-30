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

class ControlPanel extends React.Component {
    
    constructor(props){
        super(props);

        this.state = {
            isAboutInfoVisible: false
        };

    };

    getComponentJsx(){

        return (
            <div style={styles.controlPanelContent}>
                <div className='trailer-half'>
                    <span className='font-size-2'>HURRICANE AWARE</span>
                    <span className='right icon-ui-question cursor-pointer'></span>
                </div>
                
                <p className='trailer-half'>For community awareness within the US about a hurricane in your area, click on the map or search bwlow</p>
                <div id='addressLocatorDiv' className='trailer-half' style={styles.addressLocatorDiv}></div>
                <p className='trailer-half'>Look up a specific storm to find out more information here.</p>
                
                <StormSelector
                    data={this.props.activeStorms}
                    onSelect={this.props.stormSelectorOnChange}
                />

                <StormInfoWindow
                    data={this.props.stormData}
                />

            </div>
        );

    };

    render(){
        const componentJsx = this.getComponentJsx();
        return (
            <div id='controlPanelDiv' className='trailer-1'>
                {componentJsx}
            </div>
        );
    }
};

export default ControlPanel;