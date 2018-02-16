// Note: Variables in this file use '_sw' suffixes standing for 'sideways'

// Years are 2009, 2010, and 2011 respectively 
var data_sw = [80, 72, 69];

var margin_sw = {top: 30, right: 20, bottom: 20, left:97};
var width_sw = 800 - margin_sw.left - margin_sw.right;
var height_sw = 200 - margin_sw.top - margin_sw.bottom;

var svg_sw = d3.select("#sideways").append("svg")
    .attr("width", width_sw + margin_sw.left + margin_sw.right)
    .attr("height", height_sw + margin_sw.top + margin_sw.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin_sw.left + "," + margin_sw.top + ")");

var color_data_sw = ["ff0000", "000000"]

svg_sw.selectAll("square_colored").data(color_data_sw).enter()
  .append("rect")
    .style("fill", function(d) { return "#" + d; })
    .attr("class", "square_colored")
    .attr("id", function(d, i) { return ("square_colored" + i)})
    .attr("x", function(d, i) { return 470 + 30*i; })
    .attr("width", 20)
    .attr("y", -28)
    .attr("height", 20)

var x_sw = d3.scaleLinear()
      .range([width_sw, 0]);

var y_sw = d3.scaleBand()
      .range([0, height_sw])    
      .padding(0.35);

x_sw.domain([0, 100]);
y_sw.domain(data_sw.map(function(d, i) { return i + 2009 }));

var barL_sw = svg_sw.selectAll("#bar_left").data(data_sw).enter()
  .append("rect")
    .style("fill", "red")
    .style("cursor", "pointer")
    .attr("id", "bar_left")
    .attr("x", 0)
    .attr("width", function(d) { return width_sw - x_sw(d); })
    .attr("y", function(d, i) { return y_sw(i + 2009); })
    .attr("height", y_sw.bandwidth())
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

svg_sw.selectAll("#bar_left").data(data_sw).enter()
  .append("text")
    .attr("x", 10)
    .attr("y", function(d, i) { return y_sw(i + 2009) + y_sw.bandwidth()/2 + 7; })
    .style("fill", "white")
    .style("font-size", "24px")
    .text(function(d) { return d; });

svg_sw.selectAll("#bar_right").data(data_sw).enter()
  .append("rect")
    .style("fill", "black")
    .style("cursor", "pointer")
    .attr("id", "bar_right")
    .attr("x", function(d) { return width_sw - x_sw(d); })
    .attr("width", function(d) { return x_sw(d); })
    .attr("y", function(d, i) { return y_sw(i + 2009); })
    .attr("height", y_sw.bandwidth())
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

svg_sw.selectAll("#bar_right").data(data_sw).enter()
  .append("text")
    .attr("x", width_sw-30)
    .attr("y", function(d, i) { return y_sw(i + 2009) + y_sw.bandwidth()/2 + 7; })
    .style("fill", "white")
    .style("font-size", "24px")
    .text(function(d) { return 100 - d; });

svg_sw.append("g")
    .attr("class", "axisL")
    .call(d3.axisLeft(y_sw)
       .ticks(3));
