import React from 'react';
import * as calcite from 'calcite-web';

import Map from '../Map';
import ControlPanel from '../ControlPanel';
import InfoPanel from '../InfoPanel';

class App extends React.Component {
    
    constructor(props){
        super(props);

        // console.log('init App component >>> props', props);

        this.state = {
            activeStorm: '', // selected storm name
            precipData: [],
            windGustData: [],
            stormData: [] // forecast data for selected storm
        };

        this.mapOnClick = this.mapOnClick.bind(this);
        this.stormSelectorOnChange = this.stormSelectorOnChange.bind(this);
        this.updateStormData = this.updateStormData.bind(this);
        this.updatePrecipData = this.updatePrecipData.bind(this);
        this.updateWindGustData = this.updateWindGustData.bind(this);
    };

    initControllerActionHandlers(){
        // console.log('calling initControllerActionHandlers', this);

        const actionHandlers = {
            precipDataOnReceive: this.updatePrecipData,
            windGustDataOnReceive: this.updateWindGustData,
            hurricaneDataOnReceive: this.updateStormData
        }

        this.props.controller.initActionHandlers(actionHandlers);
    }

    updateStormData(data){
        console.log('calling updateStormData', data);
        this.setState({
            stormData: data
        });
    };

    updatePrecipData(data=[]){
        console.log('calling updatePrecipData', data);
        this.setState({
            precipData: data
        });
    };

    updateWindGustData(data=[]){
        console.log('calling updateWindGustData', data);
        this.setState({
            windGustData: data
        });
    };

    mapOnClick(mapPoint){
        // console.log('mapOnClickHandler', mapPoint);
        this.props.controller.fetchDataForInfoPanel(mapPoint.toJSON());
    }

    stormSelectorOnChange(stormName=''){
        // console.log('stormSelectorOnChange', stormName);
        this.setState({
            activeStorm: stormName
        },()=>{
            this.props.controller.fecthHurricaneForecastDataByName(stormName);
        });
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
                    stormData={this.state.stormData}
                />
                <InfoPanel 
                    precipData={this.state.precipData}
                />
            </div>
        );
    };
};

export default App;