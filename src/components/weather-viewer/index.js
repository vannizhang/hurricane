import View from './view';
import config from './config.json';

export default function(){

    const view = new View();

    const init = (options={ container:null })=>{
        view.init();

        console.log(config);
    };

    const fetchPrecipData = ()=>{

    };

    const queryByLatLon = (options={lat:0, lon:0})=>{
        // console.log(options);
    }

    return {
        init,
        queryByLatLon
    }
};