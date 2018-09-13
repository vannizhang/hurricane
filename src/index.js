// import dependencies and libraries
// import $ from 'jquery';
// import * as d3 from "d3";
import * as esriLoader from 'esri-loader';
import * as calcite from 'calcite-web';

// import style files
import "./style/index.scss";

// import other files

// app configs
const ITEM_ID_HURRICANE_WEB_MAP = 'c500379cb42d4ba28407502563505e3e'; 

const DOM_ID_MAP_VIEW_CONTAINER = 'viewDiv';


esriLoader.loadModules([
    'esri/views/MapView', 
    'esri/WebMap'
]).then(([
    MapView, 
    WebMap
])=>{

    const HurricaneMap = function(){

        // private variables
        let mapView = null;

        // private methods
        const initMapView = ()=>{
                    
            const webmap = new WebMap({
                portalItem: { 
                    id: ITEM_ID_HURRICANE_WEB_MAP
                }
            });

            return new MapView({
                map: webmap,
                container: DOM_ID_MAP_VIEW_CONTAINER
            });
        };

        const initMapEventHandlers = ()=>{
            console.log('init map view event handlers', mapView);
        };

        const init = (()=>{
            mapView = initMapView();
            initMapEventHandlers();
        })();

        console.log(this);

    };

    const AppDataModel = function(){

        let stormName = '';
        let observedPosition = null;
        let forecastPosition = null;

        const setStormName = (name='')=>{
            stormName = name;
        };

        const getStormname = ()=>{
            return stormName
        };
    };

    const AppView = function(){

    };

    const AppViewModel = function(){

    };

    // initiate core modules
    const dataModel = new AppDataModel();
    const hurricaneMap = new HurricaneMap();


}).catch(err => {
    // handle any errors
    console.error(err);
});