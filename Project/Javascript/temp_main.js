// TEMP MAIN

// Quick array sum methods

function add(x, y) { return x + y; }

var length_array = new Array(16).fill(0)

var width = 3000;
var height = 1500;

var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height)

var csv_data_array;

// Read in data and work with it
// NOTE: Will have to convert da
d3.csv("/Data/pathfinder_feats.csv", function(data) {
  csv_data_array = data;

  var pre_req_cnt = 0;
  for (var x = 0; x < data.length; x++) {
    if (data[x].prerequisite_feats != "") 
    {
      pre_req_cnt++;
      length_array[data[x].prerequisite_feats.split(",").length]++
    }
    else length_array[0]++
  }

  format_baseline()
});

// Creates root
var nodes = d3.range(1).map(function(i) {
  return {
    index: i
  };
});

var links = d3.range(1).map(function(i) {
  return {
    source: 0,
    target: i
  };
});

links.pop();
links.pop();

console.log(nodes.length)
console.log(links.length)

// These two functions from Mike Bostock
function drawLink(d, i) {
  canvasContext.moveTo(d.source.x, d.source.y);
  canvasContext.lineTo(d.target.x, d.target.y);
}

function drawNode(d, i) {
  canvasContext.moveTo(d.x + 3, d.y);
  canvasContext.arc(d.x, d.y, 3, 0, 2 * Math.PI);
}

var simulation,
    svg_nodes,
    svg_links;

function format_baseline() {
  var yay1 = 0;
  var nay1 = 0;

  var yay2 = 0;
  var nay2 = 0;

  // Fill keymap
  csv_data_array.forEach(function(element, index) {
    featString_to_ID_map.set(element.name, index)
  })

  // Set links

  csv_data_array.forEach(function(element, index) {
      if(element.prerequisite_feats == "") {
        nodes.push( {
          index: nodes.length
        })
        links.push( {
          source: 0,
          target: nodes.length - 1
        })

        featID_to_Node_map.set(index, nodes.length - 1)

        yay1++;
      }
      else {
        nay1++;
      }

  });

  csv_data_array.forEach(function(element, index) {
    // If only 1 prerequisite feat
    if((element.prerequisite_feats != "") && (csv_data_array[index].prerequisite_feats.split(",").length) == 1) {
      // If prerequisite has no prerequisite (i.e. has already been displayed)
      if(featString_to_ID_map.get(element.prerequisite_feats)) {
        if(csv_data_array[featString_to_ID_map.get(element.prerequisite_feats)].prerequisite_feats == "") {
          nodes.push( {
            index: nodes.length
          })
          links.push( {
            // The source is the single prerequisite feat, which is retrieved by accessing the feat string to ID map using the element prerequisite and then using that in the featID_to_Node_map
            source: featID_to_Node_map.get(featString_to_ID_map.get(element.prerequisite_feats)),
            target: nodes.length - 1
          })

          featID_to_Node_map.set(index, (nodes.length - 1))

          yay2++;
        }
        else {
          nay2++;
        }
      }
    }
  });

  console.log("-------------------")

  console.log(nodes)
  console.log(links)

  simulation = d3.forceSimulation()
    .force("link", d3.forceLink().distance(200).strength(1))
    .force("charge", d3.forceManyBody())
    .force("x", d3.forceX(0))
    .force("y", d3.forceY(0))
    .force("center", d3.forceCenter(width / 2, height / 2));


  // Set links between all nodes (TODO: Put below node creation)
  svg_links = svg.selectAll(".link")
    .data(links)
    .enter().append("line")
      .attr("class", "link")
      .attr("stroke-width", 1)
      .attr("stroke", "black");

  // Create nodes themselves with hover capacity
  svg_nodes = svg.selectAll(".node")
    .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .call(d3.drag()
 	.on("start", drag_start)
	.on("drag", drag)
	.on("end", drag_end)
      );

  svg_nodes.append("circle")
        .attr("r", 3);

  simulation
    .nodes(nodes)
    .on("tick", tick)

  simulation.force("link")
    .links(links)

  //svg_nodes.append("circle")
  //  .attr("r", 8);

  console.log("BARFOO")

  console.log(nodes)
  console.log(links)

  console.log(yay1)
  console.log(yay2)

}

// Basic tick function for iterating through time, from Mike Bostock (Creator of D3)
function tick() {
  svg_links
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });
  svg_nodes
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function mouseover() {
  d3.select(this).select("circle").transition()
    .duration(250)
    .attr("fill", "green")
}

function mouseout() {
    d3.select(this).select("circle").transition()
	.duration(250)
	.attr("fill", "black")
}

function drag_start() {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d3.event.subject.fx = d3.event.subject.x;
  d3.event.subject.fy = d3.event.subject.y;
}

function drag() {
  d3.event.subject.fx = d3.event.x;
  d3.event.subject.fy = d3.event.y;
}

function drag_end() {
  if (!d3.event.active) simulation.alphaTarget(0);
  d3.event.subject.fx = null;
  d3.event.subject.fy = null;
}

console.log(links)
console.log(nodes)

var featString_to_ID_map = new Map();
var featID_to_Node_map = new Map();

