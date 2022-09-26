import React from 'react';
import * as calcite from 'calcite-web/dist/js/calcite-web';

import Map from '../Map';
import ControlPanel from '../ControlPanel';
import InfoPanel from '../InfoPanel';
import TabNavControl from '../TabNavControl';
import TopNavForPhone from '../TopNav';
import DrawerMenu from '../DrawerMenu';
// import Colors from '../../data/Colors';
import { reverseGeocode } from '../../utils/reverseGeocode';

import { urlFns } from 'helper-toolkit-ts';

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
            windGustData: null,
            populationData: [],
            languageData: [],
            vehicleData: null,
            disabilityData: null,
            internetData: null,
            mobilePhoneData: null,
            locationName: '',

            isSidebarMinimized: false,
            // in mobile view, the storm panel and community info panel cannot be displayed together
            // therefore we need to toggle the visibility of these two panels, the value for visiblePanelForMobileDevice could be 'storm' | 'info'
            visiblePanelForMobileDevice: 'storm',

            showDemographicDataAtCountyLevel: false,
            queryLocation: null,
        };

        this.queryInfoGraphicData = this.queryInfoGraphicData.bind(this);
        this.mapOnReady = this.mapOnReady.bind(this);
        this.stormSelectorOnChange = this.stormSelectorOnChange.bind(this);
        this.updateStormData = this.updateStormData.bind(this);
        this.updatePrecipData = this.updatePrecipData.bind(this);
        this.updateWindGustData = this.updateWindGustData.bind(this);
        this.stormListOnClick = this.stormListOnClick.bind(this);
        this.stormListOnMouseEnter = this.stormListOnMouseEnter.bind(this);
        this.stormListOnMouseLeave = this.stormListOnMouseLeave.bind(this);
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.updateVisiblePanelForMobileDevice = this.updateVisiblePanelForMobileDevice.bind(this);
        this.toggleDrawerMenu = this.toggleDrawerMenu.bind(this);
        this.openAboutModalInMobileView = this.openAboutModalInMobileView.bind(this);
        this.updateQueryLocation = this.updateQueryLocation.bind(this);

    };

    updateQueryLocation(mapPoint){
        // console.log('calling updateQueryLocation', data);
        this.setState({
            queryLocation: mapPoint
        });
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

        urlFns.updateHashParam({key: config.search_params_key.storm, value: stormName});
    }

    updateActiveStormExtent(data=null){
        // console.log(data);
        this.setState({
            activeStormExtent: data
        });
    }

    updateLocationName(addressData=null){

        const neighborhoodName = (addressData && addressData.Neighborhood) ? addressData.Neighborhood : '';
        const cityName = (addressData && addressData.City && addressData.Region) ? `${addressData.City}, ${addressData.Region}` : '';
        const newlocationName = [neighborhoodName, cityName].filter(d=>d).join(', ');

        this.setState({
            locationName: newlocationName
        }, ()=>{
            // console.log(this.state.locationName)
        });
    }

    updateVisiblePanelForMobileDevice(val='storm'){
        // console.log('updateVisiblePanelForMobileDevice', val);
        this.setState({
            visiblePanelForMobileDevice: val
        });
    }

    async queryInfoGraphicData(mapPoint, shouldFetchCountyLevelData){
        // console.log('mapOnClickHandler', mapPoint);
        try {
            
            const data = await this.props.controller.fetchDataForInfoPanel(mapPoint, shouldFetchCountyLevelData);
            // console.log('data for info panel', data);

            this.updateVisiblePanelForMobileDevice('community');

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
        const searchParams = urlFns.parseHash();
        const stormName = searchParams[config.search_params_key.storm];

        if(stormName){
            this.updateActiveStorm(stormName);
        }
    }

    stormSelectorOnChange(stormName=''){
        // console.log('stormSelectorOnChange', stormName);
        this.updateVisiblePanelForMobileDevice('storm');
        this.updateActiveStorm(stormName);

        this.toggleDrawerMenu(false);
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

    shouldFetchCountyLevelDataOnChange(newVal){
        this.setState({
            shouldFetchCountyLevelData: newVal
        });
    }

    toggleDrawerMenu(isOpening){
        const action = isOpening ? 'open' : 'close';
        calcite.bus.emit(`drawer:${action}`, {id: "drawer-menu"})
    }

    openAboutModalInMobileView(){
        calcite.bus.emit('drawer:close', {id: "drawer-menu"});
        calcite.bus.emit('modal:open', {id: "about-this-app"})
    }

    componentDidMount(){
        // console.log('app is mounted');
        calcite.init();
    }

    componentDidUpdate(prevProps, prevState){
        if(
            prevState.queryLocation !== this.state.queryLocation ||
            prevState.showDemographicDataAtCountyLevel !== this.state.showDemographicDataAtCountyLevel
        ){
            this.queryInfoGraphicData(this.state.queryLocation, this.state.showDemographicDataAtCountyLevel)
        }
    }

    render(){
        const isMobile = this.props.isMobile; //miscFns.isMobileDevice();
        // console.log('isMobile', isMobile);

        const sideContainerStyle ={
            width: isMobile ? '100%' : config.SIDE_PANEL_WIDTH
        };

        const contentWrapStyle = {
            padding: isMobile ? '0 1rem 1rem' :'1rem'
        }

        const isControlPanelVisible = !isMobile  ? true  : ( this.state.visiblePanelForMobileDevice === 'storm' ? true : false );

        const isInfoPanelVisible = !isMobile ? true : ( this.state.visiblePanelForMobileDevice === 'community' ? true : false );

        const topNav = isMobile
            ? <TopNavForPhone 
                activeStorm={this.state.activeStorm}
                menuBtnOnClick={this.toggleDrawerMenu.bind(this, true)}
            />
            : null;

        const drawerMenu = isMobile
            ? <DrawerMenu
                activeStorms={this.props.activeStorms}
                stormOnChange={this.stormSelectorOnChange}
                openAboutModal={this.openAboutModalInMobileView}
            />
            : null;

        const controlPanel = isControlPanelVisible
            ? <ControlPanel 
                stormSelectorOnChange={this.stormSelectorOnChange}
                stormListOnClick={this.stormListOnClick}
                stormListOnMouseEnter={this.stormListOnMouseEnter}
                stormListOnMouseLeave={this.stormListOnMouseLeave}

                activeStorms={this.props.activeStorms}
                activeStorm={this.state.activeStorm}
                stormData={this.state.stormData}

                isMobile = {isMobile}
                openDrawerMenuOnClick={this.toggleDrawerMenu.bind(this, true)}
            />
            : null

        const infoPanel = isInfoPanelVisible 
            ? <InfoPanel 
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
                openDrawerMenuOnClick={this.toggleDrawerMenu.bind(this, true)}
                shouldFetchCountyLevelDataOnChange={this.shouldFetchCountyLevelDataOnChange}
            />
            : null;

        const tabNavControl = isMobile
            ? <TabNavControl 
                data={[
                    {
                        label: 'Storm Info',
                        value: 'storm'
                    },
                    {
                        label: 'Community Info',
                        value: 'community'
                    }
                ]}
                onClick={this.updateVisiblePanelForMobileDevice}
                visiblePanel={this.state.visiblePanelForMobileDevice}
            /> 
            :null;

        const toggleBtn = isMobile
        ? (
            <div className={`text-center font-size--3 padding-leader-quarter padding-trailer-quarter`} onClick={this.toggleSidebar}>
                <span className={`${this.state.isSidebarMinimized ? 'icon-ui-up': 'icon-ui-down'}`}></span>
            </div>
        )
        : null;

        const sideContainerModifierClasses = [];

        if(this.state.isSidebarMinimized){
            sideContainerModifierClasses.push('is-minimized');
        }

        if(isMobile){
            sideContainerModifierClasses.push('is-mobile');
        }

        return (
            <div id='appContentDiv'>
                { drawerMenu }

                <div className='wrapper'>

                    { topNav }

                    <Map 
                        onClick={this.updateQueryLocation}
                        onReady={this.mapOnReady}

                        activeStormExtent={this.state.activeStormExtent}
                        forecastPositionPreview={this.state.forecastPositionPreview}
                        forecastPositionSelected={this.state.forecastPositionSelected}
                        rightPadding={isMobile ? 0 : config.SIDE_PANEL_WIDTH}
                        topPadding={isMobile ? 50 : 0 }
                        bottomPadding={isMobile ? 240 : 0}

                        isDemoMode={this.props.isDemoMode}
                        isMobile = {isMobile}
                    />

                    <div className={`side-container ${sideContainerModifierClasses.join(' ')}`} style={sideContainerStyle}>

                        {/* <div className={`phone-show text-center font-size--3 padding-leader-quarter padding-trailer-quarter`} onClick={this.toggleSidebar}>
                            <span className={`${this.state.isSidebarMinimized ? 'icon-ui-up': 'icon-ui-down'}`}></span>
                        </div> */}

                        { toggleBtn }

                        <div className='content-wrap' style={contentWrapStyle}>
                            { controlPanel }
                            { infoPanel }
                            { tabNavControl }
                        </div>

                    </div>

                </div>



            </div>
        );
    };
};

export default App;