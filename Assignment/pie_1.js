var w = 800
var h = 350

//              Red       Black     Light Grey
var colors = [ "ff0000", "000000", "e3e3e3", "9c9c9c" ];

var data = [ 4.0, 43.8, 18.4, 33.7 ];

radius = 150;

var myPie = d3.pie()
            .sort(null) // Turn off automatic data sorting
            .value(function(d) { return d; });

var myArc = d3.arc()
              .outerRadius(radius-10)
              .innerRadius(0);

var labelArc = d3.arc()
              .outerRadius(radius-60)
              .innerRadius(radius-60);

var svg = d3.select("#Pie_One").append("svg")
    .attr("width", w)
    .attr("height", h)
      .append("g")
        .attr("transform", "translate(" + 0.25*w + "," + 0.5*h + ")");

var g = svg.selectAll(".slicesLeft").data(myPie(data)).enter()
    .append("g")
        .attr("class", "slicesLeft");

g.append("path")
    .attr("fill", function(d, i) { return "#" + colors[i]; })
    .attr("stroke", "#ffffff") // Add white-space between segments
    .attr("stroke-width", "2") // Define width of white-space
    .attr("d", myArc);

g.append("text")
    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")";})
    .attr("dy", ".35em")        // Centers text nicely
    .style("fill", "White")
    .style("font-size", "36px")
    .text(function(d) { return d.data; });

svg.selectAll("bar.colored").data(colors).enter()
  .append("rect")
    .style("fill", function(d) { return "#" + d; })
    .attr("class", "bar.colored")
    .attr("x", 225)
    .attr("width", 20)
    .attr("y", function(d, i) { return -65+i*35})
    .attr("height", 20)

var text = ["CASUAL GAMES", "ACTION, SPORTS, STRATEGY, ROLE-PLAYING","SHOOTER", "OTHER"];

svg.selectAll("bar.colored").data(text).enter()
    .append("text")
    .attr("transform", function(d, i) { return "translate(255," + (-47+i*35) + ")";})
    .style("font-size", "24px")
    .text(function(d) {return d;})

