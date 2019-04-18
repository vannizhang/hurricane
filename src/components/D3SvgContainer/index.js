'use strict';

import React from 'react';
import * as d3 from 'd3';

class D3SvgContainer extends React.PureComponent {

    constructor(props){
        super(props);
        
        this.svg = null;
        // console.log('init D3SvgContainer', this.props);
    };

    initSvg(){
        const containerId = this.props.id;
        const container = document.getElementById(containerId);

        const margin = this.props.margin || {top: 5, right: 10, bottom: 20, left: 30};
        const width = container.offsetWidth - margin.left - margin.right;
        const height = container.offsetHeight - margin.top - margin.bottom;

        const svg = d3.select("#" + containerId).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        this.svg = svg;
    }

    componentDidMount(){
        this.initSvg();
    }

    render(){
        const containerStyle = {
            width: this.props.width,
            height: this.props.height,
        };

        return (<div id={this.props.id} style={containerStyle}></div>);
    };

};

export default D3SvgContainer;