var data = [ 72, 105, 120, 145, 157, 170 ];

var margin = {top: 70, right: 20, bottom: 30, left:90};

var w = 800 - margin.left - margin.right;
var h = 400 - margin.top - margin.bottom;

var x_sg = d3.scaleBand()
      .range([0, w])    
      .padding(0.5);

var y_sg = d3.scaleLinear()
      .range([h, 0]);

var svg_sg = d3.select("#second_graph").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

x_sg.domain(data.map(function(d, i) { return i + 2011 }));
y_sg.domain([0, d3.max(data, function(d) { return d }) + 40]);

svg_sg.selectAll("line.horizontalGrid").data(y_sg.ticks(4)).enter()
    .append("line")
        .attr("class", "horizontalGrid")
        .attr("x1", margin.left/4)
        .attr("x2", w)
        .attr("y1", function(d){ return y_sg(d);})
        .attr("y2", function(d){ return y_sg(d);})
        .attr("stroke", "grey")
        .attr("stroke-width", "1px");

svg_sg.select("line.horizontalGrid")
    .attr("stroke-width", "2px");

// Mutex to avoid mouseover transitions when mousing over the text
var mouseover_sg_flag = 0;

function bar_sg_mouseover(d, i) {
    x_sg.padding(0.3)

    svg_sg.append("text")
        .attr("class", "temp")
        .attr("x", x_sg(i + 2011) + (d < 100 ? 25 : 20))
        .attr("y", y_sg(d) + 35)
        .style("fill", "White")
        .style("font-size", "28px")
        .text(d)
        .on("mouseover", function() {
            mouseover_sg_flag = 1
            x_sg.padding(0.3)

            d3.select(("#bar_sg" + i)).transition()
                .ease(d3.easeQuadOut)
                .duration(500)
                .style("fill", "black")
                .attr("width", x_sg.bandwidth())
                .attr("x", x_sg(i + 2011))

            // This stub transition fixes a flickering issue in which
            // the text is removed and then readded when mousing over the text
            d3.select(this).transition()
                .style("fill", "white")
        })
        .on("mouseout", function() {
            mouseover_sg_flag = 0
            x_sg.padding(0.5)

            d3.select(("#bar_sg" + i)).transition()
                .ease(d3.easeQuadOut)
                .duration(200)
                .style("fill", "red")
                .attr("width", x_sg.bandwidth())
                .attr("x", x_sg(i + 2011))

            d3.select(this).remove()
        })

    d3.select(("#bar_sg" + i)).transition()
        .ease(d3.easeQuadOut)
        .duration(500)
        .style("fill", "black")
        .attr("width", x_sg.bandwidth())
        .attr("x", x_sg(i + 2011))
}

function bar_sg_mouseout(d, i) {
    if (mouseover_sg_flag) { return }

    x_sg.padding(0.5)

    d3.selectAll("text.temp").transition().duration(1).remove()

    d3.select(("#bar_sg" + i)).transition()
        .ease(d3.easeQuadOut)
        .duration(200)
        .style("fill", "red")
        .attr("width", x_sg.bandwidth())
        .attr("x", x_sg(i + 2011))
}

svg_sg.selectAll("bar")
    .data(data)
  .enter()
  .append("rect")
    .style("fill", "red")
    .attr("class", "bar")
    .attr("id", function(d, i) { return ("bar_sg" + i)})
    .attr("x", function(d, i) { return x_sg(i + 2011); })
    .attr("width", x_sg.bandwidth())
    .attr("y", function(d) { return y_sg(d); })
    .attr("height", function(d) { return h - y_sg(d); })
    .on("mouseover", bar_sg_mouseover )
    .on("mouseout", bar_sg_mouseout )

svg_sg.append("g")
    .attr("class", "axisB")
    .attr("transform", "translate(0," + h + ")")
    .call(d3.axisBottom(x_sg));

svg_sg.append("g")
    .attr("class", "axisL")
    .call(d3.axisLeft(y_sg)
       .ticks(4));

var snoot = svg_sg.selectAll("snoot").data([0]).enter().append("image")
    .style("cursor", "pointer")
    .attr("class", "snoot")
    .attr("xlink:href", "images/image10.jpg")
    .attr("transform", "translate(480, -85)")
    .on("click", function() { snoot_storm() })

