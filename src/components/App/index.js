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
            stormData: [], // forecast data for selected storm,

            precipData: [],
            windGustData: [],
            populationData: [],
            languageData: [],
            vehicleData: null,
            disabilityData: null,
            internetData: null
        };

        this.mapOnClick = this.mapOnClick.bind(this);
        this.stormSelectorOnChange = this.stormSelectorOnChange.bind(this);
        this.updateStormData = this.updateStormData.bind(this);
        this.updatePrecipData = this.updatePrecipData.bind(this);
        this.updateWindGustData = this.updateWindGustData.bind(this);
    };

    updateStormData(data){
        // console.log('calling updateStormData', data);
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
        // console.log('calling updateWindGustData', data);
        this.setState({
            windGustData: data
        });
    };

    updatePopulationData(data=[]){
        // console.log('calling populationData', data);
        this.setState({
            populationData: data
        });
    };

    updateLanguageData(data=[]){
        // console.log('calling languageData', data);
        this.setState({
            languageData: data
        });
    };

    updateVehicleData(data=null){
        // console.log('calling languageData', data);
        this.setState({
            vehicleData: data
        });
    };

    updateDisabilityData(data=null){
        // console.log('calling languageData', data);
        this.setState({
            disabilityData: data
        });
    };

    updateInternetData(data=null){
        // console.log('calling languageData', data);
        this.setState({
            internetData: data
        });
    };

    async mapOnClick(mapPoint){
        // console.log('mapOnClickHandler', mapPoint);
        const data = await this.props.controller.fetchDataForInfoPanel(mapPoint.toJSON());
        console.log('data for info panel', data);

        if(data.precip){
            this.updatePrecipData(data.precip);
        }

        if(data.windGust){
            this.updateWindGustData(data.windGust);
        }

        if(data.Population){
            this.updatePopulationData(data.Population);
        }

        if(data.Language){
            this.updateLanguageData(data.Language);
        }

        if(data['Vehicle Avialability']){
            this.updateVehicleData(data['Vehicle Avialability'][0]);
        }

        if(data['Disability Status']){
            this.updateDisabilityData(data['Disability Status'][2]);
        }

        if(data['Internet Connectivity']){
            this.updateInternetData(data['Internet Connectivity'][0]);
        }
    }

    stormSelectorOnChange(stormName=''){
        // console.log('stormSelectorOnChange', stormName);
        this.setState({
            activeStorm: stormName
        }, async()=>{
            const data = await this.props.controller.fecthHurricaneForecastDataByName(stormName);
            this.updateStormData(data);
        });
    }

    componentDidMount(){
        // console.log('app is mounted');
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
                    windGustData={this.state.windGustData}
                    populationData={this.state.populationData}
                    languageData={this.state.languageData}
                    vehicleData={this.state.vehicleData}
                    disabilityData={this.state.disabilityData}
                    internetData={this.state.internetData}
                />
            </div>
        );
    };
};

export default App;