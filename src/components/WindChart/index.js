'use strict';

import './style.scss';

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import WindLayerConfig from '../../data/WindGustLayerConfig';

const config = {
    windTicks :[ 2, 4, 6, 8, 10, 12, 14, 16 ]
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

    const initSvg = ()=>{

        const container = containerDivRef.current;
        const margin = {top: 5, right: 20, bottom: 20, left: 80};
        const width = container.offsetWidth - margin.left - margin.right;
        const height = container.offsetHeight - margin.top - margin.bottom;

        const svg = d3.select("#" + containerID).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        setSvg(svg);
        setWidth(width);
        setHeight(height);
    };

    const initScales = ()=>{

        const scales = {};

        const x = d3.scaleTime().range([0, width]);
        scales.x = x;

        const y = d3.scaleLinear().range([height, 0]);
        scales.y = y;

        setScales(scales);
    };

    const initAxis = ()=>{
        
        const axis = {};

        axis.x = d3.axisBottom()
            .scale(scales.x)
            // .tickSize(-height)
            .tickFormat(d3.timeFormat("%a %-I %p"));

        axis.y = d3.axisLeft()
            .scale(scales.y)
            // .tickValues([0, 3, 6, 9, 12, 15])
            .tickValues(config.windTicks)
            .tickFormat(d =>{ return decodeWindForce(d); })
            // .tickSize(-width)
            .ticks(5);

        setAxis(axis);
    }

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

    const decodeWindForce = (force=0)=>{
        const label = force ? WindLayerConfig.uniqueValueInfos[force].label : '';
        return label;
    }

    // init svg when component is ready
    useEffect(()=>{
        // console.log('component did mount', containerDivRef);
        initSvg();
    },[]);

    // init scales and axis when svg is ready
    useEffect(()=>{
        initScales();
    }, [svg]);

    // init axis when scales is ready
    useEffect(()=>{
        initAxis();
    }, [scales]);

    // draw chart when data is updated
    useEffect(()=>{
        if(data && data.length && svg){
            draw();
        }
    }, [data]);

    return (
        <div id={containerID} ref={containerDivRef}
            style={{
                width: containerWidth,
                height: containerHeight,
        }}></div>
    );
};