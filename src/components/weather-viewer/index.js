import View from './view';
import config from './config.json';

import axios from 'axios';

export default function(){

    const weatherData = {
        precip: {
            timeInfo: null,
            features: [
                // {
                //     time: 1547661600000,
                //     data: {

                //     }
                // }
            ]
        },
        windGust: {
            timeInfo: null,
            features: []
        }
    }

    // const view = new View();

    const init = (options={ container:null })=>{
        // view.init();

        getTimeInfo();

        // window.renderChart = (chartType)=>{

        //     if(chartType === 'precip'){
        //         view.render(weatherData.precip.features, 'precip');
        //     } else if (chartType === 'wind'){
        //         view.render(weatherData.windGust.features, 'wind');
        //     } else {
        //         console.error('chart type (precip or wind) is required');
        //     }
            
        // };

        // console.log(config);
    };

    const setWeatherDataFeatures = (key='', features=[])=>{
        weatherData[key].features = key === 'windGust' ? prepareWindGustData(features) : preparePrecipData(features, weatherData[key].timeInfo);
        // console.log('setWeatherDataFeatures', key, weatherData[key].features);
    };

    const setWeatherDataTimeInfo = (key='', timeInfo={})=>{
        // esriTimeRelationOverlapsStartWithinEnd
        // Query time data that overlaps (>=) the time extent’s start time and falls within (<) time extent’s end time.

        // esriTimeRelationOverlaps
        // Query time data that overlaps the (>=) time extent's start time and (=<) time extent's end time.

        weatherData[key].timeInfo = timeInfo;
        // console.log(weatherData[key].timeInfo);
    };

    const preparePrecipData = (features, timeInfo)=>{

        let startTime = new Date(timeInfo.timeExtent[0]);

        const startTimes = [
            startTime.getTime()
        ];

        // the precip data covers next 72 hours with interval of 6 hours, so populate all 12 items into the start times array 
        while (startTimes.length < 12){
            startTime.setTime(startTime.getTime() + (6*60*60*1000));
            startTimes.push(startTime.getTime() + 1000);
        }

        // loop through all start time and find if the first item in features match the time  
        return startTimes.map(t=>{
            const data = features[0] && features[0].attributes.fromdate === t ? features[0].attributes : null;

            // remove the matched item from features
            if(data){
                features = features.slice(1);
            }

            return {
                'fromdate': t,
                'data': data
            }
        });
    };

    const prepareWindGustData = (features)=>{
        return features.map(d=>{

            return {
                'fromdate': d.attributes.fromdate,
                'data': d.attributes
            }
            
        });
    }

    const fetchData = (requestUrl, params)=>{

        return new Promise((resolve, reject)=>{

            axios.get(requestUrl, {
                params
            }).then( (response)=>{
                // console.log(response);

                if(response.data && response.data.features){
                    resolve(response.data.features)
                }

            }).catch(err=>{
                // console.error(err);
                reject(err);
            });
        });

    };

    const fetchItemInfo = (requestUrl)=>{

        return new Promise((resolve, reject)=>{

            axios.get(requestUrl).then( (response)=>{
                // console.log(response);

                if(response.data){
                    resolve(response.data);
                }

            }).catch(err=>{
                // console.error(err);
                reject(err);
            });
        })
    }

    // get the time info for the weather data
    const getTimeInfo = ()=>{
        const itemInfoUrlPrcipData = config['precipitation-layer-url'] + '/?f=json';
        const itemInfoUrlWindData = config['wind-gust-layer-url'] + '/?f=json'; 

        Promise.all([
            fetchItemInfo(itemInfoUrlPrcipData), 
            fetchItemInfo(itemInfoUrlWindData)
        ]).then(function(arrOfResponses) {
            // console.log(arrOfResponses);
            setWeatherDataTimeInfo('precip', arrOfResponses[0].timeInfo);
            setWeatherDataTimeInfo('windGust', arrOfResponses[1].timeInfo);
        });
    };

    const queryByLatLon = (mapPoint)=>{

        const params = {
            f: 'json',
            returnGeometry: false,
            geometry: {
                "x": mapPoint.x,
                "y": mapPoint.y,
                "spatialReference":{"wkid":102100,"latestWkid":3857}
            },
            geometryType: 'esriGeometryPoint',
            spatialRel: 'esriSpatialRelIntersects',
            outFields: '*'
        };

        const requestUrlPrcipData = config['precipitation-layer-url'] + '/0/query';
        const requestUrlWindData = config['wind-gust-layer-url'] + '/0/query'; 

        Promise.all([
            fetchData(requestUrlPrcipData, params), 
            fetchData(requestUrlWindData, params)
        ]).then(function(arrOfResponses) {
            // console.log(arrOfResponses);
            setWeatherDataFeatures('precip', arrOfResponses[0]);
            setWeatherDataFeatures('windGust', arrOfResponses[1]);
        });

    };

    return {
        init,
        queryByLatLon
    }
};