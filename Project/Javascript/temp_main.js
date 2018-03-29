// TEMP MAIN

// Quick array sum methods

function add(x, y) { return x + y; }

var length_array = new Array(16).fill(0)

var width = 4500;
var height = 3000;
var link_distance_metric = 600;

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

var num_categories = Object.keys(JS_ENUM).length - 1;

var algebra_angle = Math.PI/num_categories
var algebra_hyp = 2*link_distance_metric*Math.sin(algebra_angle)


function compute_X(input) {
    return (Math.sin(2*Math.PI*(input/num_categories))*link_distance_metric)
}

function compute_Y(input) {
    return -(Math.cos(2*Math.PI*(input/num_categories))*link_distance_metric)
}

// Creates root and named feat types
var nodes = d3.range(num_categories+1).map(function(i) {
    if (i==0) {
        return {
            index: i,
            fx: width/2,
            fy: height/2,
            r: 30
        };
    }
    else {
        return {
            index: i,
            fx: width/2 + compute_X(i-1),
            fy: height/2 + compute_Y(i-1),
            r: 20
        };
    }
});

// Link base types for feats to root!
var links = d3.range(num_categories+1).map(function(i) {
    return {
        source: 0,
        target: i   // Directly encode color of root
    };
});

links.shift();

for (var i = 1; i < num_categories + 1; i++) {
    if (i < num_categories ) {
        links.push( {
            source: i,
            target: i+1,
            type: i   // Directly encode color of root
        })
    }
    else {
        links.push( {
            source: i,
            target: 1,
            type: i   // Directly encode color of root nodes for each type
        })
    }
}

// console.log("HAAAAAB")
// console.log(nodes.length)
// console.log(links.length)
// console.log("BAAAAAH")

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

function feat_type_to_color(type) {
    switch (type) {
        case 0:
        case 'Root':
            return 'Black'
            break;
        case 1:
        case 'General':
            return 'Green' 
            break;
        case 2:
        case 'Combat':
            return 'Red' 
            break;
        case 3:
        case 'Mythic':
            return 'Gold' 
            break;
        case 4:
        case 'Metamagic':
            return 'Blue' 
            break;
        case 5:
        case 'Story':
            return 'Purple' 
            break;
        case 6:
        case 'Monster':
            return 'Pink' 
            break;
        case 7:
        case 'Other':
            return 'Grey' 
            break;
        case 8:
        case 'Item Creation':
            return 'Brown' 
            break;
        default:
            console.log("INVALID Type: " + type)
            // while(1);
            break;
    }
}

function feat_type_to_number(type) {
    switch (type) {
        case 'Root':
            return 0
            break;
        case 'General':
            return 1 
            break;
        case 'Combat':
            return 2
            break;
        case 'Mythic':
            return 3
            break;
        case 'Metamagic':
            return 4
            break;
        case 'Story':
            return 5
            break;
        case 'Monster':
            return 6
            break;
        case 'Other':
            return 7
            break;
        case 'Item Creation':
            return 8
            break;
        default:
            console.log("INVALID Type: " + type)
            // while(1);
            break;
    }
}

// Filled outright in format_baseline()
var featString_to_featID_map = new Map();
var featID_to_stringID_map = new Map();

// Filled as nodes are created in create_dependencies()
var featID_to_NodeID_map = new Map();   // Will list ALL nodes associated with a given feat
var nodeID_to_featID_map = new Map();
var MAIN_featID_to_NodeID_map = new Map();  // Will list the one FINAL node associated with a given feat
//var MAIN_nodeID_to_featID_map = new Map();

