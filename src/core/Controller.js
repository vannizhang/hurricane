'use strict';

import WeatherDataManager from './WeatherData';
import HurricaneDataManager from './HurricaneData';
import DemographicDataManager from './DemographicData';

const Controller = function(){

    const state = {
        actionHandlers: null
    };

    const weatherDataManager = new WeatherDataManager();
    const hurricaneDataManager = new HurricaneDataManager();
    const demographicDataManager = new DemographicDataManager();

    const init = async()=>{
        weatherDataManager.init();

        const activeStorms = await hurricaneDataManager.fetchActiveHurricanes();
        // console.log(activeStorms);

        return {
            activeStorms
        };
        
    };

    const initActionHandlers = (handlers={

    })=>{
        state.actionHandlers = handlers;
    };

    const fecthHurricaneForecastDataByName = async(stormName='')=>{
        const data = await hurricaneDataManager.fecthForecastDataByName(stormName);
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

        if(state.actionHandlers.hurricaneDataOnReceive){
            state.actionHandlers.hurricaneDataOnReceive(data);
        }
    }

    const fetchDataForInfoPanel = async(mapPoint=null)=>{

        const weatherData = await weatherDataManager.queryByLocation(mapPoint);

        const demographicData = await demographicDataManager.queryByLocation(mapPoint);

        console.log('weatherData', weatherData);
        console.log('demographicData', demographicData);
    };

    return {
        init,
        initActionHandlers,
        fetchDataForInfoPanel,
        fecthHurricaneForecastDataByName
    };

};

export default Controller;