

var w = 800
var h = 4350

// var test_x = 570
// var test_y = 2135

 var test_x = 570
 var test_y = 4435

var svg_snoot = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h)
  .append("g")


for(i_snoot = 0; i_snoot < 704; i_snoot++) {
    var tmp = svg_snoot.selectAll("snootL").data([0]).enter().append("image")
        .attr("class", "snootL")
        .attr("id", ("snootL" + i_snoot))
        .attr("xlink:href", "images/image10.jpg")
        .attr("width", 50)
        .attr("height", 50)
        .attr("opacity", Math.random()/5)
        .attr("x", 0)
        .attr("y", (((i_snoot - i_snoot%8)/8)*50))
        .attr("transform", "scale(-1, 1) translate(0, 0)")

    var tmp = svg_snoot.selectAll("snootR").data([0]).enter().append("image")
        .attr("class", "snootR")
        .attr("id", ("snootR" + i_snoot))
        .attr("xlink:href", "images/image10.jpg")
        .attr("width", 50)
        .attr("height", 50)
        .attr("opacity", Math.random()/5)
        .attr("x", 800)
        .attr("y", (((i_snoot - i_snoot%8)/8)*50))
}

for(i_snoot = 0; i_snoot < 88; i_snoot++) {
    var tmp = svg_snoot.selectAll("snootL_leader").data([0]).enter().append("image")
        .attr("class", "snootL_leader")
        .attr("id", ("snootL_leader" + i_snoot))
        .attr("xlink:href", "images/image10.jpg")
        .attr("width", 50)
        .attr("height", 50)
        .attr("x", 0)
        .attr("y", (i_snoot*50))
        .attr("transform", "scale(-1, 1) translate(0, 0)")

    var tmp = svg_snoot.selectAll("snootR_leader").data([0]).enter().append("image")
        .attr("class", "snootR_leader")
        .attr("id", ("snootR_leader" + i_snoot))
        .attr("xlink:href", "images/image10.jpg")
        .attr("width", 50)
        .attr("height", 50)
        .attr("x", 800)
        .attr("y", (i_snoot*50))
}

function snoot_storm() {
    var timing = 10000

    svg_snoot.selectAll("image.snootL_leader").transition()
        .duration(function (d, i) { return (timing*(850/750)) })
        .attr("transform", function(d, i) { return ("scale (-1, 1) translate(" + -(850) + ", 0)"  ) })
        .ease(d3.easeLinear)

    svg_snoot.selectAll("image.snootL").transition()
        .duration(function (d, i) { return (timing*(750-((i%8)*100))/750) })
        .attr("transform", function(d, i) { return ("scale (-1, 1) translate(" + -(800-((i%8)*100)-50)  + ", 0)"  ) })
        .ease(d3.easeLinear)

    svg_snoot.selectAll("image.snootR_leader").transition()
        .duration(function (d, i) { return (timing*(850/750)) })
        .attr("transform", function(d, i) { return ("translate(" + -(850) + ", 0)"  ) })
        .ease(d3.easeLinear)

    svg_snoot.selectAll("image.snootR").transition()
        .duration(function (d, i) { return (timing*(750-((i%8)*100))/750) })
        .attr("transform", function(d, i) { return ("translate(" + -(750-((i%8)*100))  + ", 0)"  ) })
        .ease(d3.easeLinear)

}

