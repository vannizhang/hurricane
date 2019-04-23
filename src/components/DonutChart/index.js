'use strict';

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function DonutChart({
    containerID='',
    containerWidth='',
    containerHeight='',
    // by default, use 0 as the thicknessRatio to create a pei chart. If thicknessRatio is greater than 0 and smaller than 1, it will create a donut chart
    // the value should between 0 and 1
    thicknessRatio = 0,
    fieldName = '',
    data = []
}={}){

    const containerDivRef = useRef(null);

    const [ svg, setSvg ] = useState(null);
    const [ radius, setRadius ] = useState(0);

    const initSvg = ()=>{

        const marginRatio = 1;
        const container = containerDivRef.current;
        const width = container.offsetWidth * marginRatio;
        const height = container.offsetHeight * marginRatio;
        const radius = Math.min(width, height) / 2;

        const svg = d3.select("#" + container.id)
            .append("svg")
                .attr("width", width)
                .attr("height", height)
            .append("g")
                .attr("transform", "translate(" + width/2 + "," + height/2 + ")");
        
        setSvg(svg);
        setRadius(radius);
    };

    const draw = ()=>{

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const arc = d3.arc()
            .innerRadius(radius * thicknessRatio)
            .outerRadius(radius);

        const pie = d3.pie()
            .value(function(d) { return d[fieldName]; })
            .sort(null);

        const g = svg.selectAll(".arc")
            .remove().exit()
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");
      
        g.append("path")
            .attr("d", arc)
            .attr('fill', (d,i) => color(i))
    };

    
    // init svg when component is ready
    useEffect(()=>{
        // console.log('component did mount', containerDivRef);
        initSvg();
    },[]);

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