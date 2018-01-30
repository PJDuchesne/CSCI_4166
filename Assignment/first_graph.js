var data = [6.0, 6.9, 7.0, 7.3, 6.9, 7.3, 9.5, 11.8, 10.5, 10.1, 9.2];

var margin = {top: 20, right: 20, bottom: 30, left:40};

var w = 800 - margin.left - margin.right;
var h = 500 - margin.top - margin.bottom;

var x_fg = d3.scaleBand()
      .range([0, w])    
      .padding(0.5);

var y_fg = d3.scaleLinear()
      .range([h, 0]);

var svg_fg = d3.select("body").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

x_fg.domain(data.map(function(d, i) { return i + 2001 }));
y_fg.domain([0, d3.max(data, function(d) { return d }) + 1]);

svg_fg.selectAll("line.horizontalGrid").data(y_fg.ticks(6)).enter()
    .append("line")
        .attr("class", "horizontalGrid")
        .attr("x1", margin.left/4)
        .attr("x2", w)
        .attr("y1", function(d){ return y_fg(d);})
        .attr("y2", function(d){ return y_fg(d);})
        .attr("stroke", "grey")
        .attr("stroke-width", "2px");

var f1 = d3.format(".1f");

svg_fg.selectAll("bar")
    .data(data)
  .enter()
  .append("rect")
    .style("fill", "red")
    .attr("class", "bar")
    .attr("x", function(d, i) { return x_fg(i + 2001); })
    .attr("width", x_fg.bandwidth())
    .attr("y", function(d) { return y_fg(d); })
    .attr("height", function(d) { return h - y_fg(d); })
    .on("mouseover", function(d, i) { 
        x_fg.padding(0.3)

        svg_fg.append("text")
            .attr("class", "temp")
            .attr("x", x_fg(i + 2001) + (d < 10 ? 10 : 4))
            .attr("y", y_fg(d) + 30)
            .style("fill", "White")
            .style("font-size", "28px")
            .text(f1(d))

        d3.select(this).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .style("fill", "black")
            .attr("width", x_fg.bandwidth())
            .attr("x", x_fg(i + 2001))

    })
    .on("mouseout", function(d, i) { 
        x_fg.padding(0.5)
        d3.select("text.temp").remove()
        d3.select(this).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .style("fill", "red")
            .attr("width", x_fg.bandwidth())
            .attr("x", x_fg(i + 2001))
         });


svg_fg.append("g")
    .attr("class", "axisB")
    .attr("transform", "translate(0," + h + ")")
    .call(d3.axisBottom(x_fg));

svg_fg.append("g")
    .attr("class", "axisL")
    .call(d3.axisLeft(y_fg)
       .ticks(6));
