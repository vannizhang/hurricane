import axios from 'axios';

const config = {
    "precipitation-layer-url": "https://utility.arcgis.com/usrsvcs/servers/d9835527647f4419ab113c95d29fce88/rest/services/LiveFeeds/NDFD_Precipitation/MapServer",
    "wind-gust-layer-url": "https://utility.arcgis.com/usrsvcs/servers/abfa29364f074c1dafa0e253217ef472/rest/services/LiveFeeds/NDFD_WindGust/MapServer"
};

export default function(){

    const weatherData = {
        precip: {
            timeInfo: null,
            // features: [
            //     // {
            //     //     time: 1547661600000,
            //     //     data: {

            //     //     }
            //     // }
            // ]
        },
        windGust: {
            timeInfo: null,
            // features: []
        }
    }

    const init = ()=>{
        getTimeInfo();
    };

    const setWeatherDataFeatures = (key='', features=[])=>{
        // weatherData[key].features = (key === 'windGust') ? prepareWindGustData(features) : preparePrecipData(features, weatherData[key].timeInfo);
        // console.log('setWeatherDataFeatures', key, weatherData[key].features);
        return (key === 'windGust') ? prepareWindGustData(features) : preparePrecipData(features, weatherData[key].timeInfo);
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
                } else {
                    reject('no features returned', response.data);
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

    const queryByLocation = (mapPoint={})=>{

        const params = {
            f: 'json',
            returnGeometry: false,
            geometry: mapPoint,
            geometryType: 'esriGeometryPoint',
            spatialRel: 'esriSpatialRelIntersects',
            outFields: '*'
        };

        const requestUrlPrcipData = config['precipitation-layer-url'] + '/0/query';
        const requestUrlWindData = config['wind-gust-layer-url'] + '/0/query'; 

        return new Promise((resolve, reject)=>{

            Promise.all([
                fetchData(requestUrlPrcipData, params), 
                fetchData(requestUrlWindData, params)
            ]).then(function(arrOfResponses) {
                // console.log(arrOfResponses);
                const precipData = setWeatherDataFeatures('precip', arrOfResponses[0]);
                const windGustData = setWeatherDataFeatures('windGust', arrOfResponses[1]);

                resolve({
                    precip: precipData,
                    windGust: windGustData
                });

            }).catch(err=>{
                reject(err);
            })
        })


    };

    return {
        init,
        queryByLocation
    }
}



