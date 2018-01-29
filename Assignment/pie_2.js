var w = 400
var h = 350

//              Red       Black     Light Grey
var colors = [ "ff0000", "000000", "e3e3e3" ];

var dataLeft = [ 42, 25, 33 ];

var dataRight = [ 47, 12, 41 ];

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

var svgLeft = d3.select("#Pie_Two").append("svg")
    .attr("width", w)
    .attr("height", h)
      .append("g")
        .attr("transform", "translate(" + 0.5*w + "," + 0.5*h + ")");

var g_left = svgLeft.selectAll(".slicesLeft").data(myPie(dataLeft)).enter()
    .append("g")
        .attr("class", "slicesLeft");

g_left.append("path")
    .attr("fill", function(d, i) { return "#" + colors[i]; })
    .attr("stroke", "#ffffff") // Add white-space between segments
    .attr("stroke-width", "2") // Define width of white-space
    .attr("d", myArc);

g_left.append("text")
    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")";})
    .attr("dy", ".35em")        // Centers text nicely
    .style("fill", "White")
    .style("font-size", "36px")
    .text(function(d) { return d.data; });

var svgRight = d3.select("#Pie_Two").append("svg")
    .attr("width", w)
    .attr("height", h)
      .append("g")
        .attr("transform", "translate(" + 0.5*w + "," + 0.5*h + ")");

var g_right = svgRight.selectAll(".slicesRight").data(myPie(dataRight)).enter()
    .append("g")
        .attr("class", "slicesRight");

g_right.append("path")
    .attr("fill", function(d, i) { return "#" + colors[i]; })
    .attr("stroke", "#ffffff") // Add white-space between segments
    .attr("stroke-width", "2") // Define width of white-space
    .attr("d", myArc);

g_right.append("text")
    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")";})
    .attr("dy", ".35em")        // Centers text nicely
    .attr("dx", "-.35em")        // Centers text nicely
    .style("fill", "white")
    .style("font-size", "36px")
    .style("text-align", "center")
    .text(function(d) { return d.data; });

var svgBottom = d3.select("Body").append("svg")
    .attr("width", w*2)
    .attr("height", h/3)

svgBottom.selectAll("bar.colored").data(colors).enter()
  .append("rect")
    .style("fill", function(d) { return "#" + d; })
    .attr("class", "bar.colored")
    .attr("x", 180)
    .attr("width", 20)
    .attr("y", function(d, i) { return 20+i*35})
    .attr("height", 20)

var text = ["PUZZLE, BOARD GAME, GAME SHOW, TRIVIA, CARD GAMES", "ACTION, SPORTS, STRATEGY, ROLE-PLAYING", "OTHER"];

svgBottom.selectAll("bar.colored").data(text).enter()
    .append("text")
    .attr("transform", function(d, i) { return "translate(205," + (38+i*35) + ")";})
    .style("font-size", "24px")
    .text(function(d) {return d;})

