import React from 'react';
import { loadCss, loadModules } from 'esri-loader';

import colors from '../../data/Colors';
import forecastPositionPreviewSymbol from '../../static/Symbology_PNG_SVG/PNG/LightBlueOrb.png';

loadCss('https://js.arcgis.com/4.10/esri/css/main.css');

const config ={
    CONTAINER_ID: 'mapViewDiv',
    AGOL_ITEM_ID_WEB_MAP: '6cd940d108414780ad0118f78e2a6fcd',
    FORECAST_POSITION_PREVIEW_LAYERID: 'forecastPositionPreview'
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
                padding: {
                    right: this.props.rightPadding || 0
                }
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

    initForecastPostionPreviewLayer(){
        loadModules([
            "esri/layers/GraphicsLayer"
        ]).then(([
            GraphicsLayer
        ])=>{

            // Add graphic when GraphicsLayer is constructed
            const layer = new GraphicsLayer({
                id: config.FORECAST_POSITION_PREVIEW_LAYERID
            });

            this.mapView.map.add(layer);

        }).catch(err=>console.error(err));
    }

    mapViewOnReadyHandler(){
        this.mapView.on('click', (evt)=>{
            this.mapOnClickHandler(evt.mapPoint);
        });

        this.initAddressLocator();

        this.initForecastPostionPreviewLayer();
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
                color: colors.pinDrop,
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

    zoomToSelectedForecastPosition(){

        // console.log(this.props.forecastPositionSelected);
        
        loadModules([
            "esri/geometry/Point"
        ]).then(([
            Point
        ])=>{

            const point = new Point({
                x: this.props.forecastPositionSelected.geometry.x,
                y: this.props.forecastPositionSelected.geometry.y,
                spatialReference: {
                    latestWkid: 3857,
                    wkid: 102100
                },
            });

            this.mapView.goTo(point);

        }).catch(err=>console.error(err));
    };

    togglePreviewForecastPosition(){
        const targetLayer = this.mapView.map.findLayerById(config.FORECAST_POSITION_PREVIEW_LAYERID);
        targetLayer.removeAll();

        if(this.props.forecastPositionPreview){

            loadModules([
                "esri/Graphic",
                "esri/geometry/Point"
            ]).then(([
                Graphic,
                Point
            ])=>{

                const symbol = {
                    type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
                    url: forecastPositionPreviewSymbol,
                    width: "64px",
                    height: "64px"
                };

                const geometry = new Point({
                    x: this.props.forecastPositionPreview.geometry.x,
                    y: this.props.forecastPositionPreview.geometry.y,
                    spatialReference: {
                        latestWkid: 3857,
                        wkid: 102100
                    },
                });
    
                const point = new Graphic({
                    geometry,
                    symbol
                });
    
                targetLayer.add(point);
    
            }).catch(err=>console.error(err));
        }
    }

    componentDidMount(){
        this.initMap();
    };

    componentDidUpdate(prevProps, prevStates){
        if(this.props.forecastPositionSelected && this.props.forecastPositionSelected !== prevProps.forecastPositionSelected){
            this.zoomToSelectedForecastPosition();
        }

        if(this.props.forecastPositionPreview !== prevProps.forecastPositionPreview){
            this.togglePreviewForecastPosition();
        }
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