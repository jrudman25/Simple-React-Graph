/*
 * BarChart component JS code
 */

import './BarChart.css';
import React, {useEffect} from 'react';
import { Box } from '@mui/system';
import * as d3 from 'd3';

// svg element
let svg = null;

// Indicator of the didMount stage
let didMount = true;

// Settings and constants used in the code
let settings = {
    bars: { // Bars
        height: 80,
        heightZero: 0.15,
        ratio: 0.7,
        width: 90,
        x: 10,
        y: 10
    },
    labels: { // Labels: x-axis
        baseline: 7,
        baselineName: 2,
        height: 10,
        width: 90,
        x: 10,
        y: 90,
    },
    lines: { // Lines
        margin: 1.5
    },
    title: { // Title
        baseline: 5,
        height: 10,
        width: 95,
        x: 5,
        y: 0
    },
    tooltip: { // Tooltip
        height: 8,
        padding: 2,
        spacing: "1.2em",
        width: 24
    },
    values: { // Values: y-axis
        baseline: 9.5,
        baselineName: 2,
        height: 90,
        min: null,
        max: null,
        step: null,
        width: 5,
        x: 5,
        y: 10
    },
    viewBox: { // svg container
        height: 100,
        width: 100,
        x: 0,
        y: 0
    }
};

