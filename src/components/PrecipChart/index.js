'use strict';
import './style.scss';

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const config = {
    class_name: {
        svg: 'precip-chart-svg',
        bar_rect: 'precip-chart-bar'
    }
};

export default function PrecipChart({
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
        const margin = {top: 5, right: 10, bottom: 20, left: 30};
        const width = container.offsetWidth - margin.left - margin.right;
        const height = container.offsetHeight - margin.top - margin.bottom;

        const svg = d3.select("#" + containerID).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", config.class_name.svg)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        setSvg(svg);
        setWidth(width);
        setHeight(height);

        console.log(container);
    };

    const initScales = ()=>{

        const scales = {};

        const x = d3.scaleBand().rangeRound([0, width], .05).padding(0.05);
        scales.x = x;

        const y = d3.scaleLinear().range([height, 0]);
        scales.y = y;

        setScales(scales);
    };

    const initAxis = ()=>{
        
        const axis = {};

        axis.x = d3.axisBottom().scale(scales.x).tickFormat(d3.timeFormat("%a %m/%d"));

        axis.y = d3.axisLeft().scale(scales.y).ticks(5);

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

        drawBars();
    }; 

    const updateDomainForXScale = ()=>{
        scales.x.domain(data.map(function(d) { return d[fieldNameForXAxis]; }));
    };

    const updateDomainForYScale = ()=>{
        const yScaleMax = d3.max(data, function(d) { return d[fieldNameForYAxis]; });
        const yScaleMaxBeautified = beautifyMaxValueForYAxis(yScaleMax);
        scales.y.domain([0, yScaleMaxBeautified]);
    };

    const updateXAxisTickValues = (data)=>{

        const xAxisValue = {};

        data = data.map(d=>{
            
            const day = d[fieldNameForXAxis].getDay();

            if(!xAxisValue[day]){
                xAxisValue[day] = d[fieldNameForXAxis];
            }

            return d;
        });

        const xAxisTickVals = Object.keys(xAxisValue).map(key=>{
            return xAxisValue[key];
        });

        axis.x.tickValues(xAxisTickVals);
    }

    const drawXLabels = ()=>{
        const xAxisLabel = svg.selectAll('.x.axis');
        if(!xAxisLabel.size()){
            svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(axis.x);
            // .selectAll("text")
            // .style("text-anchor", "end")
            // .attr("dx", "-.8em")
            // .attr("dy", "-.55em")
            // .attr("transform", "rotate(-90)" );
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
            // .append("text")
            // .attr("transform", "rotate(-90)")
            // .attr("y", 6)
            // .attr("dy", ".71em")
            // .style("text-anchor", "end")
            // .text(chartType);
        } else {
            yAxisLabel.call(axis.y);
        }
    };

    const drawBars = ()=>{

        const bars = svg.selectAll('.' + config.class_name.bar_rect);

        //select all bars on the graph, take them out, and exit the previous data set. 
	    //then you can add/enter the new data set
        bars.remove().exit()
            .data(data)
            .enter().append("rect")
            // .style("fill", "rgba(188,218,237,.8)")
            .attr("class", config.class_name.bar_rect)
            .attr("x", function(d) { return scales.x(d[fieldNameForXAxis]); })
            .attr("width", scales.x.bandwidth())
            .attr("y", function(d) { return scales.y(d[fieldNameForYAxis]); })
            .attr("height", function(d) { return height - scales.y(d[fieldNameForYAxis]); })
            .on('click', function(d){
                console.log('chart on click >>>', d);
            })
    };

    const beautifyMaxValueForYAxis = (value=0)=>{
        const beautifiedValues = [.5, 1, 1.5, 2.5, 5, 10, 20];
        let beautifiedVal = 0;

        for(let i = beautifiedValues.length; i >=0; i--){
            if(value < beautifiedValues[i]){
                beautifiedVal = beautifiedValues[i];
            }
        }

        return beautifiedVal || val;
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