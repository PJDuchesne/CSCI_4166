var margin = {top: 20, right: 20, bottom: 20, left:97};
var w = 800 - margin.left - margin.right;
var h = 250 - margin.top - margin.bottom;

var svg = d3.select("#Semi_Circles").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

var dataset = [70, 65, 38, 35, 26];

tau = 2*Math.PI;

var myArc_sc = d3.arc()
    .innerRadius(52)
    .outerRadius(70)
    .startAngle(0.5*tau);

function arcTween(d) {

    var old_value;      // Stores value to return to
    d3.select(this)
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
                var i = d3.interpolate(d.endAngle, old_value);
                return function (t) {
                    d.endAngle =  i(t);
                    return myArc_sc(d);
                };
            })
}

svg.selectAll("path.myArc").data(dataset).enter()
  .append("path")
    .datum( function(d) { return {endAngle: (d/100+0.5)*tau}; })
    .style("fill", "red")
    .attr("class", "path.myArc")
    .attr("d", myArc_sc)
    .attr("transform", function(d,i) { return "translate(" + (20+i*(160-3*i)) + ", 80)";})
    .on("click", arcTween);

svg.selectAll("path.myArc").data(dataset).enter()
  .append("text")
    .attr("x", function(d, i) { return (25+i*(160-3*i)) })
    .attr("y", 150)
    .style("font-size", "24px")
    .text(function(d) {return d;});
