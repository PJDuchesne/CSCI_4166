// Note: Variables in this file use '_p2' suffixes standing for 'pie 2'

// Define width and height for SVG canvases
var width_p2 = 400
var height_p2 = 350

// Define colors used in the pie charts
//              Red       Black     Light Grey
var colors_p2 = [ "ff0000", "000000", "e3e3e3" ];

// Define data used in the pie charts
var dataLeft = [ 42, 25, 33 ];
var dataRight = [ 47, 12, 41 ];

// Radius of pie charts
radius_p2 = 150;

// Define pie function that creates pie chart data using arc data
var myPie = d3.pie()
            .sort(null) // Turn off automatic data sorting
            .value(function(d) { return d; });

// Define arc function that creates arc data
var myArc_p2 = d3.arc()
              .outerRadius(radius_p2-10)
              .innerRadius(0);

// Define left SVG canvas used for the left pie chart
var svgLeft_p2 = d3.select("#Pie_Two").append("svg")
    .attr("width", width_p2)
    .attr("height", height_p2)
      .append("g")
        .attr("transform", "translate(" + 0.5*width_p2 + "," + 0.5*height_p2 + ")");

// Create left pie chart data
var g_left = svgLeft_p2.selectAll(".slicesLeft").data(myPie(dataLeft)).enter()
    .append("g")
        .attr("class", "slicesLeft");

// Render left pie chart
g_left.append("path")
    .attr("class", function(d, i) { return ("pie_left_slice" + i);})
    .attr("fill", function(d, i) { return "#" + colors_p2[i]; })
    .attr("stroke", "#ffffff") // Add white-space between segments
    .attr("stroke-width", "2") // Define width of white-space
    .attr("d", myArc_p2)
    .on("mouseover", function(d, i) {
        myArc_p2.outerRadius(radius_p2+10)
        d3.select("text.pie_left_text" + i).transition()
            .style("font-weight", "bold")
            .style("font-size", "60px")
        d3.select(this).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p2)
    })
    .on("mouseout", function(d, i) {
        myArc_p2.outerRadius(radius_p2-10)
        d3.select("text.pie_left_text" + i).transition()
            .style("font-weight", "normal")
            .style("font-size", "48px")
        d3.select(this).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p2)
    });

// Add text to left pie chart
g_left.append("text")
    .attr("class", function(d, i) { return ("pie_left_text" + i);})
    .style("fill", "White")
    .style("font-size", "48px")
    .text(function(d) { return d.data; })
    .on("mouseover", function(d, i) {
        myArc_p2.outerRadius(radius_p2+10)
        d3.select(this).transition()
            .style("font-weight", "bold")
            .style("font-size", "60px")
        d3.select("path.pie_left_slice" + i).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p2)
    })
    .on("mouseout", function(d, i) {
        myArc_p2.outerRadius(radius_p2-10)
        d3.select("path.pie_left_slice" + i).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p2)
    })

// Define right SVG canvas used for the right pie chart
var svgRight_p2 = d3.select("#Pie_Two").append("svg")
    .attr("width", width_p2)
    .attr("height", height_p2)
      .append("g")
        .attr("transform", "translate(" + 0.5*width_p2 + "," + 0.5*height_p2 + ")");

// Create right pie chart data
var g_right = svgRight_p2.selectAll(".slicesRight").data(myPie(dataRight)).enter()
    .append("g")
        .attr("class", "slicesRight");

// Render right pie chart
g_right.append("path")
    .attr("class", function(d, i) { return ("pie_right_slice" + i);})
    .attr("fill", function(d, i) { return "#" + colors_p2[i]; })
    .attr("stroke", "#ffffff") // Add white-space between segments
    .attr("stroke-width", "2") // Define width of white-space
    .attr("d", myArc_p2)
    .on("mouseover", function(d, i) {
        myArc_p2.outerRadius(radius_p2+10)
        d3.select("text.pie_right_text" + i).transition()
            .style("font-weight", "bold")
            .style("font-size", "60px")
        d3.select(this).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p2)
    })
    .on("mouseout", function(d, i) {
        myArc_p2.outerRadius(radius_p2-10)
        d3.select("text.pie_right_text" + i).transition()
            .style("font-weight", "normal")
            .style("font-size", "48px")
        d3.select(this).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p2)
    });

// Add text to right pie chart
g_right.append("text")
    .attr("class", function(d, i) { return ("pie_right_text" + i);})
    .style("fill", "white")
    .style("font-size", "48px")
    .style("text-align", "center")
    .text(function(d) { return d.data; })
    .on("mouseover", function(d, i) {
        myArc_p2.outerRadius(radius_p2+10)
        d3.select(this).transition()
            .style("font-weight", "bold")
            .style("font-size", "60px")
        d3.select("path.pie_right_slice" + i).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p2)
    })
    .on("mouseout", function(d, i) {
        myArc_p2.outerRadius(radius_p2-10)
        d3.select("path.pie_right_slice" + i).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p2)
    })

// Define bottom SVG canvas to hold legend and text
var svgBottom_p2 = d3.select("#Pie_Two").append("svg")
    .attr("width", width_p2*2)
    .attr("height", height_p2/3)

// Create legend boxes with transitions
svgBottom_p2.selectAll("bar.colored").data(colors_p2).enter()
  .append("rect")
    .style("fill", function(d) { return "#" + d; })
    .attr("class", "bar.colored")
    .attr("x", 180)
    .attr("width", 20)
    .attr("y", function(d, i) { return 20+i*35})
    .attr("height", 20)
    .on("mouseover", function(d, i) {
        myArc_p2.outerRadius(radius_p2+10)
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
        myArc_p2.outerRadius(radius_p2-10)
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
    
// Define text used in legend
var text_p2 = [ "PUZZLE, BOARD GAME, GAME SHOW, TRIVIA, CARD GAMES",
                "ACTION, SPORTS, STRATEGY, ROLE-PLAYING",
                "OTHER"];

// Add text to legend with transition
svgBottom_p2.selectAll("bar.colored").data(text_p2).enter()
    .append("text")
    .attr("transform", function(d, i) { return "translate(205," + (38+i*35) + ")";})
    .style("font-size", "24px")
    .text(function(d) {return d;})
    .on("mouseover", function(d, i) {
        myArc_p2.outerRadius(radius_p2+10)
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
        myArc_p2.outerRadius(radius_p2-10)
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
    
// Manually adjust text (Tried using centroid function to automate this, but it wasn't nice enough)
d3.select("text.pie_left_text0").attr("transform", "translate(50, 0)")
d3.select("text.pie_left_text1").attr("transform", "translate(-40, 95)")
d3.select("text.pie_left_text2").attr("transform", "translate(-85, -15)")

d3.select("text.pie_right_text0").attr("transform", "translate(50, 0)")
d3.select("text.pie_right_text1").attr("transform", "translate(-40, 105)")
d3.select("text.pie_right_text2").attr("transform", "translate(-85, -15)")
