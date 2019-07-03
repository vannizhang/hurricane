import React from 'react';
import { loadCss, loadModules } from 'esri-loader';

import AppConfig from '../../data/AppConfig';
// import colors from '../../data/Colors';
// import forecastPositionPreviewSymbol from '../../static/Symbology_PNG_SVG/PNG/LightBlueOrb.png';
import YellowDot from '../../static/YellowDot.png';

import TropicalDepressionIcon from '../../static/Symbology_PNG_SVG/32x32/b_TropicalDepression.png';
import TropicalStormIcon from '../../static/Symbology_PNG_SVG/32x32/c_TropicalStorm.png';
import Hurricane1Icon from '../../static/Symbology_PNG_SVG/32x32/d_Hurricane1.png';
import Hurricane2Icon from '../../static/Symbology_PNG_SVG/32x32/e_Hurricane2.png';
import Hurricane3Icon from '../../static/Symbology_PNG_SVG/32x32/f_Hurricane3.png';
import Hurricane4Icon from '../../static/Symbology_PNG_SVG/32x32/g_Hurricane4.png';
import Hurricane5Icon from '../../static/Symbology_PNG_SVG/32x32/h_Hurricane5.png';

loadCss('https://js.arcgis.com/4.10/esri/css/main.css');

const config ={
    CONTAINER_ID: 'mapViewDiv',
    // AGOL_ITEM_ID_WEB_MAP: webMapIdForDemo, //'6cd940d108414780ad0118f78e2a6fcd',
    FORECAST_POSITION_LAYERID: 'forecastPosition',
    FORECAST_POSITION_PREVIEW_LAYERID: 'forecastPositionPreview'
}

export default class Map extends React.PureComponent {
    constructor(props){
        super(props);
        // console.log('Map props >>>', props);

        this.mapView = null;
    };

