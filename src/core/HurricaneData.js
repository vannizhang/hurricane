'use strict';

import axios from 'axios';
import { capitalizeFirstLetter } from '../utils/Helper'

const URL_HURRICANE_LAYER = 'https://utility.arcgis.com/usrsvcs/servers/4693f2a1d2e348c193ce5ec4d1d887a5/rest/services/LiveFeeds/Hurricane_Active/MapServer';

const config = {

    "forecasted-position": {
        url: URL_HURRICANE_LAYER + '/0',
        fields: {
            stormName: 'STORMNAME',
            stormType: 'TCDVLP',
            dateLabel: 'FLDATELBL',
            maxWind: 'MAXWIND'
        }
    }

};

const HurricaneData = function(){

    const fecthForecastDataByName = async(name='')=>{

        const fieldNameStormName = config["forecasted-position"].fields.stormName;
        const fieldNameStormType = config["forecasted-position"].fields.stormType;
        const fieldNameDateLabel = config["forecasted-position"].fields.dateLabel;
        const fieldNameMaxWind = config["forecasted-position"].fields.maxWind

        const requestUrl = config["forecasted-position"].url + '/query';

        const queryParam = {
            where: `${fieldNameStormName} = '${name}'`,
            outFields: '*',
            f: 'json',
        };

        try {
            const features = await queryFeatures(requestUrl, queryParam);

            const data = features.map(d=>{
                
                const stormType = d.attributes[fieldNameStormType];
                const dateLabel = d.attributes[fieldNameDateLabel];
                const maxWind = d.attributes[fieldNameMaxWind];
                const category = getHurricaneCategory(maxWind, stormType);

                return {
                    attributes: {
                        stormType,
                        dateLabel,
                        maxWind,
                        category
                    },
                    geometry: d.geometry
                }
            });

            console.log(`forecast hurricane data for ${name}`, features);

            return data;

        } catch(err){
            console.error(err);
            return [];
        }
    };

    const fetchActiveHurricanes = async()=>{

        const requestUrl = config["forecasted-position"].url + '/query';

        const fieldNameStormName = config["forecasted-position"].fields.stormName;

        const queryParam = {
            where: '1=1',
            outFields: fieldNameStormName,
            returnDistinctValues: true,
            returnGeometry: false,
            f: 'json',
        };

        try {
            const features = await queryFeatures(requestUrl, queryParam);

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

    const queryFeatures = (requestUrl, params)=>{

        return new Promise((resolve, reject)=>{

            axios.get(requestUrl, {
                params
            }).then( (response)=>{
                // console.log(response);

                if(response.data && response.data.features){
                    resolve(response.data.features)
                } else {
                    reject('no features returned', response.data);
                }

            }).catch(err=>{
                // console.error(err);
                reject(err);
            });
        });

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
        fecthForecastDataByName
    };

};

export default HurricaneData;