'use strict';

import './style.scss';

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import WindLayerConfig from '../../data/WindGustLayerConfig';

const config = {
    windTicks :[ 2, 4, 6, 8, 10, 12, 14, 16 ],
    class_name: {
        svg: 'wind-chart-svg'
    }
};

export default function WindChart({
    containerID='',
    containerWidth='',
    containerHeight='',

    fieldNameForXAxis = '',
    fieldNameForYAxis = '',
    data = []
}={}){

    const containerDivRef = useRef(null);
   
    const [ svg, setSvg ] = useState(null);
    const [ width, setWidth ] = useState(0);
    const [ height, setHeight ] = useState(0);
    const [ scales, setScales ] = useState({});
    const [ axis, setAxis ] = useState({});
    const [ verticalRefLine, setVerticalRefLine ] = useState(null);
    const [ verticalRefLineXPos, setVerticalRefLineXPos ] = useState(0);

    const initSvg = ()=>{

        const container = containerDivRef.current;
        const margin = {top: 5, right: 20, bottom: 20, left: 80};
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
            .on("mouseenter", mouseOverHandler)
            .on("mouseleave", mouseOutHandler)
            .on("mousemove", function(evt){
                // console.log(this, evt);
                const mousePosX = d3.mouse(this)[0];
                const invertVal = scales.x.invert(mousePosX);
                // console.log(invertVal);
                mouseMoveHandler(invertVal);
            });
    };

    const initVerticalRefLine = ({
        svg = null,
        height = 0
    }={})=>{
        const refLine = svg.append('line')
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

    const draw = ()=>{

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

        const lines = svg.selectAll('.line');

        // check the number of existing lines, if greater than 0; remove all existing ones
        if(lines.size()){
            lines.remove().exit();
        }

        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);
    };

    const mouseOverHandler = ()=>{

    };

    const mouseOutHandler = ()=>{

    };

    const mouseMoveHandler = (val=0)=>{
        
        // const valByXPos = scales.x.invert(xPos);
        // console.log(xPos, valByXPos);
        console.log(data);
    };

    const showTooltip = ()=>{

    };

    const hideTooltip = ()=>{

    };

    const decodeWindForce = (force=0)=>{
        const description = force ? WindLayerConfig.uniqueValueInfos[force].description : '';
        return description;
    }

    useEffect(()=>{
        // console.log('component did mount', containerDivRef);
    },[]);

    // svg is ready, draw chart if data is available
    useEffect(()=>{
        if(svg && data.length){
            // console.log('svg is ready, call init scales');
            draw();
        }
    }, [svg]);

    // draw chart when data is updated
    useEffect(()=>{

        if(!data || !data.length){
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
            console.log('update verticalRefLineXPos');
        }
    }, [verticalRefLineXPos]);

    return (
        <div id={containerID} ref={containerDivRef}
            style={{
                width: containerWidth,
                height: containerHeight,
        }}></div>
    );
};