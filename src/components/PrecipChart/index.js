'use strict';
import './style.scss';

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const config = {
    class_name: {
        svg: 'precip-chart-svg',
        bar_rect: 'precip-chart-bar'
    },
    id: {
        verticalRefLine: 'precipChartVerticalReferenceLine'
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
    const [ verticalRefLine, setVerticalRefLine ] = useState(null);
    const [ verticalRefLineXPos, setVerticalRefLineXPos ] = useState(0);
    const [ tooltipData, setTooltipData ] = useState(null);

    const initSvg = ()=>{

        // console.log('initSvg');

        const container = containerDivRef.current;
        const margin = {top: 5, right: 10, bottom: 20, left: 30};

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

        initOverlayRect({ svg, width, height,  scales});
        // console.log(container, width, height);
    };

    const initScales = (width, height)=>{

        // console.log('initScales');

        const scales = {};

        const x = d3.scaleBand().rangeRound([0, width], .05).padding(0.05);
        scales.x = x;

        const y = d3.scaleLinear().range([height, 0]);
        scales.y = y;

        // setScales(scales);
        return scales;
    };

    const initAxis = (scales)=>{

        // console.log('initAxis');
        
        const axis = {};

        axis.x = d3.axisBottom().scale(scales.x).tickFormat(d3.timeFormat("%a %m/%d"));

        axis.y = d3.axisLeft().scale(scales.y).ticks(5);

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

        // console.log('draw', width, height);

        const parseDate = d3.isoParse;

        data = data.map(item=>{
            return item.map(d=>{
                d[fieldNameForXAxis] = parseDate(d[fieldNameForXAxis]);
                return d;
            })
        })

        const precipAmountData = data[0];
        const precipAccumulationData = data[1];

        updateDomainForXScale(precipAccumulationData);

        updateDomainForYScale(precipAccumulationData);

        updateXAxisTickValues(precipAccumulationData);

        drawXLabels();

        drawYLabels();

        drawBars(precipAmountData);

        drawLines(precipAccumulationData);

    }; 

    const updateDomainForXScale = (data=[])=>{
        scales.x.domain(data.map(function(d) { return d[fieldNameForXAxis]; }));
    };

    const updateDomainForYScale = (data=[])=>{
        const yScaleMax = d3.max(data, function(d) { return d[fieldNameForYAxis]; });
        const yScaleMaxBeautified = beautifyMaxValueForYAxis(yScaleMax);
        scales.y.domain([0, yScaleMaxBeautified]);
    };

    const updateXAxisTickValues = (data=[])=>{

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

    const drawBars = (data=[])=>{

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
            .attr("height", function(d) { return height - scales.y(d[fieldNameForYAxis]); });
            // .on('click', function(d){
            //     console.log('chart on click >>>', d);
            // })
    };

    const drawLines = (data=[])=>{

        const lineClassName = 'precip-chart-line';

        const anyNoneZeroData = data.filter(d=>d.value).length ? true : false;

        const xOffset = scales.x.bandwidth() / 2;

        const valueline = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return scales.x(d[fieldNameForXAxis]) + xOffset; })
            .y(function(d) { return scales.y(d[fieldNameForYAxis]); });

        const lines = svg.selectAll('.' + lineClassName);

        // check the number of existing lines, if greater than 0; remove all existing ones
        if(lines.size()){
            lines.remove().exit();
        }

        if(anyNoneZeroData){
            svg.append("path")
            .data([data])
            .attr("class", lineClassName)
            .attr("d", valueline);
        }

    };

    // const mouseOverHandler = ()=>{

    // };

    // const mouseOutHandler = ()=>{

    // };

    const mouseMoveHandler = ({scales=null, mousePosX=0}={})=>{

        // console.log(mousePosX);
        const precipAmountData = data[0];
        const precipAccumulationData = data[1];
        const xOffset = scales.x.bandwidth() / 2;

        let tooltipDataIdx = null;
        let tooltipPos = null;

        for(let i = 0, len = precipAmountData.length; i < len; i++){

            const currItem = precipAmountData[i];
            const currItemPos = scales.x(currItem[fieldNameForXAxis]) + xOffset;

            const nextItem = precipAmountData[i + 1] ? precipAmountData[i + 1] : currItem;
            const nextItemPos = scales.x(nextItem[fieldNameForXAxis]) + xOffset;

            if(mousePosX >= currItemPos && mousePosX <= nextItemPos){

                const distToCurrItem = mousePosX - currItemPos;
                const distToNextItem = nextItemPos - mousePosX;

                // tooltipData = distToCurrItem < distToNextItem ? currItem : nextItem;
                tooltipDataIdx = distToCurrItem < distToNextItem ? i : i+1;
                tooltipPos = distToCurrItem < distToNextItem ? currItemPos : nextItemPos;

                break;
            }
        }

        const tooltipData = precipAmountData[tooltipDataIdx] && precipAccumulationData[tooltipDataIdx] 
            ? [precipAmountData[tooltipDataIdx], precipAccumulationData[tooltipDataIdx]]
            : null; 

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

    const toggleRefLine = (isVisible=false)=>{
        const refLine = document.getElementById(config.id.verticalRefLine);
        refLine.classList.toggle('hide', !isVisible);
    };

    const getTooltipText = ()=>{
        return (
            <div className='font-size--3 trailer-0 margin-right-1 text-right'>
                Fri 11 PM: 1 inch of rain is expected, totally accumulation is 5 inch
            </div>
        )
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
            updateVerticalRefLinePos();
            showTooltip();

            if(!tooltipData){
                toggleRefLine(false);
            }

            console.log(tooltipData);
        }
    }, [verticalRefLineXPos, tooltipData]);

    return (
        <div>
            {/* { getTooltipText() } */}
            <div id={containerID} ref={containerDivRef} style={{width: containerWidth , height: containerHeight}}></div>
        </div>
    );
};