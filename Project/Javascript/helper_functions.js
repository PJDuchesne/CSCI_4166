/*
__/\\\\\\\\\\\\\_____/\\\\\\\\\\\__/\\\\\\\\\\\\____        
 _\/\\\/////////\\\__\/////\\\///__\/\\\////////\\\__       
  _\/\\\_______\/\\\______\/\\\_____\/\\\______\//\\\_      
   _\/\\\\\\\\\\\\\/_______\/\\\_____\/\\\_______\/\\\_     
    _\/\\\/////////_________\/\\\_____\/\\\_______\/\\\_    
     _\/\\\__________________\/\\\_____\/\\\_______\/\\\_   
      _\/\\\___________/\\\___\/\\\_____\/\\\_______/\\\__  
       _\/\\\__________\//\\\\\\\\\______\/\\\\\\\\\\\\/___
        _\///____________\/////////_______\////////////_____
-> Name:  helper_functions.js
-> Brief: Contains all functions used to aid other functions during the project
-> Date: March 2018
-> Author: Paul Duchesne (B00332119)
-> Contact: pl332718@dal.ca
*/


/*
    Function Name: compute_X / compute_Y
    Description: Algebra functions used in to modularly redraw the central category nodes
    Inputs: The relative order number of the object being rendered, 
    		which is converted to drgrees into the unit circle
    Outputs: The X or Y distance for the node position from center
*/
function compute_X(input) {
    return (Math.sin(2*Math.PI*(input/(modular_num_categories)))*middle_link_distance_metric)
}

function compute_Y(input) {
    return -(Math.cos(2*Math.PI*(input/(modular_num_categories)))*middle_link_distance_metric)
}

/*
    Function Name: feat_type_to_color
    Description: Converts feat type to color
    Inputs: The feat type, either by number (0, 8) or string
    Outputs: The corresponding feat color
*/
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
        case 'Item Creation':
            return 'Brown' 
            break;
        case 8:
        case 'Other':
            return 'Grey' 
            break;
        default:
            console.log("INVALID Type: " + type)
            break;
    }
}

/*
    Function Name: feat_type_to_number
    Description: Converts feat type to its ID number
    Inputs: The feat type as a string
    Outputs: The corresponding feat number
*/
function feat_type_to_number(type) {
    var upper_type = (typeof(type) == 'string') ? type.toUpperCase() : undefined
    switch (upper_type) {
        case 'ROOT':
            return 0
            break;
        case 'GENERAL':
            return 1 
            break;
        case 'COMBAT':
            return 2
            break;
        case 'MYTHIC':
            return 3
            break;
        case 'METAMAGIC':
            return 4
            break;
        case 'STORY':
            return 5
            break;
        case 'MONSTER':
            return 6
            break;
        case 'ITEM CREATION':
            return 7
            break;
        case 'OTHER':
            return 8
            break;
        default:
            console.log("INVALID Type: " + type)
            console.log(upper_type)
            return -1;
            break;
    }
}

/*
    Function Name: create_node
    Description: creates a node according to input parameters
    Inputs: feat_id (int): id (csv_data_array index) of the feat
    		layer (int): Layer number of feat
    		main (bool): Indicates whether this should be stored in the MAIN keymap or not (default false)
    		radius (bool): radius of node to be created (default 5)
    Outputs: index of new node (int)
*/
function create_node(feat_id, layer, main, radius) {
    if ((feat_id == undefined) || (typeof feat_id != "number")) {
        console.log("<create_node> ERROR: Invalid feat_id input type")
        console.log(feat_id)
        return -1
    }

    // default 'main' to false; default 'radius' to 5
    if (main == undefined) main = false;
    if (radius == undefined) radius = 5;

    // Push a new node for the feat itself, larger size!
    nodes.push( {
        index: nodes.length,
        layer: layer,
        r: radius
    })

    // Fill keymap for that node
    nodeID_to_featID_map.set(nodes.length - 1, feat_id)
    if (main) MAIN_featID_to_NodeID_map.set(feat_id, nodes.length - 1)    

    // Return new node index
    return nodes.length - 1;
}

