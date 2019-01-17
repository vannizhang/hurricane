import './style.scss';

import * as d3 from 'd3';

export default function(){

    const init = ()=>{
        console.log('init view for weather viewer');
    };

    const render = (data, chartType)=>{

        const container = document.getElementById("chartDiv");
        container.innerHTML = '';

        chartType = chartType || 'precip';

        var margin = {top: 20, right: 20, bottom: 70, left: 40},
            width = 600 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        // Parse the date / time
        var	parseDate = d3.isoParse
        var x = d3.scaleBand().rangeRound([0, width], .05).padding(0.1);
        var y = d3.scaleLinear().range([height, 0]);

        var xAxis = d3.axisBottom()
            .scale(x)
            .tickFormat(d3.timeFormat("%Y-%m-%d"));

        var yAxis = d3.axisLeft()
            .scale(y)
            .ticks(10);

        var svg = d3.select("#chartDiv").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // console.log('chart data before process', data);

        data = chartType === 'precip' 
        ? data.map((d)=>{
            return {
                date: parseDate(d.fromdate),
                value: d.data && d.data.category ? +d.data.category : 0
            }
        })
        : data.map((d)=>{
            // console.log(d.data, d.data.force);
            return {
                date: parseDate(d.fromdate),
                value: d.data.force
            }
        });

        // console.log('chart data after process', data);

        x.domain(data.map(function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.value; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-90)" );

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
            // .append("text")
            // .attr("transform", "rotate(-90)")
            // .attr("y", 6)
            // .attr("dy", ".71em")
            // .style("text-anchor", "end")
            // .text(chartType);

        svg.selectAll("bar")
            .data(data)
            .enter().append("rect")
            .style("fill", "steelblue")
            .attr("x", function(d) { return x(d.date); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .on('click', function(d){
                console.log('chart on click >>>', d.date.getTime(), d.date);
            });

    };

    const initEventHandler = ()=>{

    };

    return {
        init,
        render
    }
};