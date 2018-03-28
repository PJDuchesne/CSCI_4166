// TEMP MAIN

// Quick array sum methods

function add(x, y) { return x + y; }

var length_array = new Array(16).fill(0)

var width = 4500;
var height = 3000;

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

// Create Fake ENUM for each type of feat
var JS_ENUM = ({"Root": 0,
                "General": 1,
                "Combat": 2,
                "Mythic": 3,
                "Metamagic": 4,
                "Story": 5,
                "Monster": 6,
                "Other": 7,
                "Item Creation": 8 })

Object.freeze(JS_ENUM)

console.log("ABC")

console.log(Object.keys(JS_ENUM).length)

console.log("CBA")


// Creates root and named feat types (From JS_ENUM)
var nodes = d3.range(Object.keys(JS_ENUM).length).map(function(i) {
    return {
        index: i
    };
});

// Link base types for feats to root!
var links = d3.range(1).map(function(i) {
    return {
        source: 0,
        target: i
    };
});

links.pop();

console.log("HAAAAAB")
console.log(nodes.length)
console.log(links.length)
console.log("BAAAAAH")

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
        featString_to_featID_map.set(element.name, index)
        featID_to_stringID_map.set(index, element.name)
    })

    var tmp_parsing

    // Set node for each and create keymap
    csv_data_array.forEach(function(element, index) {
        nodes.push( {
        index: nodes.length
    })

        // This *should* be a 1 to 1, or 1 to 1+1
        featID_to_NodeID_map.set(index, nodes.length - 1)
        nodeID_to_featID_map.set(nodes.length - 1, index)
    })

    var feat_type = 0

    // Create links based on keymap and parsing
    csv_data_array.forEach(function(element, index) {
        if(element.prerequisite_feats == "") 
        {
            for (property in JS_ENUM) {
                if (property == element.type) {
                    feat_type = JS_ENUM[property]
                    break
                }
            }
            links.push( {
                // Source will be the base feat type
                source: feat_type,
                // Destination will be the currently parsing feat
                target: featID_to_NodeID_map.get(index)
            })

        }
        else
        {
            tmp_parsing = parsefeats(element.prerequisite_feats)
            for(var i = 0; i < tmp_parsing.length; i++)
            {
                if (featID_to_NodeID_map.get(featString_to_featID_map.get(tmp_parsing[i])) != undefined)
                {
                    links.push( {
                        // Source will be the prerequisite feats for that feat
                        source: featID_to_NodeID_map.get(featString_to_featID_map.get(tmp_parsing[i])),
                        // Destination will be the currently parsing feat
                        target: featID_to_NodeID_map.get(index)
                    })
                    yay1++
                }
                else {
                    yay2++;
                }
            }
        }  
    });


    console.log("BARFOOOOOO")
    // TODO: Troubleshoot undefined issue
    links.forEach(function(element, index) {
        if (element.target == undefined) {
            console.log("Link #:" + element.source + " is undefined" )
        }
    })
    console.log("FOOOOOOBAR")

    // Set links

    console.log("-------------------")
    console.log(csv_data_array)
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
        .on("mouseover", node_tooltip.show)
        .on("mouseout", node_tooltip.hide)
        .call(d3.drag()
            .on("start", drag_start)
            .on("drag", drag)
            .on("end", drag_end)
        );

    console.log("Flaaaaaa")
    svg_nodes.append("circle")
        .attr("r", 3)
        .style("fill", function(d) {
            if (csv_data_array[nodeID_to_featID_map.get(d.index)] != undefined)
            {
                switch (csv_data_array[nodeID_to_featID_map.get(d.index)].type) {
                    case 'General':
                        return 'Green' 
                        break;
                    case 'Combat':
                        return 'Red' 
                        break;
                    case 'Mythic':
                        return 'Gold' 
                        break;
                    case 'Metamagic':
                        return 'Blue' 
                        break;
                    case 'Story':
                        return 'Purple' 
                        break;
                    case 'Monster':
                        return 'Black' 
                        break;
                    case 'Other':
                        return 'Grey' 
                        break;
                    case 'Item Creation':
                        return 'Brown' 
                        break;
                    default:
                        console.log("FOUND INVALID TYPE ON NODE: " + d.index)
                        console.log("Type: " + d.type)
                        // while(1);
                        break;
                }
            }
        });
    console.log("aaaaaaalF")

    simulation
        .nodes(nodes)
        .on("tick", tick)

    simulation.force("link")
        .links(links)

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

// Function that slices prerequisite feats and returns and array of formatted feats
function parsefeats(d) {
    // Input must be a string
    if(typeof(d) != "string") { return -1; }

    // No prerequisite feats, return 0
    if (d == "") { return 0; } 

    // Replace pipes with commas (TODO: Make this visual)
    d.replace(/\|/g, ",")

    // Split array by commas
    var feat_array = d.split(",")

    // Remove unnessecary spaces on front and back of feats
    for(var i = 0; i < feat_array.length; i++ )
    {
        if(feat_array[i].indexOf("(") != -1) {
          feat_array[i] = feat_array[i].substring(0, feat_array[i].indexOf("("))
        }

        // Remove leading spaces
        if(feat_array[i].startsWith(" ")) {
            feat_array[i] = feat_array[i].slice(1)
        }

        // Remove trailing spaces
        if(feat_array[i].endsWith(" ")) {
            feat_array[i] = feat_array[i].slice(0, -1)
        }
    }

    return feat_array;

}

// TOOLTIP STUFF HERE: Uses the d3-tip library extension that mimics d3-v3's tooltip functionality

var node_tooltip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) { 
        console.log("----------------TOOLTIP---------------")
        console.log(d)
        console.log("Feat ID: " + nodeID_to_featID_map.get(d.index))
        console.log("FEAT NAME: " + featID_to_stringID_map.get(nodeID_to_featID_map.get(d.index)))
        console.log("----------------TOOLTIP_END-----------")
        return featID_to_stringID_map.get(nodeID_to_featID_map.get(d.index)); 
    })

svg.call(node_tooltip)

var featString_to_featID_map = new Map();
var featID_to_stringID_map = new Map();
var featID_to_NodeID_map = new Map();
var nodeID_to_featID_map = new Map();


