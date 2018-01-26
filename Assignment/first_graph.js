var data = [6.0, 6.9, 7.0, 7.3, 6.9, 7.3, 9.5, 11.8, 10.5, 10.1, 9.2];

var margin = {top: 20, right: 20, bottom: 30, left:40};
var w = 800 - margin.left - margin.right;
var h = 500 - margin.top - margin.bottom;

var x = d3.scaleBand()
      .range([0, w])    
      .padding(0.5);

var y = d3.scaleLinear()
      .range([h, 0]);

var svg = d3.select("body").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

x.domain(data.map(function(d, i) { return i + 2001 }));
y.domain([0, d3.max(data, function(d) { return d }) + 1]);

svg.selectAll("line.horizontalGrid").data(y.ticks(6)).enter()
    .append("line")
        .attr("class", "horizontalGrid")
        .attr("x1", margin.left/4)
        .attr("x2", w)
        .attr("y1", function(d){ return y(d);})
        .attr("y2", function(d){ return y(d);})
        .attr("stroke", "grey")
        .attr("stroke-width", "2px");

svg.selectAll("bar")
    .data(data)
  .enter()
  .append("rect")
    .style("fill", "red")
    .attr("class", "bar")
    .attr("x", function(d, i) { return x(i + 2001); })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d); })
    .attr("height", function(d) { return h - y(d); });

svg.append("g")
    .attr("class", "axisB")
    .attr("transform", "translate(0," + h + ")")
    .call(d3.axisBottom(x));

svg.append("g")
    .attr("class", "axisL")
    .call(d3.axisLeft(y)
       .ticks(6));

