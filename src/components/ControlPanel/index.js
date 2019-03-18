import React from 'react';

import StormSelector from './StormSelector';

const styles = {
    controlPanelDiv: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        zIndex: '5'
    },
    addressLocatorDiv: {
        width: '100%',
        border: 'solid 1px #999'
    },
    controlPanelContent: {
        width: '300px'
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

        return (<div style={styles.controlPanelContent}>
            <h4>HURRICANE AWARE</h4>
            <p className='trailer-half'>For community awareness within the US about a hurricane in your area, click on the map or search bwlow</p>
            <div id='addressLocatorDiv' className='trailer-half' style={styles.addressLocatorDiv}></div>
            <p className='trailer-half'>Look up a specific storm to find out more information here.</p>
            
            <StormSelector 
                data={this.props.activeStorms}
                onSelect={this.props.stormSelectorOnChange}
            />

        </div>);

    };

    render(){
        const componentJsx = this.getComponentJsx();
        return (
            <div id='controlPanelDiv' style={styles.controlPanelDiv}>
                <div className='panel'>{componentJsx}</div>
            </div>
        );
    }
};

export default ControlPanel;