var w = 800
var h = 400

//              Red       Black     D Grey    L Grey
var colors = [ "ff0000", "000000", "9c9c9c", "e3e3e3" ];

var data_p1 = [ 4.0, 43.8, 18.4, 33.7 ];

radius = 150;

var f1 = d3.format(".1f");

var myPie_p1 = d3.pie()
            .sort(null) // Turn off automatic data sorting
            .value(function(d) { return d; });

var myArc_p1 = d3.arc()
              .outerRadius(radius-10)
              .innerRadius(0);

/* Used to center text, didn't pan out
var labelArc = d3.arc()
              .outerRadius(radius-60)
              .innerRadius(radius-60);
*/

// Used below
function circle_iterate(i) {
    if (i < 0 || i > 3) return null;
    return (i == 3) ? 0 : i+1; 
}

// Start angle remains the same
function arcTween_p1(newAngle) {
    return function (d) {
        console.log(d)
        var i = d3.interpolate(d.endAngle, newAngle);
        return function (t) {
            d.startAngle = i(t);
            return myArc_p1(d);
        }
    }
}

var myPie_original = myPie_p1(data_p1)

function arcTween_p1_fixed(newAngle, i) {
    return function (d) {
        var inter = d3.interpolate(newAngle, myPie_original[i].endAngle);
        return function (t) {
            d.startAngle = inter(t);
            return myArc_p1(d);
        }
    }
}

function arcTween_p1_fixed2(newAngle, i) {
    return function (d) {
        d.startAngle = myPie_original[i].startAngle
        d.endAngle = myPie_original[i].endAngle
        var inter = d3.interpolate(myPie_original[i].startAngle,newAngle);
        return function (t) {
            d.endAngle = inter(t);
            return myArc_p1(d);
        }
    }
}

var key_flag = 0;

function pieTween_click(d, i){

    // Flag to prevent the transition from restarting on another click
    if (key_flag) return;

    key_flag = 1;
    var speedTween = 1000;

    d3.select("text.pie_bottom_text0").transition()
        .duration((data_p1[0]/100)*speedTween)
        .style("fill", "white")
    d3.select("path.pie_bottom_slice" + 0).transition().ease(d3.easeLinear)
        .duration((data_p1[0]/100)*speedTween)
        .attrTween("d", arcTween_p1_fixed(myPie_original[0].startAngle, 0))
    d3.select("path.pie_bottom_slice" + 1).transition().ease(d3.easeLinear)
        .duration((data_p1[1]/100)*speedTween)
        .delay((data_p1[0]/100)*speedTween)
        .attrTween("d", arcTween_p1_fixed(myPie_original[1].startAngle, 1))
    d3.select("path.pie_bottom_slice" + 2).transition().ease(d3.easeLinear)
        .duration((data_p1[2]/100)*speedTween)
        .delay(((data_p1[0]+data_p1[1])/100)*speedTween)
        .attrTween("d", arcTween_p1_fixed(myPie_original[2].startAngle, 2))
    d3.select("path.pie_bottom_slice" + 3).transition().ease(d3.easeLinear)
        .duration((data_p1[3]/100)*speedTween)
        .delay(((data_p1[0]+data_p1[1]+data_p1[2])/100)*speedTween)
        .attrTween("d", arcTween_p1_fixed(myPie_original[3].startAngle, 3))

    d3.select("text.pie_bottom_text0").transition()
        .duration((data_p1[0]/100)*speedTween)
        .delay(speedTween)
        .style("fill", "black")
    d3.select("path.pie_bottom_slice" + 0).transition().ease(d3.easeLinear)
        .duration((data_p1[0]/100)*speedTween)
        .delay(speedTween)
        .attrTween("d", arcTween_p1_fixed2(myPie_original[0].endAngle, 0))
    d3.select("path.pie_bottom_slice" + 1).transition().ease(d3.easeLinear)
        .duration((data_p1[1]/100)*speedTween)
        .delay(speedTween+(data_p1[0]/100)*speedTween)
        .attrTween("d", arcTween_p1_fixed2(myPie_original[1].endAngle, 1))
    d3.select("path.pie_bottom_slice" + 2).transition().ease(d3.easeLinear)
        .duration((data_p1[2]/100)*speedTween)
        .delay(speedTween+((data_p1[0]+data_p1[1])/100)*speedTween)
        .attrTween("d", arcTween_p1_fixed2(myPie_original[2].endAngle, 2))
    d3.select("path.pie_bottom_slice" + 3).transition().ease(d3.easeLinear)
        .duration((data_p1[3]/100)*speedTween)
        .delay(speedTween+((data_p1[0]+data_p1[1]+data_p1[2])/100)*speedTween)
        .attrTween("d", arcTween_p1_fixed2(myPie_original[3].endAngle, 3))
        .on("end", function() {key_flag = 0})

}

