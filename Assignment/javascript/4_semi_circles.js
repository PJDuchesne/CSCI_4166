// Note: Variables in this file use '_sc' suffixes standing for 'semi circles'

// Define margin, width and height for SVG canvas
var margin_sc = {top: 20, right: 20, bottom: 20, left:97};
var width_sc = 800 - margin_sc.left - margin_sc.right;
var height_sc = 250 - margin_sc.top - margin_sc.bottom;

// Define data for arcs
var data_sc = [70, 65, 38, 35, 26];

// Define tau for ease of readability
tau = 2*Math.PI;

// Create SVG canvas
var svg_sc = d3.select("#Semi_Circles").append("svg")
    .attr("width", width_sc + margin_sc.left + margin_sc.right)
    .attr("height", height_sc + margin_sc.top + margin_sc.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin_sc.left + "," + margin_sc.top + ")");

// Define arc function
var myArc_sc = d3.arc()
    .innerRadius(52)
    .outerRadius(70)
    .startAngle(0.5*tau);

// Define function for transition
function arcTween_sc(d, i) {
    var old_value;      // Stores value to return to
    d3.select(this)
        .attr("fill", "green")
        .transition()
            .attrTween("d", function (d) {
                old_value = d.endAngle;
                var i = d3.interpolate(d.endAngle, 0.5*tau);
                return function (t) {
                    d.endAngle =  i(t);
                    return myArc_sc(d);
                };
            })
        .transition().delay(1000)
            .attrTween("d", function (d) {
                var i = d3.interpolate(d.endAngle, tau-old_value);
                return function (t) {
                    d.endAngle =  i(t);
                    return myArc_sc(d);
                };
            })

    d3.select("#myArc_sc_text" + i)
        .transition()
            .delay(1000)
            .duration(500)
            .attr("transform", (d.text_flag ? "translate(-30, 0)" : "translate(0, 0)"))

    d.text_flag = 1 - d.text_flag
}

// Append arcs with transition to the svg canvas
svg_sc.selectAll("path.myArc").data(data_sc).enter()
  .append("path")
    // Note the inclusion of the text_flag, used to toggle text back and forth during transition
    .datum( function(d) { return {endAngle: (d/100+0.5)*tau, text_flag: 1}; })
    .style("fill", "red")
    .style("cursor", "pointer")
    .attr("class", "path.myArc")
    .attr("d", myArc_sc)
    .attr("transform", function(d,i) { return "translate(" + (20+i*(160-3*i)) + ", 80)";})
    .on("click", arcTween_sc);

// Append text to each arc in the appropriate position
svg_sc.selectAll("path.myArc").data(data_sc).enter()
  .append("text")
    .attr("id", function(d, i) { return "myArc_sc_text" + i})
    .attr("x", function(d, i) { return (25+i*(160-3*i)) })
    .attr("y", 150)
    .style("font-size", "24px")
    .text(function(d) {return d;});
