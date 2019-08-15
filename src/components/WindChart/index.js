'use strict';

import './style.scss';

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import WindLayerConfig from '../../data/WindGustLayerConfig';

const config = {
    windTicks :[ 2, 4, 6, 8, 10, 12, 14, 16 ],
    class_name: {
        svg: 'wind-chart-svg'
    },
    id: {
        verticalRefLine: 'windChartVerticalReferenceLine'
    }
};

export default function WindChart({
    containerID='',
    containerWidth='',
    containerHeight='',

    fieldNameForXAxis = '',
    fieldNameForYAxis = '',
    data = [],
    isMobile = false
}={}){

    const containerDivRef = useRef(null);
   
    const [ svg, setSvg ] = useState(null);
    const [ width, setWidth ] = useState(0);
    const [ height, setHeight ] = useState(0);
    const [ scales, setScales ] = useState({});
    const [ axis, setAxis ] = useState({});
    const [ verticalRefLine, setVerticalRefLine ] = useState(null);
    const [ verticalRefLineXPos, setVerticalRefLineXPos ] = useState(0);
    const [ tooltipData, setTooltipData ] = useState(null);

    const initSvg = ()=>{

        const container = containerDivRef.current;
        const margin = {top: 5, right: 20, bottom: 20, left: 55};
        const width = container.offsetWidth - margin.left - margin.right;
        setWidth(width);

        const height = container.offsetHeight - margin.top - margin.bottom;
        setHeight(height);

        const scales = initScales(width, height);
        setScales(scales);

        const axis = initAxis(scales);
        setAxis(axis);
        
        const svg = d3.select("#" + containerID).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .attr("class", config.class_name.svg)
                    .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        setSvg(svg);

        const refLine = initVerticalRefLine({ svg, height })
        setVerticalRefLine(refLine);

        initOverlayRect({ svg, width, height, scales });
        // console.log(container, width, height);
    };

    const initScales = (width, height)=>{

        const scales = {};

        const x = d3.scaleTime().range([0, width]);
        scales.x = x;

        const y = d3.scaleLinear().range([height, 0]);
        scales.y = y;

        // setScales(scales);
        return scales;
    };

    const initAxis = (scales)=>{
        
        const axis = {};

        axis.x = d3.axisBottom()
            .scale(scales.x)
            // .tickSize(-height)
            .tickFormat(d3.timeFormat("%a %-I %p"));

        axis.y = d3.axisLeft()
            .scale(scales.y)
            // .tickValues([0, 3, 6, 9, 12, 15])
            .tickValues(config.windTicks)
            .tickFormat(d =>{ 
                return decodeWindForce(d); 
            })
            // .tickSize(-width)
            .ticks(5);

        // setAxis(axis);
        return axis;
    };

    const initOverlayRect = ({
        svg = null,
        height = 0,
        width = 0,
        scales = null
    }={})=>{
        const overlay = svg.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .attr('fill', 'rgba(0,0,0,0)')
            // .on("mouseenter", mouseOverHandler)
            .on("mouseleave", hideTooltip)
            .on("mousemove", function(evt){
                // console.log(this, evt);
                const mousePosX = d3.mouse(this)[0];
                // const invertVal = scales.x.invert(mousePosX);
                // console.log(invertVal);
                mouseMoveHandler({
                    mousePosX, 
                    scales
                });
            });
    };

    const initVerticalRefLine = ({
        svg = null,
        height = 0
    }={})=>{
        const refLine = svg.append('line')
            .attr('id', config.id.verticalRefLine)
            .attr('class', 'vertical-reference-line')
            .attr('x1', verticalRefLineXPos)
            .attr('y1', 0)
            .attr('x2', verticalRefLineXPos)
            .attr('y2', height)
            // .style("display", "none")
            .attr('stroke-width', 0.5)
            .attr("stroke", "#efefef")
            .style("fill", "none");

        return refLine;
    };

    const updateVerticalRefLinePos = ()=>{
        const refLine = d3.select('#' + config.id.verticalRefLine)
            .attr('x1', verticalRefLineXPos)
            .attr('x2', verticalRefLineXPos);
    }

    const draw = ()=>{

        // console.log('draw wind chart')

        const parseDate = d3.isoParse;

        data = data.map(d=>{
            d[fieldNameForXAxis] = parseDate(d[fieldNameForXAxis]);
            return d;
        });

        updateDomainForXScale();

        updateDomainForYScale();

        updateXAxisTickValues(data);

        drawXLabels();

        drawYLabels();

        drawLines();
    }; 

    const updateDomainForXScale = ()=>{
        scales.x.domain(d3.extent(data, function(d) { return d[fieldNameForXAxis]; }));
    };

    const updateDomainForYScale = ()=>{
        scales.y.domain([0, 16]);
    };

    const updateXAxisTickValues = (data)=>{

        const xAxisValues = data.filter((d, i)=>{
            return i%5 === 0;
        }).map(d=>{
            return d[fieldNameForXAxis];
        });

        axis.x.tickValues(xAxisValues);
    }

    const drawXLabels = ()=>{
        const xAxisLabel = svg.selectAll('.x.axis');

        if(!xAxisLabel.size()){
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(axis.x);
        } else {
            xAxisLabel.attr("transform", "translate(0," + height + ")").call(axis.x);
        }
    };

    const drawYLabels = ()=>{
        const yAxisLabel = svg.selectAll('.y.axis');

        if(!yAxisLabel.size()){
            svg.append("g")
            .attr("class", "y axis")
            .call(axis.y);
        } else {
            yAxisLabel.call(axis.y);
        }
    };

    const drawLines = ()=>{

        const valueline = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return scales.x(d[fieldNameForXAxis]); })
            .y(function(d) { return scales.y(d[fieldNameForYAxis]); });

        const lines = svg.selectAll('.wind-chart-line');

        // check the number of existing lines, if greater than 0; remove all existing ones
        if(lines.size()){
            lines.remove().exit();
        }

        svg.append("path")
            .data([data])
            .attr("class", "wind-chart-line")
            .attr("d", valueline);
    };

    const mouseMoveHandler = ({scales=null, mousePosX=0}={})=>{

        // console.log(mousePosX);

        let tooltipData = null;
        let tooltipPos = null;

        for(let i = 0, len = data.length; i < len; i++){

            const currItem = data[i];
            const currItemPos = scales.x(currItem[fieldNameForXAxis]);

            const nextItem = data[i + 1] ? data[i + 1] : currItem;
            const nextItemPos = scales.x(nextItem[fieldNameForXAxis]);

            if(mousePosX >= currItemPos && mousePosX <= nextItemPos){

                const distToCurrItem = mousePosX - currItemPos;
                const distToNextItem = nextItemPos - mousePosX;

                tooltipData = distToCurrItem < distToNextItem ? currItem : nextItem;
                tooltipPos = distToCurrItem < distToNextItem ? currItemPos : nextItemPos;

                break;
            }
        }

        // console.log(tooltipData);
        setVerticalRefLineXPos(tooltipPos);
        setTooltipData(tooltipData);

    };

    const showTooltip = ()=>{
        // console.log('show tooltip', tooltipData);
        toggleRefLine(true);
    };

    const hideTooltip = ()=>{
        setTooltipData(null);
    };

    const getTooltipText = ()=>{

        const containerWidth = containerDivRef.current ? containerDivRef.current.offsetWidth : 0;

        const leftPos = (tooltipData && verticalRefLineXPos < containerWidth/2) 
            ? verticalRefLineXPos + 65 
            : 'unset';

        const reightPos = (tooltipData && verticalRefLineXPos > containerWidth/2) 
            ? ((containerWidth - verticalRefLineXPos) - 65) 
            : 'unset';

        const tooltipContainerStyle = {
            position: 'absolute',
            top: 0,
            left: leftPos,
            // by default, alight tooltip to right if there is no tooltipData
            right: tooltipData ? reightPos : 0,
            color: 'rgba(255,255,255,.7)',
            pointerEvents: 'none'
        }

        let tooltipContent = isMobile ? 'Click the chart to show a value' : '';

        if( tooltipData && tooltipData[fieldNameForXAxis] ){
            const formatTime = d3.timeFormat("%a %-I %p");
            const forecastTime = formatTime(tooltipData[fieldNameForXAxis]); // "June 30, 2015"
            const forecastVal = decodeWindForce(tooltipData[fieldNameForYAxis]);

            tooltipContent = ( <span>{forecastTime}: {forecastVal}</span> );
        }

        return (
            <div className='font-size--3 trailer-0 margin-right-1 text-right' style={tooltipContainerStyle}>
                {tooltipContent}
            </div>
        )
    }

    const toggleRefLine = (isVisible=false)=>{
        const refLine = document.getElementById(config.id.verticalRefLine);
        refLine.classList.toggle('hide', !isVisible);
    };

    const decodeWindForce = (force=0, ifGettingLabel=false)=>{
        const description = force ? WindLayerConfig.uniqueValueInfos[force].description : '';
        const label = force ? WindLayerConfig.uniqueValueInfos[force].label : '';
        return ifGettingLabel ? label : description;
    }

    useEffect(()=>{
        // console.log('component did mount', containerDivRef);
    },[]);

    // svg is ready, draw chart if data is available
    useEffect(()=>{
        if(svg){
            // console.log('svg is ready, call init scales');
            draw();
        }
    }, [svg]);

    // draw chart when data is updated
    useEffect(()=>{

        if(!data){
            return;
        }

        if(!svg){
            // need to init the svg first
            initSvg();
        } else {
            draw();
        }

    }, [data]);

    useEffect(()=>{
        if(svg){
            updateVerticalRefLinePos();
            showTooltip();

            if(!tooltipData){
                toggleRefLine(false);
            }
        }
    }, [verticalRefLineXPos, tooltipData]);

    return (
        <div style={{position: 'relative'}}>
            { getTooltipText() }
            <div id={containerID} ref={containerDivRef}
                style={{
                    width: containerWidth,
                    height: containerHeight,
            }}></div>
        </div>

    );
};