function pieTween_over(d, i) {
    // Set next one expanding (Set text invisible)
    var temp_i = circle_iterate(i)

    console.log(d)

    d3.select("path.pie_bottom_slice" + i).transition().duration(1000)
        .attrTween("d", arcTween_p1(d.startAngle) )

    d3.select("path.pie_bottom_text" + temp_i).style("visibility", "hidden")


    // Set next next one getting smaller (Set text invisible)
    temp_i = circle_iterate(temp_i)
    d3.select("path.pie_bottom_slice" + temp_i)
        

    d3.select("path.pie_bottom_text" + temp_i).style("visibility", "hidden")


    // Set next next nextone getting smaller (Set text invisible)
    temp_i = circle_iterate(temp_i)
    d3.select("path.pie_bottom_slice" + temp_i)


    d3.select("path.pie_bottom_text" + temp_i).style("visibility", "hidden")

}

function pieTween_out(d, i) {
}

var svg = d3.select("#Pie_One").append("svg")
    .attr("width", w)
    .attr("height", h)
      .append("g")
        .attr("transform", "translate(" + 0.25*w + "," + 0.5*h + ")");

var g = svg.selectAll(".slicesBottom").data(myPie(data_p1)).enter()
    .append("g")
        .attr("class", "slicesBottom");

g.append("path")
    .datum(function(d) { return {startAngle: d.startAngle, endAngle: d.endAngle};})
    .attr("class", function(d, i) { return ("pie_bottom_slice" + i);})
    .attr("fill", function(d, i) { return "#" + colors[i]; })
    .attr("stroke", "#ffffff") // Add white-space between segments
    .attr("stroke-width", "2") // Define width of white-space
    .attr("d", myArc_p1)
    .on("click", pieTween_click)
    //.on("mouseover", pieTween_over)
    //.on("mouseout", pieTween_out)

g.append("text")
    .attr("class", function(d, i) { return ("pie_bottom_text" + i);})
    // This didn't pan out, these are individually fixed at the end of the script
    //.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")";})
    .style("fill", "White")
    .style("font-size", "44px")
    .text(function(d) { return f1(d.data); });

svg.selectAll("bar.colored").data(colors).enter()
  .append("rect")
    .style("fill", function(d) { return "#" + d; })
    .attr("class", "bar.colored")
    .attr("x", 225)
    .attr("width", 20)
    .attr("y", function(d, i) { return -65+i*35})
    .attr("height", 20)
    .on("mouseover", function(d, i) {
        console.log("Foobar")
        myArc_p1.outerRadius(radius+10)
        d3.select("text.pie_bottom_text" + i).transition()
            .style("font-weight", "bold")
            .style("font-size", "60px")
        d3.select("path.pie_bottom_slice" + i).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p1)
    })
    .on("mouseout", function(d, i) {
        myArc_p1.outerRadius(radius-10)
        d3.select("text.pie_bottom_text" + i).transition()
            .style("font-weight", "normal")
            .style("font-size", "48px")
        d3.select("path.pie_bottom_slice" + i).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p1)
    })

var text = ["CASUAL GAMES", "ACTION, SPORTS, STRATEGY, ROLE-PLAYING","SHOOTER", "OTHER"];

svg.selectAll("bar.colored").data(text).enter()
    .append("text")
    .attr("transform", function(d, i) { return "translate(255," + (-47+i*35) + ")";})
    .style("font-size", "24px")
    .style("cursor", "crosshair")
    .text(function(d) {return d;})
    .on("mouseover", function(d, i) {
        console.log("Foobar")
        myArc_p1.outerRadius(radius+10)
        d3.select("text.pie_bottom_text" + i).transition()
            .style("font-weight", "bold")
            .style("font-size", "60px")
        d3.select("path.pie_bottom_slice" + i).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p1)
    })
    .on("mouseout", function(d, i) {
        myArc_p1.outerRadius(radius-10)
        d3.select("text.pie_bottom_text" + i).transition()
            .style("font-weight", "normal")
            .style("font-size", "48px")
        d3.select("path.pie_bottom_slice" + i).transition()
            .ease(d3.easeQuadOut)
            .duration(500)
            .attr("d", myArc_p1)
    })





d3.select("text.pie_bottom_text0").attr("transform", "translate(5, -150)").style("fill", "black")       // Red
d3.select("text.pie_bottom_text1").attr("transform", "translate(45, 20)")                               // Black
d3.select("text.pie_bottom_text2").attr("transform", "translate(-80, 95)")                              // D Grey
d3.select("text.pie_bottom_text3").attr("transform", "translate(-95, -10)")                             // L Grey


