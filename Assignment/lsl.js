var w = 400;
var h = 26;

// This flag is silly in the context of how javascript creates and stored variables
// This logic is required for modularly usingly this piece of code so that the second time
    // the correct div is selected
var svg = d3.select("#line_star_line" + ((typeof silly_js_flag == 'undefined') ? "1" : "2")).append("svg")
    .attr("width", w)
    .attr("height", h);

var lineL = [ { "x": 0, "y": h/2 }, { "x": w/2-15, "y": h/2} ];

var star =  [ { "x": 195, "y": 10 }, { "x": 198, "y": 11},
              { "x": 200, "y": 8  }, { "x": 202, "y": 11},
              { "x": 205, "y": 10 }, { "x": 203, "y": 14},
              { "x": 204, "y": 17 }, { "x": 200, "y": 15},
              { "x": 196, "y": 17 }, { "x": 197, "y": 14} ];

var lineR = [ { "x": w/2+15, "y": h/2 }, { "x": w, "y": h/2} ];

var linefunction = d3.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

svg.append("path")
    .attr("d", linefunction(lineL))
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("fill", "none");

svg.append("path")
    .attr("d", linefunction(star))
    .attr("stroke", "red")
    .attr("stroke-width", 0)
    .attr("fill", "red")
    .on("mouseover", function(d) { d3.select(this).attr("fill", "black"); })
    .on("mouseout", function(d) { d3.select(this).attr("fill", "red"); });

svg.append("path")
    .attr("d", linefunction(lineR))
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("fill", "none");

var silly_js_flag = 1;
