import React from 'react';
import * as calcite from 'calcite-web';

import Map from '../Map';
import ControlPanel from '../ControlPanel';
import InfoPanel from '../InfoPanel';

class App extends React.Component {
    
    constructor(props){
        super(props);

        console.log('init App component >>> props', props);

        this.state = {
            activeStorm: '',
            precipData: [],
            windGustData: []
        };

        this.mapOnClick = this.mapOnClick.bind(this);
        this.stormSelectorOnChange = this.stormSelectorOnChange.bind(this);
    };

    initControllerActionHandlers(){
        console.log('calling initControllerActionHandlers', this);

        const actionHandlers = {
            precipDataOnReceive: (data)=>{
                
            },
            windGustDataOnReceive: (data)=>{

            },
            hurricaneDataOnReceive: (data)=>{
                console.log('hurricaneDataReceived', data);
            }
        }

        this.props.controller.initActionHandlers(actionHandlers);
    }

    mapOnClick(mapPoint){
        // console.log('mapOnClickHandler', mapPoint);
        this.props.controller.fetchDataForInfoPanel(mapPoint.toJSON());
    }

    stormSelectorOnChange(stormName=''){
        // console.log('stormSelectorOnChange', stormName);
        this.props.controller.fecthHurricaneForecastDataByName(stormName);
    }

    componentDidMount(){
        // console.log('app is mounted');
        this.initControllerActionHandlers();

        calcite.init();
    }

    render(){
        return (
            <div id='appContentDiv'>
                <Map 
                    onClick={this.mapOnClick}
                />
                <ControlPanel 
                    stormSelectorOnChange={this.stormSelectorOnChange}

                    activeStorms={this.props.activeStorms}
                    
                />
                {/* <InfoPanel /> */}
            </div>
        );
    };
};

export default App;