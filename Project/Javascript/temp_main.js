// TEMP MAIN

// Quick array sum methods

function add(x, y) { return x + y; }

var length_array = new Array(16).fill(0)

var canvas  = document.querySelector("canvas"),
    canvasContext = canvas.getContext("2d"),
    width   = canvas.width,
    height  = canvas.height;

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

var simulation;

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

  // At some point I need to map these node IDs back to csv_data_array ID so I can display data on hover

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
      console.log("barfoo")
      // If prerequisite has no prerequisite (i.e. has already been displayed)
      if(featString_to_ID_map.get(element.prerequisite_feats)) {
        console.log("foobar")
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

  console.log(nodes)
  console.log(links)

  console.log(yay1)
  console.log(yay2)


  // Start global simulation
  simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody())
    .force("link", d3.forceLink(links).distance(800).strength(1))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .on("tick", ticked);

}

// All below is standard code from https://bl.ocks.org/mbostock/95aa92e2f4e8345aaa55a4a94d41ce37

d3.select(canvas)
    .call(d3.drag()
        .container(canvas)
        .subject(dragsubject)
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

function ticked() {
  canvasContext.clearRect(0, 0, width, height);
  canvasContext.save();
  canvasContext.translate(width / 2, height / 2);

  canvasContext.beginPath();
  links.forEach(drawLink);
  canvasContext.strokeStyle = "#aaa";
  canvasContext.stroke();

  canvasContext.beginPath();
  nodes.forEach(drawNode);
  canvasContext.fill();
  canvasContext.strokeStyle = "#fff";
  canvasContext.stroke();

  canvasContext.restore();
}

function dragsubject() {
  return simulation.find(d3.event.x - width / 2, d3.event.y - height / 2);
}

function dragstarted() {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d3.event.subject.fx = d3.event.subject.x;
  d3.event.subject.fy = d3.event.subject.y;
}

function dragged() {
  d3.event.subject.fx = d3.event.x;
  d3.event.subject.fy = d3.event.y;
}

function dragended() {
  if (!d3.event.active) simulation.alphaTarget(0);
  d3.event.subject.fx = null;
  d3.event.subject.fy = null;
}

function drawLink(d, i) {
  canvasContext.moveTo(d.source.x, d.source.y);
  canvasContext.lineTo(d.target.x, d.target.y);
}

function drawNode(d, i) {
  canvasContext.moveTo(d.x + 3, d.y);
  canvasContext.arc(d.x, d.y, 3, 0, 2 * Math.PI);
}


console.log(links)
console.log(nodes)

var featString_to_ID_map = new Map();
var featID_to_Node_map = new Map();
