'use strict';

import './style.scss';

import React from 'react';
import * as d3 from 'd3';

import WindLayerConfig from '../../data/WindGustLayerConfig';

class WindChart extends React.PureComponent {

    constructor(props){
        super(props);

        this.svg = null;
        this.height = 0;
        this.width = 0;
        
        // console.log('init Wind Chart', this.props);
    };

    drawChart(){
        const svg = this.svg;
        const height = this.height;
        const width = this.width;
        const fieldNameForXAxis = this.props.fieldNameForXAxis;
        const fieldNameForYAxis = this.props.fieldNameForYAxis;

        // parse the date / time
        const parseTime = d3.isoParse;

        const xAxisValues = [];

        const data = this.props.data.map((d, i)=>{
            d[fieldNameForXAxis] = parseTime(d[fieldNameForXAxis]);

            if(i%5 === 0){
                xAxisValues.push(d[fieldNameForXAxis]);
            }

            return d;
        });

        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        const xAxis = d3.axisBottom()
            .scale(x)
            .tickValues(xAxisValues)
            .tickFormat(d3.timeFormat("%a %-I %p"));

        const yAxis = d3.axisLeft()
            .scale(y)
            .tickValues([0, 3, 6, 9, 12, 15])
            .tickFormat(d =>{ return this.decodeWindForce(d); })
            .ticks(5);

        const valueline = d3.line()
            .x(function(d) { return x(d[fieldNameForXAxis]); })
            .y(function(d) { return y(d[fieldNameForYAxis]); });
      
        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d[fieldNameForXAxis]; }));
        y.domain([0, 16]);
      
        // Add the valueline path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);
      
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
    };

    updateChart(){
        
    }

    initSvg(){
        const container = document.getElementById(this.props.id);

        const margin = this.props.margin || {top: 5, right: 20, bottom: 20, left: 80};
        const width = container.offsetWidth - margin.left - margin.right;
        const height = container.offsetHeight - margin.top - margin.bottom;

        const svg = d3.select("#" + this.props.id).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        this.svg = svg;
        this.height = height;
        this.width = width;
    };

    decodeWindForce(force=0){
        const label = force ? WindLayerConfig.uniqueValueInfos[force].label : '';
        return label;
    }

    componentDidUpdate(prevProps){

        if(prevProps.data !== this.props.data){
            console.log('WindChart chart data is updated', this.props.data);
            this.drawChart();
        }
    }

    componentDidMount(){
        this.initSvg();
    };

    render(){
        return (
            <div id={this.props.id} className='wind-chart-div'
                style={{
                    width: this.props.width,
                    height: this.props.height,
            }}></div>
        );
    };

};

export default WindChart;