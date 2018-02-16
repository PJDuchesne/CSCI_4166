// Note: Variables in this file use '_st' suffixes standing for 'snoot'

// Define width and height used in the SVG Canvas
var width_st = 800
var height_st = 4350 // Height of entire assignment

// Define SVG Canvas underneath the rest of the canvas
var svg_st = d3.select("body").append("svg")
    .attr("width", width_st)
    .attr("height", height_st)
  .append("g")

// Create 704 snoots offscreen, waiting to march in
for(i_snoot = 0; i_snoot < 704; i_snoot++) {
    var tmp = svg_st.selectAll("snootL").data([0]).enter().append("image")
        .attr("class", "snootL")
        .attr("id", ("snootL" + i_snoot))
        .attr("xlink:href", "images/image10.jpg")
        .attr("width", 50)
        .attr("height", 50)
        .attr("opacity", Math.random()/5) // Randomize the opacity of each snoot within the range 0 to 0.2
        .attr("x", 0)
        .attr("y", (((i_snoot - i_snoot%8)/8)*50))
        .attr("transform", "scale(-1, 1) translate(0, 0)")

    var tmp = svg_st.selectAll("snootR").data([0]).enter().append("image")
        .attr("class", "snootR")
        .attr("id", ("snootR" + i_snoot))
        .attr("xlink:href", "images/image10.jpg")
        .attr("width", 50)
        .attr("height", 50)
        .attr("opacity", Math.random()/5)
        .attr("x", 800)
        .attr("y", (((i_snoot - i_snoot%8)/8)*50))
}

// Create 88 snoots that will lead the march in full opactity
for(i_snoot = 0; i_snoot < 88; i_snoot++) {
    var tmp = svg_st.selectAll("snootL_leader").data([0]).enter().append("image")
        .attr("class", "snootL_leader")
        .attr("id", ("snootL_leader" + i_snoot))
        .attr("xlink:href", "images/image10.jpg")
        .attr("width", 50)
        .attr("height", 50)
        .attr("x", 0)
        .attr("y", (i_snoot*50))
        .attr("transform", "scale(-1, 1) translate(0, 0)")

    var tmp = svg_st.selectAll("snootR_leader").data([0]).enter().append("image")
        .attr("class", "snootR_leader")
        .attr("id", ("snootR_leader" + i_snoot))
        .attr("xlink:href", "images/image10.jpg")
        .attr("width", 50)
        .attr("height", 50)
        .attr("x", 800)
        .attr("y", (i_snoot*50))
}

// The transition function used in second_graph.js to march the snoots on screen behind the rest of the assignment
function snoot_storm() {
    
    // Timing value for length of transition
    var timing_st = 10000

    svg_st.selectAll("image.snootL_leader").transition()
        .duration(function (d, i) { return (timing_st*(850/750)) })
        .attr("transform", function(d, i) { return ("scale (-1, 1) translate(" + -(850) + ", 0)"  ) })
        .ease(d3.easeLinear)

    svg_st.selectAll("image.snootL").transition()
        .duration(function (d, i) { return (timing_st*(750-((i%8)*100))/750) })
        .attr("transform", function(d, i) { return ("scale (-1, 1) translate(" + -(800-((i%8)*100)-50)  + ", 0)"  ) })
        .ease(d3.easeLinear)

    svg_st.selectAll("image.snootR_leader").transition()
        .duration(function (d, i) { return (timing_st*(850/750)) })
        .attr("transform", function(d, i) { return ("translate(" + -(850) + ", 0)"  ) })
        .ease(d3.easeLinear)

    svg_st.selectAll("image.snootR").transition()
        .duration(function (d, i) { return (timing_st*(750-((i%8)*100))/750) })
        .attr("transform", function(d, i) { return ("translate(" + -(750-((i%8)*100))  + ", 0)"  ) })
        .ease(d3.easeLinear)

}