    initMap(){

        const webMapId = this.props.isDemoMode ? AppConfig.demo.web_map_id : AppConfig.production.web_map_id;

        loadModules([
            "esri/views/MapView",
            "esri/WebMap"
        ]).then(([
            MapView, WebMap,
        ])=>{

            this.mapView = new MapView({
                map: new WebMap({
                    portalItem: { 
                        id: webMapId
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
                resultGraphicEnabled: false,
                popupEnabled: false,
                container: 'addressLocatorDiv'
            });

            searchWidget.on('search-complete', evt=>{
                // make the search equvelent to map click
                if(searchWidget.results[0] && searchWidget.results[0].results[0]){
                    // console.log(searchWidget.results[0].results[0].feature.geometry);
                    const searchResultGeom = searchWidget.results[0].results[0].feature.geometry;
                    this.mapOnClickHandler(searchResultGeom);
                }
            })

        }).catch(err=>console.error(err));
    }

    initForecastPositionLayer(mapScale=0){

        const layerUrl = this.props.isDemoMode ? AppConfig.demo.forecast_positions_layer_url : AppConfig.production.forecast_positions_layer_url;

        loadModules([
            "esri/layers/FeatureLayer",
            // "esri/layers/support/LabelClass"
        ]).then(([
            FeatureLayer,
            // LabelClass
        ])=>{

            const renderer = this.getRendererForForecastPositionLayer(mapScale);

            // const labelClass = new LabelClass({
            //     labelExpressionInfo: { expression: "$feature.DATELBL" },
            //     labelPlacement: 'above-center',
            //     symbol: {
            //         type: "text",  // autocasts as new TextSymbol()
            //         color: "white",
            //         haloSize: 2,
            //         haloColor: "#333"
            //     }
            // });

            const layer = new FeatureLayer({
                id: config.FORECAST_POSITION_LAYERID,
                url: layerUrl,
                renderer,
                labelsVisible:false
                // labelingInfo: [labelClass]
            });

            this.mapView.map.add(layer);

        }).catch(err=>console.error(err));
    }

    updateForecastPositionRendererByScale(mapScale=0){
        const forecastPositionLayer = this.mapView.map.findLayerById(config.FORECAST_POSITION_LAYERID);

        if(forecastPositionLayer){
            const newRenderer = this.getRendererForForecastPositionLayer(mapScale);
            forecastPositionLayer.renderer = newRenderer;
        }
    }

    getRendererForForecastPositionLayer(mapScale=0){
        const size = mapScale && mapScale > 73957190 ? 24 : 32;

        const icons = [
            TropicalDepressionIcon,
            TropicalStormIcon,
            Hurricane1Icon,
            Hurricane2Icon,
            Hurricane3Icon,
            Hurricane4Icon,
            Hurricane5Icon
        ];

        const symbols = icons.map(icon=>{
            return {
                type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
                url: icon,
                width: size + "px",
                height: size + "px"
            };
        });

        const renderer = {
            type: "class-breaks", // autocasts as new ClassBreaksRenderer()
            field: "MAXWIND",
            classBreakInfos: [
                {
                    minValue: 0,
                    maxValue: 33/1.15078, // covert val to miles
                    symbol: symbols[0]
                },
                {
                    minValue: 33.1/1.15078,
                    maxValue: 63/1.15078,
                    symbol: symbols[1]
                },
                {
                    minValue: 63.1/1.15078,
                    maxValue: 82/1.15078,
                    symbol: symbols[2]
                },
                {
                    minValue: 82.1/1.15078,
                    maxValue: 95/1.15078,
                    symbol: symbols[3]
                },
                {
                    minValue: 95.1/1.15078,
                    maxValue: 112/1.15078,
                    symbol: symbols[4]
                },
                {
                    minValue: 112.1/1.15078,
                    maxValue: 136/1.15078,
                    symbol: symbols[5]
                },
                {
                    minValue: 136.1/1.15078,
                    maxValue: 999,
                    symbol: symbols[6]
                }
            ]
        };

        return renderer;
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

            const zIndex = this.mapView.map.layers.length - 1;

            this.mapView.map.add(layer, zIndex);

        }).catch(err=>console.error(err));
    }

    mapViewOnReadyHandler(){
        this.mapView.on('click', (evt)=>{
            this.mapOnClickHandler(evt.mapPoint);
        });

        this.mapView.map.layers.forEach(layer=>{
            // console.log(layer);
            const isObservedTrack = layer.title.includes('Observed Track');
            if(layer.labelsVisible && isObservedTrack){
                layer.labelsVisible = false;
            }
        })

        this.initAddressLocator();

        this.initForecastPostionPreviewLayer();

        this.initForecastPositionLayer(this.mapView.scale);

        if(this.props.onReady){
            this.props.onReady();
        }

        this.mapView.watch("scale", (newValue)=>{
            // layer.renderer = newValue <= 72224 ? simpleRenderer : heatmapRenderer;
            // console.log(newValue);
            this.updateForecastPositionRendererByScale(newValue)
        });
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

            // const markerSymbol = {
            //     type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            //     color: 'white',
            //     size: '12px',
            //     outline: { // autocasts as new SimpleLineSymbol()
            //         color: [255, 242, 87, .5],
            //         width: 10
            //     }
            // };

            const pictureMarkerSymbol = {
                type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
                url: YellowDot,
                width: "24px",
                height: "24px"
            };
    
            const pointGraphic = new Graphic({
                geometry: mapPoint,
                symbol: pictureMarkerSymbol
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
                    latestWkid: 4326,
                    wkid: 4326
                },
            });

            this.mapView.goTo(point);

        }).catch(err=>console.error(err));
    };

    togglePreviewForecastPosition(){
        const targetLayer = this.mapView.map.findLayerById(config.FORECAST_POSITION_PREVIEW_LAYERID);

        if(targetLayer){
            targetLayer.removeAll();
        }

        if(this.props.forecastPositionPreview && targetLayer){

            loadModules([
                "esri/Graphic",
                "esri/geometry/Point"
            ]).then(([
                Graphic,
                Point
            ])=>{

                // const symbol = {
                //     type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
                //     url: forecastPositionPreviewSymbol,
                //     width: "64px",
                //     height: "64px"
                // };

                const mapScale = this.mapView.scale;

                const size = mapScale && mapScale > 73957190 ? 30 : 40;

                const symbol = {
                    type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                    color: [255, 255, 255, .5],
                    size: size + 'px',
                    outline: { // autocasts as new SimpleLineSymbol()
                        color: [0, 0, 0, 0],
                        width: 0
                    }
                };

                const geometry = new Point({
                    x: this.props.forecastPositionPreview.geometry.x,
                    y: this.props.forecastPositionPreview.geometry.y,
                    spatialReference: {
                        latestWkid: 4326,
                        wkid: 4326
                    },
                });
    
                const point = new Graphic({
                    geometry,
                    symbol
                });
    
                targetLayer.add(point);
    
            }).catch(err=>console.error(err));
        }
        
    };

    zoomToActiveStormExtent(){

        loadModules([
            "esri/geometry/Extent"
        ]).then(([
            Extent
        ])=>{
            
            const activeStormExtent = new Extent(this.props.activeStormExtent);
            this.mapView.goTo({
                target: activeStormExtent,
                zoom: 6
            });

        }).catch(err=>console.error(err));
    };

    componentDidMount(){
        this.initMap();
    };

    componentDidUpdate(prevProps, prevStates){

        if(this.props.activeStormExtent && this.props.activeStormExtent !== prevProps.activeStormExtent){
            this.zoomToActiveStormExtent();
        }

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