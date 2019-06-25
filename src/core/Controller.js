'use strict';

import WeatherDataManager from './WeatherData';
import HurricaneDataManager from './HurricaneData';
import DemographicDataManager from './DemographicData';

const Controller = function(){

    const state = {
        // actionHandlers: null
    };

    const weatherDataManager = new WeatherDataManager();
    const hurricaneDataManager = new HurricaneDataManager();
    const demographicDataManager = new DemographicDataManager();

    const init = async()=>{
        weatherDataManager.init();

        const activeStorms = await hurricaneDataManager.fetchActiveHurricanes();
        console.log(activeStorms);

        return {
            activeStorms
        };
        
    };

    // const initActionHandlers = (handlers={

    // })=>{
    //     state.actionHandlers = handlers;
    // };

    const fecthHurricaneForecastDataByName = async(stormName='')=>{
        const forecastData = await hurricaneDataManager.fecthForecastDataByName(stormName);
        const errorConeExtent = await hurricaneDataManager.fetchErrorConeExtent(stormName);
        // console.log('forecastData', forecastData);
        // console.log('errorConeExtent', errorConeExtent);
        /*
            the output data is an array of features look like this one below
            [
                {
                    attributes: {
                        stormType,
                        dateLabel,
                        maxWind,
                        category
                    },
                    geometry: d.geometry
                }
            ]

        */
        // console.log('ForecastDataByName', data);

        // if(state.actionHandlers.hurricaneDataOnReceive){
        //     state.actionHandlers.hurricaneDataOnReceive(data);
        // }

        return {
            forecastData,
            errorConeExtent
        };
    }

    const fetchDataForInfoPanel = async(mapPoint=null)=>{

        const weatherData = await weatherDataManager.queryByLocation(mapPoint);

        const demographicData = await demographicDataManager.queryByLocation(mapPoint);

        // if(state.actionHandlers.precipDataOnReceive){
        //     state.actionHandlers.precipDataOnReceive(weatherData.precip);
        // };

        // if(state.actionHandlers.windGustDataOnReceive){
        //     state.actionHandlers.windGustDataOnReceive(weatherData.windGust);
        // };

        // console.log('weatherData', weatherData);
        console.log('demographicData', demographicData);

        return {
            precip: weatherData.precip,
            precipAccumulation: weatherData.precipAccumulation,
            windGust: weatherData.windGust,
            ...demographicData
        }

    };

    return {
        init,
        // initActionHandlers,
        fetchDataForInfoPanel,
        fecthHurricaneForecastDataByName
    };

};

export default Controller;