import axios from 'axios';

const config = {
    requestUrl: 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode'
}

const reverseGeocode = ({
    lat = 0,
    lon = 0
}={})=>{

    const requestUrl = config.requestUrl;

    const location = {
        x: lon,
        y: lat
    };

    const params = {
        location,
        f: 'json'
    };

    return new Promise((resolve, reject)=>{

        axios.get(requestUrl, {
            params
        }).then(res=>{
            // console.log(res);
            resolve(res.data);
        }).catch(err=>{
            console.error(err);
            reject(err);
        });

    });

};

export {
    reverseGeocode
};