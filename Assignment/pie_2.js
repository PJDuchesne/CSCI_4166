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

var myArc_p2 = d3.arc()
              .outerRadius(radius-10)
              .innerRadius(0);

/* Used to center text, didn't pan out
var labelArc = d3.arc()
              .outerRadius(radius-60)
              .innerRadius(radius-60);
*/

var svgLeft = d3.select("#Pie_Two").append("svg")
    .attr("width", w)
    .attr("height", h)
      .append("g")
        .attr("transform", "translate(" + 0.5*w + "," + 0.5*h + ")");

var g_left = svgLeft.selectAll(".slicesLeft").data(myPie(dataLeft)).enter()
    .append("g")
        .attr("class", "slicesLeft");

g_left.append("path")
    .attr("class", function(d, i) { return ("pie_left_slice" + i);})
    .attr("fill", function(d, i) { return "#" + colors[i]; })
    .attr("stroke", "#ffffff") // Add white-space between segments
    .attr("stroke-width", "2") // Define width of white-space
    .attr("d", myArc_p2)
    .on("mouseover", function(d, i) {
        myArc_p2.outerRadius(radius+10)
        d3.select("text.pie_left_text" + i).transition()
            .style("font-weight", "bold")
            .style("font-size", "60px")
        d3.select(this).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p2)
    })
    .on("mouseout", function(d, i) {
        myArc_p2.outerRadius(radius-10)
        d3.select("text.pie_left_text" + i).transition()
            .style("font-weight", "normal")
            .style("font-size", "48px")
        d3.select(this).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p2)
    });

g_left.append("text")
    .attr("class", function(d, i) { return ("pie_left_text" + i);})
    // This didn't pan out, these are individually fixed at the end of the script
    // .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")";})
    .style("fill", "White")
    .style("font-size", "48px")
    .text(function(d) { return d.data; })
    .on("mouseover", function(d, i) {
        myArc_p2.outerRadius(radius+10)
        d3.select(this).transition()
            .style("font-weight", "bold")
            .style("font-size", "60px")
        d3.select("path.pie_left_slice" + i).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p2)
    })
    .on("mouseout", function(d, i) {
        myArc_p2.outerRadius(radius-10)
        d3.select("path.pie_left_slice" + i).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p2)
    })

var svgRight = d3.select("#Pie_Two").append("svg")
    .attr("width", w)
    .attr("height", h)
      .append("g")
        .attr("transform", "translate(" + 0.5*w + "," + 0.5*h + ")");

var g_right = svgRight.selectAll(".slicesRight").data(myPie(dataRight)).enter()
    .append("g")
        .attr("class", "slicesRight");

g_right.append("path")
    .attr("class", function(d, i) { return ("pie_right_slice" + i);})
    .attr("fill", function(d, i) { return "#" + colors[i]; })
    .attr("stroke", "#ffffff") // Add white-space between segments
    .attr("stroke-width", "2") // Define width of white-space
    .attr("d", myArc_p2)
    .on("mouseover", function(d, i) {
        myArc_p2.outerRadius(radius+10)
        d3.select("text.pie_right_text" + i).transition()
            .style("font-weight", "bold")
            .style("font-size", "60px")
        d3.select(this).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p2)
    })
    .on("mouseout", function(d, i) {
        myArc_p2.outerRadius(radius-10)
        d3.select("text.pie_right_text" + i).transition()
            .style("font-weight", "normal")
            .style("font-size", "48px")
        d3.select(this).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p2)
    });

g_right.append("text")
    .attr("class", function(d, i) { return ("pie_right_text" + i);})
    // This didn't pan out, these are individually fixed at the end of the script
    // .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")";})
    .style("fill", "white")
    .style("font-size", "48px")
    .style("text-align", "center")
    .text(function(d) { return d.data; })
    .on("mouseover", function(d, i) {
        myArc_p2.outerRadius(radius+10)
        d3.select(this).transition()
            .style("font-weight", "bold")
            .style("font-size", "60px")
        d3.select("path.pie_right_slice" + i).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p2)
    })
    .on("mouseout", function(d, i) {
        myArc_p2.outerRadius(radius-10)
        d3.select("path.pie_right_slice" + i).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p2)
    })

var svgBottom = d3.select("#Pie_Two").append("svg")
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
    .on("mouseover", function(d, i) {
        myArc_p2.outerRadius(radius+10)
        d3.select("text.pie_right_text" + i).transition()
            .style("font-weight", "bold")
            .style("font-size", "60px")
        d3.select("text.pie_left_text" + i).transition()
            .style("font-weight", "bold")
            .style("font-size", "60px")
        d3.select("path.pie_right_slice" + i).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p2)
        d3.select("path.pie_left_slice" + i).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p2)
    })
    .on("mouseout", function(d, i) {
        myArc_p2.outerRadius(radius-10)
        d3.select("text.pie_right_text" + i).transition()
            .style("font-weight", "normal")
            .style("font-size", "48px")
        d3.select("text.pie_left_text" + i).transition()
            .style("font-weight", "normal")
            .style("font-size", "48px")
        d3.select("path.pie_right_slice" + i).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p2)
        d3.select("path.pie_left_slice" + i).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p2)
    })
    

var text = ["PUZZLE, BOARD GAME, GAME SHOW, TRIVIA, CARD GAMES", "ACTION, SPORTS, STRATEGY, ROLE-PLAYING", "OTHER"];

svgBottom.selectAll("bar.colored").data(text).enter()
    .append("text")
    .attr("transform", function(d, i) { return "translate(205," + (38+i*35) + ")";})
    .style("font-size", "24px")
    .text(function(d) {return d;})

// Manually adjust text, the centroid function wasn't nice enough
d3.select("text.pie_left_text0").attr("transform", "translate(50, 0)")
d3.select("text.pie_left_text1").attr("transform", "translate(-40, 95)")
d3.select("text.pie_left_text2").attr("transform", "translate(-85, -15)")

d3.select("text.pie_right_text0").attr("transform", "translate(50, 0)")
d3.select("text.pie_right_text1").attr("transform", "translate(-40, 105)")
d3.select("text.pie_right_text2").attr("transform", "translate(-85, -15)")

