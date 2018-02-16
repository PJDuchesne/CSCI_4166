// Note: Variables in this file use '_lsl' suffixes standing for 'line star line'

// Defining width and height for the drawing
var width_lsl = 400;
var height_lsl = 26;

var svg_lsl = d3.select("#line_star_line" + ((typeof awful_practice_js_flag == 'undefined') ? "1" : "2")).append("svg")
    .attr("width", width_lsl)
    .attr("height", height_lsl);

// Define data points to draw to create the lineLeft, star, then lineRight
var lineLeft_data = [ { "x": 0, "y": height_lsl/2 }, { "x": width_lsl/2-15, "y": height_lsl/2} ];

var star_data =  [ { "x": 195, "y": 10 }, { "x": 198, "y": 11},
                   { "x": 200, "y": 8  }, { "x": 202, "y": 11},
                   { "x": 205, "y": 10 }, { "x": 203, "y": 14},
                   { "x": 204, "y": 17 }, { "x": 200, "y": 15},
                   { "x": 196, "y": 17 }, { "x": 197, "y": 14} ];

var lineRight_data = [ { "x": width_lsl/2+15, "y": height_lsl/2 }, { "x": width_lsl, "y": height_lsl/2} ];

// A simple d3 line function to render the data points 
var linefunction_lsl = d3.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

// Render the data points using the line function
svg_lsl.append("path")
    .attr("d", linefunction_lsl(lineLeft_data))
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("fill", "none");

svg_lsl.append("path")
    .attr("d", linefunction_lsl(star_data))
    .attr("stroke", "red")
    .attr("stroke-width", 0)
    .attr("fill", "red")
    .on("mouseover", function(d) { d3.select(this).attr("fill", "black"); })
    .on("mouseout", function(d) { d3.select(this).attr("fill", "red"); });

svg_lsl.append("path")
    .attr("d", linefunction_lsl(lineRight_data))
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("fill", "none");

// This flag is awful practice because this is a very hackneyed way to do this.
// This logic is required for modularly usingly this piece of code so that the second time
    // the correct div is selected
var awful_practice_js_flag = 1;