// 1) Create a node for the overall feat
// 2) Create a node for each prerequisite feat
// 3) Create a node for each prerequite for each prerequisite feat
// 4) Iterate like this until all prerequisites have been done and linked back to root (Or base of type)
// Note: If at any point a node does not have a prerequisite but another node on its layer does, 
//       add it to an array of nodes to be linked with the total length later
function create_dependencies(data) {
    console.log("---------------------CREATE DEPENDANCEIS---------------------")
    // TODO: Error checking that the input node is valid

    feat_type = feat_type_to_number(data.type)
    console.log("FEAT TYPE: " + feat_type)

    var tmp_pre_r = parsefeats(data.prerequisite_feats)

    var layer = 0;

    var end_flag = 0;

    console.log(data)

    // Push a new node for the feat itself, larger size!
    nodes.push( {
        index: nodes.length,
        r: 10
    })

    // Fill keymap for that node
        // featID_to_NodeID_map.set(featID_to_NodeID_map.size, nodes.length - 1) // TODO: Make this append to existing listing
    nodeID_to_featID_map.set(nodes.length - 1, featID_to_NodeID_map.size)
    MAIN_featID_to_NodeID_map.set(featID_to_NodeID_map.size, nodes.length - 1)

    var prerequisite_layers = [[[data.name]]]

    for (var i = 0; i < tmp_pre_r.length; i++) {
        prerequisite_layers[0][0].push(tmp_pre_r[i])
    }

    console.log("Bar")
    console.log(prerequisite_layers)

    var temp_node_array = [[{ name: data.name,
                             index: nodes.length - 1}], []]

    console.log("FARBOO")
    console.log(temp_node_array.slice())

    var tmp_src;
    var tmp_dst;

    while (1) {
        // Create nodes and links for this layer
        for(var m = 0; m < prerequisite_layers[layer].length; m++) {
            // Create nodes for next layer based on non-zero positions of this array
            for(var n = 1; n < prerequisite_layers[layer][m].length; n++) {

                nodes.push( {
                    index: nodes.length,
                    r: 5
                })

                // Store node in map
                    // featID_to_NodeID_map.set(featID_to_NodeID_map.size, nodes.length - 1) // TODO: Make this append to existing listing
                nodeID_to_featID_map.set(nodes.length - 1, featID_to_NodeID_map.size)

                // Push into second array within this array
                console.log(temp_node_array)
                temp_node_array[1].push({
                    name: prerequisite_layers[layer][m][n],
                    index: nodes.length - 1
                })

                // Create links based on stuff
                for(var p = 0; p < temp_node_array[0].length; p++) {
                    console.log("THIS TRIGGER?")

                    // THIS IS THE SOURCE FOR LINKS
                    tmp_src = temp_node_array[0][p].index;

                    console.log(temp_node_array[0][p])
                    // This is finding out where that source needs to be linked to
                    tmp_pre_r = parsefeats(csv_data_array[featString_to_featID_map.get(temp_node_array[0][p].name)].prerequisite_feats)

                    // If there are any prerequisites
                    if (!(tmp_pre_r <= 0)) {
                        console.log("THIS TRIGGER??")

                        for (var q = 0; q < tmp_pre_r.length; q++) {
                            for(var r = 0; r < temp_node_array[1].length; r++) {
                                if(temp_node_array[1][r].name == tmp_pre_r[q]) {
                                    tmp_dst = temp_node_array[1][r].index
                                }
                            }
                            
                            links.push( {
                                source: tmp_src,
                                target: tmp_dst
                            })

                        }
                    }
                    // else { <Attach to roots somehow> }
                }
            }

            console.log("TEMP_NODE_ARRAY HERE: ")
            console.log(temp_node_array)


            // Create links to these new nodes usingtemp_node_array
            if (layer != 0) {
                nodes.push( {
                    index: nodes.length,
                    r: 5
                })
            }

            console.log("Foo")
            console.log(prerequisite_layers[layer][m])

//            // Create links based on every position except 0 for previous layer
//            for(var n = 1; n < prerequisite_layers[layer-1][m].length; n++) {
//                links.push( {
//                    source:   ,
//                    target:
//                })
//            }

        }

        // Set up next layer

        layer++;
        temp_node_array.shift();       // Shift temp array away from values I don't need

        //temp_node_array.push([]);
        if (prerequisite_layers[layer] == undefined) { break }

    }

    // Link (layer - 1) to root node for that type
    // Also link any nodes (with appropriate link distance) that 'fell behind'



    console.log("-------------------END CREATE DEPENDANCEIS-------------------")
}

var link_strength = 0.5

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

    console.log("TESTING CREATION WITH: ")
    var test_val_TO_DELETE = 500
    console.log(csv_data_array[test_val_TO_DELETE])
    create_dependencies(csv_data_array[test_val_TO_DELETE])

    // Set links

//    console.log(csv_data_array)
//    console.log(nodes)
//    console.log(links)

    // This should be the same? (WEDNESDAY_1)
    simulation = d3.forceSimulation()
        .force("link", d3.forceLink()
            .strength(function(d) {
                if (d.source.index == 0) {
                    return link_strength;
                }
                else if ((d.source.index < num_categories) && (d.target.index < num_categories)) {
                    return link_strength;
                }
                return link_strength             

            })
            .distance(function(d) {
                if (d.source.index == 0) {
                    return link_distance_metric;
                }
                else if ((d.source.index < num_categories) && (d.target.index < num_categories)) {
                    return (algebra_hyp)
                }
                return link_distance_metric;
            }))
        .force("charge", d3.forceManyBody())
        .force("x", d3.forceX(0))
        .force("y", d3.forceY(0))
        .force("center", d3.forceCenter(width / 2, height / 2));

    // Set links between all nodes
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

    svg_nodes.append("circle")
        .attr("r", function(d) { return d.r })
        .style("fill", function(d) {
            if (csv_data_array[nodeID_to_featID_map.get(d.index)] != undefined)
            {
                return feat_type_to_color(csv_data_array[nodeID_to_featID_map.get(d.index)].type)
            }
            else {
                return feat_type_to_color(d.index)
            }
        });

    simulation
        .nodes(nodes)
        .on("tick", tick)

    simulation.force("link")
        .links(links)

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

var fixed_limit = num_categories

function drag_start() {
    if (d3.event.subject.index > fixed_limit) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d3.event.subject.fx = d3.event.subject.x;
        d3.event.subject.fy = d3.event.subject.y;
    }
}

function drag() {
    if (d3.event.subject.index > fixed_limit) {
        d3.event.subject.fx = d3.event.x;
        d3.event.subject.fy = d3.event.y;
    }
}

function drag_end() {
    if (d3.event.subject.index > fixed_limit) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d3.event.subject.fx = null;
        d3.event.subject.fy = null;
    }
}

// console.log(links)
// console.log(nodes)

// Function that slices prerequisite feats and returns and array of formatted feats
function parsefeats(d) {
    // Input must be a string
    if(typeof(d) != "string") { return -1; }

    // No prerequisite feats, return 0
    if (d == "") { return 0; } 

    // Replace pipes with commas (TODO: Make this visual), THIS DOESN'T WORK
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

