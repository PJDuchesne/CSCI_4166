// Years are 2009, 2010, and 2011 respectively 
var dataset1 = [80, 72, 69];

var margin = {top: 30, right: 20, bottom: 20, left:97};
var w = 800 - margin.left - margin.right;
var h = 200 - margin.top - margin.bottom;

var svg = d3.select("#sideways").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var color_data = ["ff0000", "000000"]

svg.selectAll("square_colored").data(color_data).enter()
  .append("rect")
    .style("fill", function(d) { return "#" + d; })
    .attr("class", "square_colored")
    .attr("id", function(d, i) { return ("square_colored" + i)})
    .attr("x", function(d, i) { return 470 + 30*i; })
    .attr("width", 20)
    .attr("y", -28)
    .attr("height", 20)

var x = d3.scaleLinear()
      .range([w, 0]);

var y = d3.scaleBand()
      .range([0, h*4])    
      .padding(0.35);

x.domain([0, 100]);
y.domain(data.map(function(d, i) { return i + 2009 }));

var barL = svg.selectAll("#bar_left").data(dataset1).enter()
  .append("rect")
    .style("fill", "red")
    .style("cursor", "pointer")
    .attr("id", "bar_left")
    .attr("x", 0)
    .attr("width", function(d) { return w - x(d); })
    .attr("y", function(d, i) { return y(i + 2009); })
    .attr("height", y.bandwidth())
    .on("mousedown", function() {
        d3.select(this)
            .style("cursor", "wait")
            .transition().duration(0).delay(2000)
                .style("cursor", "pointer")

        var goal_r = Math.round((Math.random()*128 + 128), 0)
        var goal_g = Math.round((Math.random()*128 + 128), 0)
        var goal_b = Math.round((Math.random()*128 + 128), 0)
        d3.selectAll("#bar_left").transition().duration(2000).ease(d3.easeLinear)
            .style("fill", ("rgb(" + goal_r + "," + goal_g + "," + goal_b + ")"))
        d3.select("#square_colored0")
            .attr("width", 0)
            .transition().duration(2000).ease(d3.easeLinear)
                .style("fill", ("rgb(" + goal_r + "," + goal_g + "," + goal_b + ")"))
                .attr("width", 20)
        

    })
    .on("mouseup", function() {
        d3.selectAll("#bar_left").interrupt()
        d3.select("#square_colored0").interrupt()
            .attr("width", 20)
        d3.select(this)
            .style("cursor", "pointer")
    })

svg.selectAll("#bar_left").data(dataset1).enter()
  .append("text")
    .attr("x", 10)
    .attr("y", function(d, i) { return y(i + 2009) + y.bandwidth()/2 + 7; })
    .style("fill", "white")
    .style("font-size", "24px")
    .text(function(d) { return d; });

svg.selectAll("#bar_right").data(dataset1).enter()
  .append("rect")
    .style("fill", "black")
    .style("cursor", "pointer")
    .attr("id", "bar_right")
    .attr("x", function(d) { return w - x(d); })
    .attr("width", function(d) { return x(d); })
    .attr("y", function(d, i) { return y(i + 2009); })
    .attr("height", y.bandwidth())
    .on("mousedown", function() {
        d3.select(this)
            .style("cursor", "wait")
            .transition().duration(0).delay(2000)
                .style("cursor", "pointer")

       var goal_r = Math.round((Math.random()*128 + 128), 0)
       var goal_g = Math.round((Math.random()*128 + 128), 0)
       var goal_b = Math.round((Math.random()*128 + 128), 0)
       d3.selectAll("#bar_right").transition().duration(2000).ease(d3.easeLinear)
            .style("fill", ("rgb(" + goal_r + "," + goal_g + "," + goal_b + ")"))
       d3.select("#square_colored1")
            .attr("width", 0)
            .transition().duration(2000).ease(d3.easeLinear)
                .style("fill", ("rgb(" + goal_r + "," + goal_g + "," + goal_b + ")"))
                .attr("width", 20)
            
    })
    .on("mouseup", function() {
        d3.selectAll("#bar_right").interrupt()
        d3.select("#square_colored1").interrupt()
            .attr("width", 20)
        d3.select(this)
            .style("cursor", "pointer")
    })

svg.selectAll("#bar_right").data(dataset1).enter()
  .append("text")
    .attr("x", w-30)
    .attr("y", function(d, i) { return y(i + 2009) + y.bandwidth()/2 + 7; })
    .style("fill", "white")
    .style("font-size", "24px")
    .text(function(d) { return 100 - d; });

svg.append("g")
    .attr("class", "axisL")
    .call(d3.axisLeft(y)
       .ticks(3));
