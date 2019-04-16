import React from 'react';
import { loadCss, loadModules } from 'esri-loader';

loadCss('https://js.arcgis.com/4.10/esri/css/main.css');

const config ={
    CONTAINER_ID: 'mapViewDiv',
    AGOL_ITEM_ID_WEB_MAP: '6cd940d108414780ad0118f78e2a6fcd'
}

export default class Map extends React.PureComponent {
    constructor(props){
        super(props);
        // console.log('Map props >>>', props);

        this.mapView = null;
    };

    initMap(){

        loadModules([
            "esri/views/MapView",
            "esri/WebMap"
        ]).then(([
            MapView, WebMap,
        ])=>{

            this.mapView = new MapView({
                map: new WebMap({
                    portalItem: { 
                        id: config.AGOL_ITEM_ID_WEB_MAP
                    }
                }),
                container: config.CONTAINER_ID,
            });

            this.mapView.when(()=>{
                this.mapViewOnReadyHandler();
                // console.log('map view is ready');
            }).catch((err)=>{
                console.error(err)
            });

        }).catch(err=>{
            console.error(err);
        });

        // console.log('init map view...');
    };

    initAddressLocator(){
        loadModules([
            "esri/widgets/Search"
        ]).then(([
            Search
        ])=>{

            const searchWidget = new Search({
                view: this.mapView,
                container: 'addressLocatorDiv'
            });

        }).catch(err=>console.error(err));
    }

    mapViewOnReadyHandler(){
        this.mapView.on('click', (evt)=>{
            this.mapOnClickHandler(evt.mapPoint);
        });

        this.initAddressLocator();
    };

    mapOnClickHandler(mapPoint=null){

        this.addPointToMap(mapPoint);

        this.props.onClick(mapPoint);
    };

    addPointToMap(mapPoint){

        loadModules([
            "esri/Graphic"
        ]).then(([
            Graphic
        ])=>{

            const markerSymbol = {
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                color: [217,70,52],
                size: '15px',
                outline: { // autocasts as new SimpleLineSymbol()
                    color: [255, 255, 255, .7],
                    width: 2
                }
            };
    
            const pointGraphic = new Graphic({
                geometry: mapPoint,
                symbol: markerSymbol
            });
    
            this.mapView.graphics.removeAll();
            this.mapView.graphics.add(pointGraphic);

        }).catch(err=>console.error(err));

    };

    componentDidMount(){
        this.initMap();
    };

    componentDidUpdate(prevProps, prevStates){

    };

    render(){
        return(
            <div id={config.CONTAINER_ID} style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                margin: 0,
                padding: 0
            }}></div>
        );
    };
};