/*
    Function Name: array_contains
    Description: Checks if an array of strings contains a given string
    Inputs: data: String to check
    		array: Array of strings to check against
    Outputs: True of False
*/
function array_contains(data, array) {

    // Basic error checking

    // Ensures array is an array
    if (typeof array != "object") return -1;

    // Ensures array has at least one entry
    if (array.length == 0) return false;

    // Ensures array is filled with same type as data
    if (typeof array[0] != typeof data) return -1;

    // Perform check itself
    for (var i = 0; i < array.length; i++) {
        if (array[i] == data) return true
    }
    
    // Default to array not containg the item
    return false;
}

/*
    Function Name: anything_to_feat_object
    Description: Converts the string name, int ID, or data object itself
    			 into the data object of that feat. This allows other functions
    			 to have modular input
    Inputs: feat string, ID, or data_obj of a feat
    Outputs: data object for that feat
*/
function anything_to_feat_object(data) {
    // Obtain data_obj no matter what time of input is given
    switch (typeof data) {
        case "number":
            return csv_data_array[data];
            break;
        case "string":
            return csv_data_array[featString_to_featID_map.get(data)];
            break;
        case "object":
            return data;
            break;
        default:
            console.log("<anything_to_feat_object> Error: Invalid input: ")
            console.log(data)
            return -1;
    }
}

/*
    Function Name: parsefeats
    Description: tokenizes a given string into individual values by a number of parameters
    Inputs: String to parse
    Outputs: Array of string tokens

   	NOTE: This was originally intended just to parse feats, but was also
   		  used to parse skills, races, and other pre-requisites during the project
*/
function parsefeats(d) {
    // Input must be a string
    if(typeof(d) != "string") { return -1; }

    // No prerequisite feats, return 0
    if (d == "") { return 0; } 

    // Replace pipes with commas
    d.replace(/\|/g, ",")

    // Replace semi-colons with commas
    d.replace(/\;/g, ",")

    // Remove some other unused characters
    d.replace(/\*/g, "")  // * used to indicate notes in the webpage
    d.replace(/\./g, "")  // * used to indicate notes in the webpage

    // Split array by commas
    var feat_array = d.split(",")

    // Remove unnessecary spaces on front and back of feats
    for(var i = 0; i < feat_array.length; i++ )
    {
        // Remove leading spaces
        if(feat_array[i].startsWith(" ")) {
            feat_array[i] = feat_array[i].slice(1)
        }

        // Remove trailing spaces
        if(feat_array[i].endsWith(" ")) {
            feat_array[i] = feat_array[i].slice(0, -1)
        }

        // Remove brackets (Unless Mythic!!!)
        if(feat_array[i].indexOf("(") != -1) {
            // Unless Mythic!
            if(feat_array[i].slice(-8) != "(Mythic)" || feat_array[i].includes("in lieu of BAB")) {
                feat_array[i] = feat_array[i].substring(0, feat_array[i].indexOf("("))

                // Remove trailing spaces (Again!)
                if(feat_array[i].endsWith(" ")) {
                    feat_array[i] = feat_array[i].slice(0, -1)
                }
            }
        }

        // Remove trailing spaces
        if(feat_array[i].endsWith(".")) {
            feat_array[i] = feat_array[i].slice(0, -1)
        }

    }

    return feat_array;
}

/*
    Function Name: random_start
    Description: returns a approximately the intended number of feat objects at random
    			 in order to allow a random distribution on startup.
    Inputs: aimed_length (approximately how many values to return)
    Outputs: Array of feat objects to render
*/
function random_start(aimed_length) {

	var return_array = []

	var rand_tmp = 0;

	var goal_val = Math.round(csv_data_array.length/aimed_length)

	for (var i = 0; i < csv_data_array.length; i++) {
		rand_tmp = Math.floor(Math.random() * goal_val)
		if (rand_tmp == 0) return_array.push(csv_data_array[i])
	}

	return return_array;
}


// Below these are simulation helper functions that are almost identicial
// to those used in every d3 Force Node implementation and are thus not explained in detail.

function tick() {
    svg_links
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    svg_nodes
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function drag_start() {
    if (d3.event.subject.index > num_categories) {
        if (!d3.event.active) simulation.alphaTarget(0.1).restart();
        d3.event.subject.fx = d3.event.subject.x;
        d3.event.subject.fy = d3.event.subject.y;
    }
}

function drag() {
    if (d3.event.subject.index > num_categories) {
        d3.event.subject.fx = d3.event.x;
        d3.event.subject.fy = d3.event.y;
    }
}

function drag_end() {
    if (d3.event.subject.index > num_categories) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d3.event.subject.fx = null;
        d3.event.subject.fy = null;
    }
}