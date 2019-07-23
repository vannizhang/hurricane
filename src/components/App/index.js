import React from 'react';
import * as calcite from 'calcite-web';

import Map from '../Map';
import ControlPanel from '../ControlPanel';
import InfoPanel from '../InfoPanel';
// import Colors from '../../data/Colors';
import { reverseGeocode } from '../../utils/reverseGeocode';

import { urlFns, miscFns } from 'helper-toolkit-ts';

// const SIDE_PANEL_WIDTH = 395;

const config = {
    SIDE_PANEL_WIDTH: 415,
    search_params_key: {
        storm: 'storm'
    }
}

class App extends React.PureComponent {
    
    constructor(props){
        super(props);

        // console.log('init App component >>> props', props);

        this.state = {
            activeStorm: '', // selected storm name
            stormData: [], // forecast data for selected storm,

            // state for map component 
            forecastPositionPreview: null,
            forecastPositionSelected: null,
            activeStormExtent: null,

            // state for info panel
            isInfoPanelVisible: false,
            precipData: [],
            windGustData: [],
            populationData: [],
            languageData: [],
            vehicleData: null,
            disabilityData: null,
            internetData: null,
            mobilePhoneData: null,
            locationName: '',

            isSidebarMinimized: false
        };

        this.mapOnClick = this.mapOnClick.bind(this);
        this.mapOnReady = this.mapOnReady.bind(this);
        this.stormSelectorOnChange = this.stormSelectorOnChange.bind(this);
        this.updateStormData = this.updateStormData.bind(this);
        this.updatePrecipData = this.updatePrecipData.bind(this);
        this.updateWindGustData = this.updateWindGustData.bind(this);
        this.stormListOnClick = this.stormListOnClick.bind(this);
        this.stormListOnMouseEnter = this.stormListOnMouseEnter.bind(this);
        this.stormListOnMouseLeave = this.stormListOnMouseLeave.bind(this);
        this.toggleSidebar = this.toggleSidebar.bind(this);

    };

    updateStormData(data){
        // console.log('calling updateStormData', data);
        this.setState({
            stormData: data
        });
    };

    updatePrecipData(data=[]){
        // console.log('calling updatePrecipData', data);
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
        // console.log('calling updateVehicleData', data);
        this.setState({
            vehicleData: data
        });
    };

    updateDisabilityData(data=null){
        // console.log('calling updateDisabilityData', data);
        this.setState({
            disabilityData: data
        });
    };

    updateInternetData(data=null){
        // console.log('calling updateInternetData', data);
        this.setState({
            internetData: data
        });
    };

    updateMobilePhoneData(data=null){
        this.setState({
            mobilePhoneData: data
        });
    }

    updateIsInfoPanelVisible(isVisible=false){
        this.setState({
            isInfoPanelVisible: isVisible
        }, ()=>{
            // console.log(this.state.isInfoPanelVisible)
        });
    };

    updateForecastPositionPreview(data=null){
        this.setState({
            forecastPositionPreview: data
        });
    };

    updateForecastPositionSelected(data=null){
        this.setState({
            forecastPositionSelected: data
        });
    };

    updateActiveStorm(stormName=''){

        this.setState({
            activeStorm: stormName
        }, async()=>{
            const queryResponse = await this.props.controller.fecthHurricaneForecastDataByName(stormName);
            this.updateStormData(queryResponse.forecastData);
            this.updateActiveStormExtent(queryResponse.errorConeExtent);
        });

        urlFns.updateQueryParam({key: config.search_params_key.storm, value: stormName});
    }

    updateActiveStormExtent(data=null){
        // console.log(data);
        this.setState({
            activeStormExtent: data
        });
    }

    updateLocationName(addressData=null){

        const newLocationName = (addressData && addressData.City && addressData.Region) ? `${addressData.City}, ${addressData.Region}` : '';

        this.setState({
            locationName: newLocationName
        }, ()=>{
            // console.log(this.state.locationName)
        });
    }

