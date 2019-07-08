'use strict';

import axios from 'axios';
import { format as formatDate } from 'date-fns';
import { capitalizeFirstLetter } from '../utils/Helper'
import { getLocalizedTropicalCycloneClassifications } from '../utils/localizeTropicalCyclone';
import { urlFns } from 'helper-toolkit-ts';
import AppConfig from '../data/AppConfig';

const searchParams = urlFns.parseQuery();
const isDemoMode = searchParams.demoMode ? true : false;

// const URL_HURRICANE_LAYER = 'https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/Active_Hurricanes_v1/FeatureServer';
const URL_FORECAST_POSITION = isDemoMode ? AppConfig.demo.forecast_positions_layer_url : AppConfig.production.forecast_positions_layer_url;
const URL_FORECAST_ERROR_CONE = isDemoMode ? AppConfig.demo.forecast_positions_layer_url : AppConfig.production.forecast_positions_layer_url;

const config = {

    "forecast-position": {
        url: URL_FORECAST_POSITION,
        fields: {
            stormName: 'STORMNAME',
            stormType: 'TCDVLP',
            dateLabel: 'DATELBL',
            flDateLabel: 'FLDATELBL',
            maxWind: 'MAXWIND',
            basin: 'BASIN',
            gust: 'GUST',
            timezone: 'TIMEZONE'
        }
    },

    "forecast-error-cone": {
        url: URL_FORECAST_ERROR_CONE,
        fields: {
            stormName: 'STORMNAME',
        }
    }

};

const HurricaneData = function(){

    const fecthForecastDataByName = async(name='')=>{

        const fieldNameStormName = config["forecast-position"].fields.stormName;
        const fieldNameStormType = config["forecast-position"].fields.stormType;
        const fieldNameFlDateLabel = config["forecast-position"].fields.flDateLabel;
        const fieldNameDateLabel = config["forecast-position"].fields.dateLabel;
        const fieldNameMaxWind = config["forecast-position"].fields.maxWind;
        const fieldNameBasin= config["forecast-position"].fields.basin;
        const fieldNameGust= config["forecast-position"].fields.gust;
        const fieldNameTimeZome = config["forecast-position"].fields.timezone;

        const requestUrl = config["forecast-position"].url + '/query';

        const queryParam = {
            where: `${fieldNameStormName} = '${name}'`,
            outFields: '*',
            f: 'json',
        };

        try {
            const queryResponse = await queryRequest(requestUrl, queryParam);
            
            let features = queryResponse.features || [];
            // features = features.length > 6 ? features.slice(0, 6) : features;

            const data = features.map(d=>{

                console.log(`forecast location`, d);
                
                const stormType = d.attributes[fieldNameStormType];
                const flDateLabel = d.attributes[fieldNameFlDateLabel];
                const dateLabel = d.attributes[fieldNameDateLabel];
                const timezone = d.attributes[fieldNameTimeZome];
                // max wind in miles
                const maxWind = (d.attributes[fieldNameMaxWind] * 1.15078).toFixed(0);
                const gust = (d.attributes[fieldNameGust] * 1.15078).toFixed(0);
                const basin = d.attributes[fieldNameBasin];

                const category = getHurricaneCategory(maxWind, stormType);
                const forecastTimeInLocal = convertForecastTimeInLocal(flDateLabel);
                const localizedName = getLocalizedTropicalCycloneClassifications(maxWind, basin);

                return {
                    attributes: {
                        stormType,
                        dateLabel, //forecastTimeInLocal.formattedDate,
                        forecastTime: forecastTimeInLocal.localDate,
                        maxWind,
                        gust,
                        category,
                        localizedName,
                        timezone
                    },
                    geometry: d.geometry
                }
            });

            return data;

        } catch(err){
            console.error(err);
            return [];
        }
    };

    const fetchErrorConeExtent = async(name='')=>{

        const fieldNameStormName = config["forecast-error-cone"].fields.stormName;

        const requestUrl = config["forecast-error-cone"].url + '/query';

        const queryParam = {
            where: `${fieldNameStormName} = '${name}'`,
            returnExtentOnly: true,
            f: 'json',
        };

        try {
            const queryResponse = await queryRequest(requestUrl, queryParam);
            // console.log('fetchErrorConeExtent', queryResponse);
            return queryResponse.extent || null;

        } catch(err){
            return null;
        }
    };

    const fetchActiveHurricanes = async()=>{

        const requestUrl = config["forecast-position"].url + '/query';

        const fieldNameStormName = config["forecast-position"].fields.stormName;

        const queryParam = {
            where: '1=1',
            outFields: fieldNameStormName,
            returnDistinctValues: true,
            returnGeometry: false,
            f: 'json',
        };

        try {
            const queryRes = await queryRequest(requestUrl, queryParam);
            const features = queryRes.features || [];

            // console.log(requestUrl, queryParam);

            const data = features.map(d=>{
                const value = d.attributes[fieldNameStormName];
                const label = capitalizeFirstLetter(value);
                return {
                    value,
                    label
                };
            });

            return data;

        } catch(err){
            console.error(err);
            return [];
        }

    };

    const queryRequest = (requestUrl, params)=>{

        return new Promise((resolve, reject)=>{

            const formData = new FormData();

            Object.keys(params).forEach(key=>{
                formData.append(key, params[key]);
            });

            axios.post(requestUrl, formData).then( (response)=>{
                // console.log(response);

                if(response.data){
                    resolve(response.data)
                }

            }).catch(err=>{
                // console.error(err);
                reject(err);
            });
        });

    };

    const convertForecastTimeInLocal = (dateLabel)=>{
        const dateParts = dateLabel.split(' ');
        const yyyymmdd = dateParts[0].split('-');
        const year = +yyyymmdd[0];
        const month = +yyyymmdd[1] - 1;
        const day = +yyyymmdd[2];
        const hour = +dateParts[1].split(':')[0];
        const ampm = dateParts[2];

        let hourIn24Format = 0;

        if(hour===12 && ampm==='AM'){
            hourIn24Format = 0;
        } else if (hour < 12 && ampm === 'PM'){
            hourIn24Format = hour + 12;
        } else {
            hourIn24Format = hour;
        }

        const localDate = new Date(Date.UTC(year, month, day, hourIn24Format));

        const formattedDate = formatDate(localDate, 'MMM DD h A');

        return {
            localDate,
            formattedDate
        };
    };

    const getHurricaneCategory = (maxWind=0, stormType='')=>{

        let category = '';

        switch(true){
            case (maxWind <= 33):
                if(stormType==='Subtropical Depressi'){
                    category = 'Subtropical Depression';
                } else if (stormType==='Tropical Low'){
                    category = 'Tropical Low';
                } else {
                    category = 'Tropical Depression';
                }
                break;
            case (maxWind > 33 && maxWind <= 63):
                category = 'Tropical Storm';
                break;
            case (maxWind > 63 && maxWind <= 82):
                category = 'Category 1';
                break;
            case (maxWind > 82 && maxWind <= 95):
                category = 'Category 2';
                break;
            case (maxWind > 95 && maxWind <= 112):
                category = 'Category 3';
                break;
            case (maxWind > 112 && maxWind <= 136):
                category = 'Category 4';
                break;
            case (maxWind > 136):
                category = 'Category 5';
                break;
            default:
                category = 'NO DATA'
                break;
        }

        return category;
    };

    return {
        fetchActiveHurricanes,
        fecthForecastDataByName,
        fetchErrorConeExtent
    };

};

export default HurricaneData;