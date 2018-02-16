// Note: Variables in this file use '_fg' to signify that it is for the first graph

var data_fg = [6.0, 6.9, 7.0, 7.3, 6.9, 7.3, 9.5, 11.8, 10.5, 10.1, 9.2];

var margin_fg = {top: 20, right: 20, bottom: 30, left:80};

var width_fg = 800 - margin_fg.left - margin_fg.right;
var height_fg = 500 - margin_fg.top - margin_fg.bottom;

var x_fg = d3.scaleBand()
      .range([0, width_fg])
      .padding(0.5);

var y_fg = d3.scaleLinear()
      .range([height_fg, 0]);

var svg_fg = d3.select("#first_graph").append("svg")
    .attr("width", width_fg + margin_fg.left + margin_fg.right)
    .attr("height", height_fg + margin_fg.top + margin_fg.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin_fg.left + "," + margin_fg.top + ")");

x_fg.domain(data_fg.map(function(d, i) { return i + 2001 }));
y_fg.domain([0, d3.max(data_fg, function(d) { return d }) + 1]);

svg_fg.selectAll("line.horizontalGrid").data(y_fg.ticks(6)).enter()
    .append("line")
        .attr("class", "horizontalGrid")
        .attr("x1", margin_fg.left/4)
        .attr("x2", width_fg)
        .attr("y1", function(d){ return y_fg(d);})
        .attr("y2", function(d){ return y_fg(d);})
        .attr("stroke", "black")
        .attr("stroke-width", "1px");

svg_fg.select("line.horizontalGrid")
    .attr("stroke-width", "2px");

var f1 = d3.format(".1f");

// Mutex to avoid mouseover transitions when mousing over the text
var mouseover_fg_flag = 0;

function bar_fg_mouseover(d, i) {
    x_fg.padding(0.3)

    svg_fg.append("text")
        .attr("class", "temp")
        .attr("x", x_fg(i + 2001) + (d < 10 ? 12 : 5))
        .attr("y", y_fg(d) + 30)
        .style("fill", "White")
        .style("font-size", "24px")
        .text(f1(d))
        .on("mouseover", function() { 
            mouseover_fg_flag = 1
            x_fg.padding(0.3)

            d3.select(("#bar_fg" + i)).transition()
                .ease(d3.easeQuadOut)
                .duration(500)
                .style("fill", "black")
                .attr("width", x_fg.bandwidth())
                .attr("x", x_fg(i + 2001))

            // This stub transition fixes a flickering issue in which
            // the text is removed and then readded when mousing over the text
            d3.select(this).transition()
                .style("fill", "white")
        })
        .on("mouseout", function() {
            mouseover_fg_flag = 0
            x_fg.padding(0.5)

            d3.select(("#bar_fg" + i)).transition()
                .ease(d3.easeQuadOut)
                .duration(200)
                .style("fill", "red")
                .attr("width", x_fg.bandwidth())
                .attr("x", x_fg(i + 2001))

            d3.select(this).remove()
        })

    d3.select(("#bar_fg" + i)).transition()
        .ease(d3.easeQuadOut)
        .duration(500)
        .style("fill", "black")
        .attr("width", x_fg.bandwidth())
        .attr("x", x_fg(i + 2001))
}

function bar_fg_mouseout(d, i) {
    if (mouseover_fg_flag) { return }

    x_fg.padding(0.5)

    d3.selectAll("text.temp").transition().duration(1).remove()

    d3.select(("#bar_fg" + i)).transition()
        .ease(d3.easeQuadOut)
        .duration(200)
        .style("fill", "red")
        .attr("width", x_fg.bandwidth())
        .attr("x", x_fg(i + 2001))
}

svg_fg.selectAll("bar")
    .data(data_fg)
  .enter()
  .append("rect")
    .style("fill", "red")
    .attr("class", "bar")
    .attr("id", function(d, i) { return ("bar_fg" + i);})
    .attr("x", function(d, i) { return x_fg(i + 2001); })
    .attr("width", x_fg.bandwidth())
    .attr("y", function(d) { return y_fg(d); })
    .attr("height", function(d) { return height_fg - y_fg(d); })
    .on("mouseover", bar_fg_mouseover )
    .on("mouseout", bar_fg_mouseout )

svg_fg.append("g")
    .attr("class", "axisB")
    .attr("transform", "translate(0," + height_fg + ")")
    .call(d3.axisBottom(x_fg));

svg_fg.append("g")
    .attr("class", "axisL")
    .call(d3.axisLeft(y_fg)
       .ticks(6));