    async mapOnClick(mapPoint){
        // console.log('mapOnClickHandler', mapPoint);
        try {
            
            const data = await this.props.controller.fetchDataForInfoPanel(mapPoint.toJSON());
            // console.log('data for info panel', data);

            this.updateIsInfoPanelVisible(true);

            if(data.precip && data.precipAccumulation){
                this.updatePrecipData([data.precip, data.precipAccumulation]);
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

            if(data['Mobile Phone Availability']){
                this.updateMobilePhoneData(data['Mobile Phone Availability'][1]);
            }

            const reverseGeocodeResult = await reverseGeocode({
                lon: mapPoint.longitude,
                lat: mapPoint.latitude
            });
            // console.log('reverseGeocodeResult', reverseGeocodeResult);

            if(reverseGeocodeResult && reverseGeocodeResult.address){
                this.updateLocationName(reverseGeocodeResult.address);
            }

        } catch(err){
            // console.error('error when fetch info window data');
            this.updateIsInfoPanelVisible(false);
        }

    }

    mapOnReady(){
        const searchParams = urlFns.parseQuery();
        const stormName = searchParams[config.search_params_key.storm];

        if(stormName){
            this.updateActiveStorm(stormName);
        }
    }

    stormSelectorOnChange(stormName=''){
        // console.log('stormSelectorOnChange', stormName);
        this.updateActiveStorm(stormName);
    }

    stormListOnClick(data=null){
        // console.log('stormListOnClick', data)
        this.updateForecastPositionSelected(data);
    }

    stormListOnMouseEnter(data=null){
        // console.log('stormListOnMouseEnter', data)
        this.updateForecastPositionPreview(data);
    }

    stormListOnMouseLeave(){
        this.updateForecastPositionPreview();
    }

    toggleSidebar(){
        this.setState({
            isSidebarMinimized: !this.state.isSidebarMinimized
        });
    }

    componentDidMount(){
        // console.log('app is mounted');
        calcite.init();
    }

    render(){
        const isMobile = miscFns.isMobileDevice();
        // console.log('isMobile', isMobile);

        const sideContainerStyle ={
            width: isMobile ? '100%' : config.SIDE_PANEL_WIDTH
        };

        return (
            <div id='appContentDiv'>
                <Map 
                    onClick={this.mapOnClick}
                    onReady={this.mapOnReady}

                    activeStormExtent={this.state.activeStormExtent}
                    forecastPositionPreview={this.state.forecastPositionPreview}
                    forecastPositionSelected={this.state.forecastPositionSelected}
                    rightPadding={isMobile ? 0 : config.SIDE_PANEL_WIDTH}

                    isDemoMode={this.props.isDemoMode}
                />

                <div className={`side-container ${this.state.isSidebarMinimized ? 'is-minimized': ''}`} style={sideContainerStyle}>

                    {/* <div className='phone-show text-center padding-leader-quarter ladding-trailer-quarter' onClick={this.toggleSidebar}>
                        <span className={`${this.state.isSidebarMinimized ? 'icon-ui-plus': 'icon-ui-minus'}`}></span>
                    </div> */}

                    <div className='content-wrap' style={{ padding: '1rem' }}>
                        <ControlPanel 
                            stormSelectorOnChange={this.stormSelectorOnChange}
                            stormListOnClick={this.stormListOnClick}
                            stormListOnMouseEnter={this.stormListOnMouseEnter}
                            stormListOnMouseLeave={this.stormListOnMouseLeave}

                            activeStorms={this.props.activeStorms}
                            activeStorm={this.state.activeStorm}
                            stormData={this.state.stormData}

                            isMobile = {isMobile}
                        />

                        <InfoPanel 
                            locationName={this.state.locationName}
                            isVisible={this.state.isInfoPanelVisible}
                            precipData={this.state.precipData}
                            windGustData={this.state.windGustData}
                            populationData={this.state.populationData}
                            languageData={this.state.languageData}
                            vehicleData={this.state.vehicleData}
                            disabilityData={this.state.disabilityData}
                            internetData={this.state.internetData}
                            mobilePhoneData={this.state.mobilePhoneData}

                            isMobile = {isMobile}
                        />
                    </div>

                </div>


            </div>
        );
    };
};

export default App;