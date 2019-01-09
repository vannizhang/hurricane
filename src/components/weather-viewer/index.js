import View from './view';
import config from './config.json';

import axios from 'axios';

export default function(){

    const view = new View();

    const init = (options={ container:null })=>{
        view.init();

        console.log(config);
    };

    const fetchPrecipData = (params)=>{
        const requestUrl = config['precipitation-layer-url'] + '/0/query';

        axios.get(requestUrl, {
            params
        }).then( (response)=>{
            console.log(response);
        })
    };

    const fetchWindData = (params)=>{
        const requestUrl = config['wind-gust-layer-url'] + '/0/query';

        axios.get(requestUrl, {
            params
        }).then( (response)=>{
            console.log(response);
        })
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

        fetchPrecipData(params);
        fetchWindData(params);

    };

    return {
        init,
        queryByLatLon
    }
};