const BarChart = (props) => {
    // Create the reference to the Box container
    let myReference = React.createRef();

    // Sets the reference and creates the svg element
    const init = () => {
        let container = d3.select(myReference.current);
        svg = container
            .append("svg")
            .attr("viewBox", settings.viewBox.x + " " + settings.viewBox.y + " " + settings.viewBox.width + " " + settings.viewBox.height)
            .attr("preserveAspectRatio", "none");
    }

    useEffect(() => {
        // ComponentDidMount check
        if (didMount) {
            didMount = false;
            init();
        }
        // If dataset not provided then return
        if (props.dataset == null) {
            return;
        }
        // Get the values of the second attribute in data points
        let values = [];
        for (const item of props.dataset.data) {
            values.push(Object.values(item)[1]);
        }
        // Calculate min and max values of the second attribute
        let min = Math.floor(Math.min(...values));
        let max = Math.ceil(Math.max(...values));
        // Determine the step size based on the range of values of the second attribute
        let step = 0.5 * Math.pow(10, (max - min).toString().length - 1);
        if ((max - min) / step < 10) {
            step *= 0.4;
        }
        // Use props values for settings' min, max, and step values if props values are numbers greater than (or equal) zero
        settings.values.min = isNaN(props.min) || props.min < 0 ? min : props.min;
        settings.values.max = isNaN(props.max) || props.max <= 0 ? max : props.max;
        settings.values.step = isNaN(props.step) || props.step <= 0 ? step : props.step;
        // If settings max is smaller or equal to settings min, revert to calculated values
        if (settings.values.max <= settings.values.min) {
            settings.values.min = min;
            settings.values.max = max;
        }
        // Draw the bar chart
        paint();
    });

    const paint = () => {
    // Creates a tooltip
    const createTooltip = (s) => {
            let t = s
                .append("g")
                .attr("id", "tooltip")

            t
                .append("rect")
                .attr("width", settings.tooltip.width)
                .attr("height", settings.tooltip.height)

            let text = t
                .append("text")

            text
                .append("tspan")
                .attr("id", "attribute1")
                .attr("x", settings.tooltip.padding)
                .attr("dy", "1.2em");

            text
                .append("tspan")
                .attr("id", "attribute2")
                .attr("x", settings.tooltip.padding)
                .attr("dy", settings.tooltip.spacing);

            return t;
        }
    // Sets the tooltip text
    const setTooltip = (t, i) => {
            let o = props.dataset.data[i];
            let w1 = t.select("#attribute1").text(Object.keys(o)[0] + ": " + Object.values(o)[0]).node().getBBox().width;
            let w2 =  t.select("#attribute2").text(Object.keys(o)[1] + ": " + Object.values(o)[1]).node().getBBox().width;
            settings.tooltip.width = Math.max(w1, w2) + 2 * settings.tooltip.padding;
            t
                .select("rect")
                .attr("width", settings.tooltip.width)
                .attr("height", settings.tooltip.height)
        }
    // Positions the tooltip
    const transformTooltip = (t, xy) => {
            let tx = xy[0] - settings.tooltip.width - 1;
            if (tx < 0) {
               tx = 0;
            }
            let ty = xy[1] - settings.tooltip.height - 1;
            if (ty < 0) {
                ty = 0;
            }
            t.attr("transform", "translate(" + tx + "," + ty + ")");
        }

    // Clear the svg element: remove all other elements created before the update
    svg
        .selectAll("*")
        .remove();

    // Sets the constants used in multiple locations
    const linesStep = (settings.values.max - settings.values.min) / settings.values.step;
    const barsScaleX = settings.bars.width / (props.dataset.data.length + 1 - settings.bars.ratio);
    const barsScaleY = settings.bars.height / (settings.values.max - settings.values.min);
    const keys = props.dataset.data.length > 0 ? Object.keys(props.dataset.data[0]) : null;

    // Shows the lines
    svg
        .append("g")
        .attr("id", "lines")
        .selectAll("line")
        .data(d3.range(linesStep))
        .enter()
        .append("line")
        .attr("x1", settings.values.x + settings.values.width)
        .attr("x2", settings.values.x + settings.values.width + settings.bars.width - settings.lines.margin )
        .attr("y1", (item, index) => {
            return settings.labels.y - index * settings.bars.height / linesStep;
        })
        .attr("y2", (item, index) => {
            return settings.labels.y - index * settings.bars.height / linesStep;
        });

    // Shows the bars
    svg
        .append("g")
        .attr("id", "bars")
        .selectAll("rect")
        .data(props.dataset.data)
        .enter()
        .append("rect")
        .attr("x", (item , index) => {
            return settings.bars.x + (1 - settings.bars.ratio + index) * barsScaleX;
        })
        // Sets the bar position
        // If the value is at min or below, the bottome of the bar area is selected
        .attr("y", (item) => {
            let height = (Object.values(item)[1] - settings.values.min) * barsScaleY;
            if (height <= 0 ) {
                height = 0;
            }
            return settings.bars.y + settings.bars.height - height;
        })
        .attr("width", settings.bars.ratio * barsScaleX)
        // Sets the bar height
        // If the value is at min or below, a narrow strip is shown
        .attr("height", (item) => {
            let height = (Object.values(item)[1] - settings.values.min) * barsScaleY;
            if (height <= 0 ) {
                height = settings.bars.heightZero;
            }
            return height;
        })
        // Sets the value of the dataPointIndex attribute
        .attr("dataPointIndex", (item , index) => {
            return index;
        })
        // Sets the color of a bar based on the selection status, red if selected, otherwise dodgerblue
        .style("fill", (item , index) => {
            return props.selection != null && props.selection.includes(index) ? "red" : "dodgerblue";
        })
        // Invokes the onSelect handle when a bar is clicked on
        .on("click", (e) => {
            if (props.onSelect != null) {
                let event = {};
                event.target = {};
                event.target.dataPointIndex = parseInt(e.target.attributes.dataPointIndex.value);
                props.onSelect(event);
            }
        })
        // When the pointer enters a bar area, the tooltip becomes visible (after setting its text and position)
        .on("mouseenter", (e) => {
            setTooltip(tooltip, parseInt(e.target.attributes.dataPointIndex.value));
            transformTooltip(tooltip, d3.pointer(e));
            tooltip.style("visibility", "visible");
        })
        // Moves the tooltip based on the poitner position
        .on("mousemove", (e) => {
            transformTooltip(tooltip, d3.pointer(e));
        })
        // When the pointer leaves a bar area, the tooltip becomes invisible
        .on("mouseleave", (e) => {
            tooltip.style("visibility", "hidden");
        });

        // Shows the dataset title
        svg
            .append("g")
            .attr("id", "title")
            .append("text")
            .attr("x", (settings.title.x + settings.title.width) / 2)
            .attr("y", settings.title.y + settings.title.height - settings.title.baseline)
            .text(props.dataset.title == null ? "" : props.dataset.title);

        // Shows the data points values of the first attribute on x-axis
        svg
            .append("g")
            .attr("id", "labels")
            .selectAll("text")
            .data(props.dataset.data)
            .enter()
            .append("text")
            .attr("x", (item , index) => {
                return settings.labels.x + (1 - settings.bars.ratio + index + settings.bars.ratio / 2) * barsScaleX;
            })
            .attr("y", settings.labels.y + settings.labels.height - settings.labels.baseline)
            .text((item) => {
                return Object.values(item)[0];
            });

        // Shows the name of the first attribute on x-axis
        svg
            .select("#labels")
            .append("text")
            .attr("id", "name")
            .attr("x", settings.labels.x + settings.labels.width / 2)
            .attr("y", settings.labels.y + settings.labels.height - settings.labels.baselineName)
            .text(keys == null? "" : keys[0]);

        // Shows the data points values of the second attribute on x-axis
        svg
            .append("g")
            .attr("id", "values")
            .selectAll("text")
            .data(d3.range((settings.values.max - settings.values.min) / settings.values.step))
            .enter()
            .append("text")
            .attr("x", settings.values.x + settings.values.width / 2)
            .attr("y", (item, index) => {
                return settings.values.y + settings.values.height - settings.values.baseline - index * settings.bars.height / ((settings.values.max - settings.values.min) / settings.values.step);
            })
            .text((item) => {
                return (settings.values.min + item * settings.values.step).toFixed(1);
            });

        // Shows the name of the second attribute on y-axis
        svg
            .select("#values")
            .append("text")
            .attr("id", "name")
            .attr("x", settings.values.baselineName)
            .attr("y", settings.values.y + settings.values.height / 2)
            .text(keys == null ? "": keys[1]);

        let tooltip = createTooltip(svg);
    }

    // Returns the Box container
    return(
        <Box ref={myReference} sx={props.sx} >
        </Box>
    );

}

export default BarChart;
