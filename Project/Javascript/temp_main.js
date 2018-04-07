// Main!

var width = 4500;
var height = 3000;
var link_distance_metric = 600;

var abilities_str = ["Str", "Dex", "Con", "Int", "Wis", "Cha"]

var tip_words = ["Ability Scores: ", "Skills: ", "Race: ", "Misc: "]
var tip_colors = ["blue", "brown", "violet", "black"]

var feat_categories = [ { name: "Root",
                          render: false }, // Always false to avoid throwing things off
                        { name: "General",
                          render: true },
                        { name: "Combat",
                          render: true },
                        { name: "Mythic",
                          render: true },
                        { name: "Metamagic",
                          render: true },
                        { name: "Story",
                          render: true },
                        { name: "Monster",
                          render: true },
                        { name: "Item Creation",
                          render: true },
                        { name: "Other",
                          render: true } ]

// Initialized to all of them
var modular_feat_categories = [ 1, 1, 1, 1, 1, 1, 1, 1, 1 ]

var algebra_angle;
var algebra_hyp;

// Number of categories, excluding root
var num_categories = feat_categories.length - 1
var modular_num_categories = feat_categories.length - 1
var middle_link_distance_metric = link_distance_metric

var csv_data_array;

var nodes = []
var links = []

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)

// Read in data and work with it
// NOTE: Will have to convert data
d3.csv("/Data/pathfinder_feats.csv", function(data) {
    csv_data_array = data;

    var pre_req_cnt = 0;

    format_csv_data_array()

    format_baseline()

    svg.call(node_tooltip)

});

// This originally found feats within the dataset whose prerequisites included itself
// However, this was simply a higher tier of feats, Mythic, that requires the lesser version of itself
// This was fixed by manually editing the csv file, this function was used to point which ones needed fixing
function format_csv_data_array() {
    console.log("------------------->>>> Formatting")

    // Fill keymap
    csv_data_array.forEach(function(element, index) {
        // Fill string to featID keymap
        featString_to_featID_map.set(element.name, index)
        featID_to_stringID_map.set(index, element.name)
    })

    var cnt = 0;
    var tmp_pre_r_array;
    var tmp_flag = 0;
    var new_pre_r_feats = "";

    // For every feat:
    for (var x = 0; x < csv_data_array.length; x++) {

        // Grab the pre-requisites
        tmp_pre_r_array = parsefeats(csv_data_array[x].prerequisite_feats)

        // If they exist
        if(!(tmp_pre_r_array <= 0)) {
            // Check if any prerequisites are themselves
            for (var y = 0; y < csv_data_array.length; y++) {
                if(csv_data_array[x].name == tmp_pre_r_array[y]) {
                    // Remove from array
                    tmp_pre_r_array.splice(y, 1)
                    console.log("THIS FEAT HAS ITSELF AS A PREREQUISITE")
                    console.log(csv_data_array[x])
                    console.log(x)
                    cnt++;
                    tmp_flag = 1;
                    break;
                }
            }

            if(tmp_flag == 1) {
                for (var y = 0; y < tmp_pre_r_array.length; y++) {
                    new_pre_r_feats += (tmp_pre_r_array[y] + ",")
                }
                // Cut off last useless comma
                new_pre_r_feats = new_pre_r_feats.substring(0, new_pre_r_feats.length-1)

                // Append new pre-requisite feats list to data array
                csv_data_array[x].prerequisite_feats = new_pre_r_feats

                tmp_flag = 0;
            }
        }

        // Remove confusing ID tags from dataset
        csv_data_array[x].id = x;
    }

    console.log(csv_data_array)

    // Formatting part 2: Adding many tokens to each feat object

    var dev_mode_tmp = false

    if (dev_mode_tmp) console.log("FORMATTING PART 2")

    var prerequisite_feat_tokens = []
    var skill_tokens = []
    var race_tokens = []
    var mixed_PR_tokens = []
    var tmp_length = 0

    for (var i = 0; i < csv_data_array.length; i++) {

        csv_data_array[i].prerequisite_bab = 0
        csv_data_array[i].ability_tokens = [];
        csv_data_array[i].prerequisite_misc = [];

        if (dev_mode_tmp) {
            console.log("BIG HERE: i: " + i)
            console.log(csv_data_array[i])
            console.log(mixed_PR_tokens)
        }

        prerequisite_feat_tokens = list_total_PR(csv_data_array[i])
        skill_tokens = parsefeats(csv_data_array[i].prerequisite_skills)
        race_tokens = parsefeats(csv_data_array[i].race_name)
        mixed_PR_tokens = parsefeats(csv_data_array[i].prerequisites)

        csv_data_array[i].prerequisite_feat_tokens = (typeof(prerequisite_feat_tokens) == 'object') ? prerequisite_feat_tokens : []
        csv_data_array[i].skill_tokens = (typeof(skill_tokens) == 'object') ? skill_tokens : []
        csv_data_array[i].race_tokens = (typeof(race_tokens) == 'object') ? race_tokens : []

        var tmp_length = 0;

        if (dev_mode_tmp) console.log(mixed_PR_tokens)

        // Add BAB and ability score fields to csv_data_array
        if(Array.isArray(mixed_PR_tokens)) {
            tmp_length = mixed_PR_tokens.length;
            var insanity_check = 0; // TODO: remove this check
            for (var n = 0; n < tmp_length; n++) {
                if (dev_mode_tmp) {
                    console.log("\tn: " + n)
                    console.log("\tToken: >>" + mixed_PR_tokens[n] + "<<")
                }

                if (mixed_PR_tokens[n].slice(0,17) == "base attack bonus") {
                    csv_data_array[i].prerequisite_bab = Number(mixed_PR_tokens[n].slice(19))
                    if (dev_mode_tmp) {
                        console.log("\t\tFound a BAB! -> " + csv_data_array[i].prerequisite_bab)
                        console.log("\t\tBAB From -> " + mixed_PR_tokens[n])
                    }
                    mixed_PR_tokens.splice(n, 1)
                    n--;
                    tmp_length--;
                }
                else if(array_contains(mixed_PR_tokens[n].slice(0, 3), abilities_str)) {
                    csv_data_array[i].ability_tokens.push(mixed_PR_tokens[n])
                    if (dev_mode_tmp) console.log("\t\tFound an attribute! ->>" + mixed_PR_tokens[n] + "<<")
                    mixed_PR_tokens.splice(n, 1)
                    n--;
                    tmp_length--;
                }
                insanity_check++
                if(insanity_check > 20) break;
            }
        }

        if (dev_mode_tmp) {
            console.log(prerequisite_feat_tokens)
            console.log(skill_tokens)
            console.log(race_tokens)
            console.log(mixed_PR_tokens)
        } 
        tmp_length = mixed_PR_tokens.length
        for(var n = 0; n < tmp_length; n++) {
            if (dev_mode_tmp) console.log("\t\tCHECKING: >>" + mixed_PR_tokens[n].slice() + "<<")
            // Check if this is a feat, skill or race (Can't be an attribute or BAB, those were already removed)
            if (array_contains(mixed_PR_tokens[n], prerequisite_feat_tokens) ||
                array_contains(mixed_PR_tokens[n].slice(0, -6), skill_tokens) ||
                array_contains(mixed_PR_tokens[n], race_tokens)) {
                mixed_PR_tokens.splice(n, 1)
                n--;
                tmp_length--;
            }
        }

        // Set remainder to misc tokens field
        csv_data_array[i].misc_tokens = mixed_PR_tokens;

        if (dev_mode_tmp) console.log(mixed_PR_tokens)

    }

    console.log(csv_data_array)

    console.log("--------------->>>> Formatting END: " + cnt)
}

function compute_X(input) {
    return (Math.sin(2*Math.PI*(input/(modular_num_categories)))*middle_link_distance_metric)
}

function compute_Y(input) {
    return -(Math.cos(2*Math.PI*(input/(modular_num_categories)))*middle_link_distance_metric)
}

// Input: Array of categories (1 or 0 to indicate rendering)
function initialize_central_nodes() {

    modular_num_categories = 0;

    for (var i = 0; i < feat_categories.length; i++) {
        if (feat_categories[i].render == true) modular_num_categories++;
    }

    algebra_angle = (Math.PI/modular_num_categories)
    algebra_hyp = 2*middle_link_distance_metric*Math.sin(algebra_angle)

    nodes.push({ index: i,
                   fx: width/2,
                   fy: height/2,
                   r: 30})

    var modular_i = 0

    var node_cache = []
    var node_cache2 = []

    console.log(feat_categories)

    // Render category nodes that are set to be rendered, otherwise render them offscreen
    for (var i = 0; i < modular_num_categories; i++) {

/*
        nodes.push({ index: nodes.length,
         fx: width/2 + compute_X(i),
         fy: height/2 + compute_Y(i),
         r: 20 })
*/
        console.log("test")
        console.log(feat_categories[i].render)

        if(feat_categories[i].render == true) {
            console.log("FOO")

            node_cache.push(nodes.length)

            nodes.push({ index: nodes.length,
                     fx: width/2 + compute_X(modular_i),
                     fy: height/2 + compute_Y(modular_i),
                     r: 20 })

            modular_i++;
        }
        else { // DEAR PAUL: THIS IS PUSHING TO THE ROOT!!!
            console.log("BAR")

            node_cache2.push(nodes.length)

            nodes.push({ index: nodes.length,
                     fx: -50,
                     fy: -50,
                     r: 20 })

        }

    }

    console.log("NODE CACHES HERE")
    console.log(node_cache)
    console.log(node_cache2)

    for (var i = 0; i < modular_num_categories; i++) {
        links.push({ source: 0,
                     target: i+1})
    }

    for (var i = 1; i < modular_num_categories + 1; i++) {
        if (i < modular_num_categories ) {
            links.push( {
                source: i,
                target: i+1,
                type: i
            })
        }
        else {
            links.push( {
                source: i,
                target: 1,
                type: i
            })
        }
    } 
}

// These two functions from Mike Bostock (Main D3 Developer)
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
        case 'Item Creation':
            return 'Brown' 
            break;
        case 8:
        case 'Other':
            return 'Grey' 
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
        case 'Item Creation':
            return 7
            break;
        case 'Other':
            return 8
            break;
        default:
            console.log("INVALID Type: " + type)
            return -1;
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

// TODO: Write input/output information here
function create_dependencies(data) {
    var dev_mode_tmp = false;



    if (dev_mode_tmp) console.log("---------------------CREATE DEPENDANCEIS---------------------")

    // TODO: Error checking that the input node is valid

    var data_obj = anything_to_feat_object(data);

    // If the render function for this type is off, return immediately.
    if(!feat_categories[feat_type_to_number(data_obj.type)].render) return;

    var feat_type = feat_type_to_number(data_obj.type)

    if (dev_mode_tmp) {
        console.log("DATA: ")
        console.log(data_obj)
    }

    var tmp_total_EI_PR;
    var tmp_total_PR;
    var tmp_node_ID;

    // Create node for input feat
    tmp_node_ID = create_node(data_obj.id, 0, true, 10)

    var layer_cache = [[data_obj.name]]
    var node_cache = [[tmp_node_ID]]

    var layer = 0;

    // Use 'next_layer_checker' to fill layer_cache 
    while(1) {
        // Add new layer to caches
        node_cache.push([])
        layer_cache.push(next_layer_checker(layer_cache[layer]))

        if (layer_cache[layer+1].length == 0) { 
            layer_cache.pop()
            node_cache.pop()
            break;
        }
        layer++;
    }

    var tmp_node_ID

    // Use layer_cache to create nodes and fill node_cache
    for (layer = 1; layer < layer_cache.length; layer++) {
        for (var i = 0; i < layer_cache[layer].length; i++) {
            tmp_node_ID = create_node(featString_to_featID_map.get(layer_cache[layer][i]), layer)
            node_cache[layer].push(tmp_node_ID)
        }   
    }

    // Decrement layer counter because it incremented beyond maximum layer in previous for loop
    layer--;

    // Create links starting from the highest layer and going to 0
    // Using 'node_cache'

    if (dev_mode_tmp) {
        console.log("layer_cache")
        console.log(layer_cache.slice())
        console.log("node_cache")
        console.log(node_cache)
    }

    // Link all nodes on final layer to appropriate root node
    for (var i = 0; i < node_cache[layer].length; i++) {
        links.push({
            source: feat_type,
            target: node_cache[layer][i]
        })
    }

    // For each layer (working backwards)
    for ( ; layer >= 0; layer--) {
        if (dev_mode_tmp) console.log("LAYER: " + layer + " ______________ TOP")

        for (var i = 0; i < node_cache[layer].length; i++) {
            if (dev_mode_tmp) console.log("\t\I: " + i)

            // Check each node cache layer
            for (var x = 0; x < layer /*node_cache.length */; x++) {
                if (dev_mode_tmp) console.log("\t\tX: " + i)

                // Check each feat within each node cache layer
                for (var y = 0; y < node_cache[x].length; y++) {
                    if (dev_mode_tmp) console.log("\t\t\tY: " + i)

                    tmp_total_EI_PR = list_total_explicity_implicit_PR(nodeID_to_featID_map.get(node_cache[x][y]))

                    if (dev_mode_tmp) {
                        console.log("\t\t\tTesting Here: (data, <node_cache[x][y]> array)")
                        console.log(node_cache[layer][i])
                        console.log(tmp_total_EI_PR.explicit_prerequisites_ID)
                    }

                    if (array_contains(nodeID_to_featID_map.get(node_cache[layer][i]), tmp_total_EI_PR.explicit_prerequisites_ID)) {
                        links.push({
                            source: node_cache[layer][i],
                            target: node_cache[x][y]
                        })
                    }

                    if (tmp_total_EI_PR.explicit_prerequisites_ID.length == 0) {
                        links.push({
                            source: feat_type,
                            target: node_cache[x][y]
                        })
                    }
                }
            }
        }
    }

    if (dev_mode_tmp) {
        console.log("Testing: " + data_obj.name)
        console.log(list_total_explicity_implicit_PR(data_obj))

        console.log("-------------------END CREATE DEPENDANCEIS-------------------")
    }
}

// Input: Array of feat names
// Output: Array of feat names that should be directly on the next layer
function next_layer_checker(input_array) {
    var dev_mode_tmp = false;

    if(dev_mode_tmp) console.log("\n\n\n---------------------next_layer_checker---------------------\n\n\n");

    // If array is empty, return an empty array
    if (input_array == [] || input_array == undefined) return [];

    // Array of total PR for each feat in input array
    total_PR_array = []

    // Array of total EI PR for each feat in input array
    total_EI_PR_array = []

    // Fill information first
    for (var i = 0; i < input_array.length; i++) {
        total_PR_array.push(list_total_PR(input_array[i]))
        total_EI_PR_array.push(list_total_explicity_implicit_PR(input_array[i]))
    }

    var push_flag;
    var next_layer_array = []

    // Then go through every feat in input array
    for (var i = 0; i < input_array.length; i++) {
        if(dev_mode_tmp) console.log("Test1: " + i + "  ______________ TOP");

        // Go through every feat that this PR explicitly requires, see if any of the other feats IMplicitly require it
        for (var n = 0; n < total_EI_PR_array[i].explicit_prerequisites_STR.length; n++) {
            if(dev_mode_tmp) console.log("Test2: " + n);
            push_flag = true;

            // Go through the other input feats...
            for (var x = 0; x < total_EI_PR_array.length; x++) {
                if(dev_mode_tmp) console.log("Test3: " + x);
                // Don't check the current input feat
                if (x == i) continue;

                if (array_contains(total_EI_PR_array[i].explicit_prerequisites_STR[n], total_EI_PR_array[x].implicit_prerequisites_STR)) {
                    push_flag = false
                    break;
                }
            }

            if (push_flag) {
                // Only actually push if this has not already been added to the array (To avoid duplicates)
                if(!array_contains(total_EI_PR_array[i].explicit_prerequisites_STR[n], next_layer_array)) {
                    next_layer_array.push(total_EI_PR_array[i].explicit_prerequisites_STR[n])
                }
            }
        }
    }

    if(dev_mode_tmp) {
        console.log("Testing values here")
        console.log(input_array)
        console.log(total_PR_array)
        console.log(total_EI_PR_array)

        console.log("\nReturning: ")
        console.log(next_layer_array)

        console.log("\n\n\n-------------------next_layer_checker END-------------------\n\n\n");
    }

    return next_layer_array;
}

// Input: int <> int <> bool <> int (Last two have assumed values)
// Creates a node, adds to appropriate keymaps
// Output: New node
function create_node(feat_id, layer, main, radius) {
    if ((feat_id == undefined) || (typeof feat_id != "number")) {
        console.log("<create_node> ERROR: Invalid feat_id input type")
        console.log(feat_id)
        return -1
    }

    // default 'main' to true; default 'radius' to 5
    if (main == undefined) main = false;
    if (radius == undefined) radius = 5;

    // Push a new node for the feat itself, larger size!
    nodes.push( {
        index: nodes.length,
        layer: layer,
        r: radius
    })

    // Fill keymap for that node
        // featID_to_NodeID_map.set(featID_to_NodeID_map.size, nodes.length - 1) // TODO: Make this append to existing listing
    nodeID_to_featID_map.set(nodes.length - 1, feat_id)
    if (main) MAIN_featID_to_NodeID_map.set(feat_id, nodes.length - 1)    

    // Return new node index
    return nodes.length - 1;
}


// Checks if an array contains a given string or integer
// Returns true if the array contains the entry
// Returns false if the array does not contain the entry
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

// Input: string name of feat or data object itself or feat ID
// Output: Layered structure containing all prerequites of previous layer on each layer. First layer is input feat
//      NOTE: Does not account for duplicates
function PR_layers_fn(data) {
    var dev_mode_tmp = false;

    if (dev_mode_tmp) console.log("\n\n\n---------------------PR_layers_fn---------------------\n\n\n");

    // Temporary variables for function
    var temp_PR_feats = [];
    var data_obj = anything_to_feat_object(data)

    var PR_layers = [[data_obj.name]]

    // If no PR, then return immediately
    if(data_obj.prerequisite_feats == "") {
        if(dev_mode_tmp) {
            console.log("Data: ")
            console.log(data_obj)
            console.log("Has no prerequisite_feats")
        }
        return PR_layers;
    }
    else {
        // Set first layer to the input feat itself
        var PR_layers = [[data_obj.name]]

        var layer = 0;

        while(1) {
            // Push a new layer on to be filled, this is layer number 'layer+1'
            PR_layers.push([])

            // For every feat on this layer
            for (var i = 0; i < PR_layers[layer].length; i++) {
                // Directly access array of prerequisite feats from the string name of the feat
                temp_PR_feats = parsefeats(csv_data_array[featString_to_featID_map.get(PR_layers[layer][i])].prerequisite_feats)

                // Add those feats directly to next layer, ignoring any duplicates
                if (temp_PR_feats != "") PR_layers[layer+1] = PR_layers[layer+1].concat(temp_PR_feats)
            }

            if(dev_mode_tmp) {
                console.log("Layer: " + layer)
                console.log(PR_layers.slice())
            }
            layer++

            // Check if done: (No prerequisites to get from next layer)
            if(PR_layers[layer].length == 0) break

            // TODO: Remove this insanity check
            if(layer > 20) break
        }

        // Pop off the last layer, which is empty
        PR_layers.pop()
    }

    if (dev_mode_tmp) console.log("\n\n\n-------------------PR_layers_fn END-------------------\n\n\n");

    return PR_layers
}

// Input: string name of feat or data object itself or feat ID
// Output: data object for that feat
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

// Input: string name of feat or data object itself or feat ID
// Output: A single array that contains all prerequisite feats (implicit and explicit) for a given function
// NOTE: Does account for duplicates!
function list_total_PR(data) {
    var dev_mode_tmp = false;

    if (dev_mode_tmp) { 
        console.log("\n\n\n---------------------LIST TOTAL PR---------------------\n\n\n");
        console.log(data)
    }

    // Return Value
    var total_PR = [];

    var PR_layers = PR_layers_fn(data)

    // Fill the total_PR for returning!
    // Intentionally skip first item, which is the input feat itself
    for (var i = 1; i < PR_layers.length; i++) {
        for(var x = 0; x < PR_layers[i].length; x++) {
            // If total_PR does not contain this entry, then add it
            if(!(array_contains(PR_layers[i][x], total_PR))) {
                total_PR.push(PR_layers[i][x])
            }
        }
    }

    if (dev_mode_tmp) {
        console.log("PR_layers")
        console.log(PR_layers.slice())

        console.log("Returning: ")
        console.log(total_PR)

        console.log("\n\n\n-------------------END LIST TOTAL PR-------------------\n\n\n")
    }

    return total_PR;
}

// Input: string name of feat or data object itself or feat ID
// Output: 
    // This function will return and structure that has four fields:
    // explicit_prerequisites_STR: {A_str, B_str, C_str}
    // implicit_prerequisites_STR: {D_str, E_str, F_str, G_str}
    // explicit_prerequisites_ID: {A_id, B_id, C_id}
    // implicit_prerequisites_ID: {D_id, E_id, F_id, G_id}
function list_total_explicity_implicit_PR(data) {
    var dev_mode_tmp = false;

    if(dev_mode_tmp) console.log("\n\n\n---------------------list_total_explicity_implicit_PR---------------------\n\n\n");

    // Wasteful? Yes? #JustJavascriptThings
    var return_structure = {
        explicit_prerequisites_STR: [],
        implicit_prerequisites_STR: [],
        explicit_prerequisites_ID: [],
        implicit_prerequisites_ID: []
    }

    var total_input_PR = list_total_PR(data);

    var total_PR_PR_array = [];
    var data_PR_feats = parsefeats(anything_to_feat_object(data).prerequisite_feats);

    var implicit_flag_array = new Array(data_PR_feats.length).fill(false)

    // Fill total_PR_PR_array
    for (var i = 0; i < data_PR_feats.length; i++) {
        total_PR_PR_array.push(list_total_PR(data_PR_feats[i]))
    }

    // Set implicit_flag_array based on total_PR_PR_array
    for (var i = 0; i < data_PR_feats.length; i++) {
        for (var x = 0; x < data_PR_feats.length; x++) {
            if (x == i) continue;

            // If this data_PR is a PR to another data_PR, it is an implicit requirement
            if (array_contains(data_PR_feats[i], total_PR_PR_array[x])) {
                implicit_flag_array[i] = true;
                break;
            }
        }
    }

    // TODO: Properly test this
    // Remove data_PR_feats from total_input_PR
    for (var i = 0; i < data_PR_feats.length; i++) {
        for (var x = 0; x < total_input_PR.length; x++) {
            if (data_PR_feats[i] == total_input_PR[x]) {
                total_input_PR.splice(x, 1)
                break;
            }
        }
    }

    // Set explicit feats into structure, plus any that are actually implicit (Based on the flag array)
    for (var i = 0; i < data_PR_feats.length; i++) {
        if (implicit_flag_array[i] == true) {
            return_structure.implicit_prerequisites_STR.push(data_PR_feats[i])
            return_structure.implicit_prerequisites_ID.push(featString_to_featID_map.get(data_PR_feats[i]))
        }
        else {
            return_structure.explicit_prerequisites_STR.push(data_PR_feats[i])
            return_structure.explicit_prerequisites_ID.push(featString_to_featID_map.get(data_PR_feats[i]))
        }
    }

    // TODO: Properly test this
    for (var i = 0; i < total_input_PR.length; i++) {
        return_structure.implicit_prerequisites_STR.push(total_input_PR[i])
        return_structure.implicit_prerequisites_ID.push(featString_to_featID_map.get(total_input_PR[i]))
    }

    if (dev_mode_tmp) {
        console.log("Returning: ")
        console.log(return_structure)
        console.log("\n\n\n-------------------list_total_explicity_implicit_PR END-------------------\n\n\n")
    }

    return return_structure
}


/* New Modular Rendering Function:
    Input 1: Mode of operation
        0: Render Categories (Including rerendering the central node)
            Input 2: Array of Categories to render
        1: Render an array of feats (On default central creation)
            Input 2: Array of Feats to render
        2: Render an array of feats from within specific categories
            Input 2: Array of Categories to render
            Input 3: Array of feats to render

*/

function modular_render(d1, d2, d3) {
    // Stop simulation?
    simulation.stop()

    if (d1 == 0) {  // Render Categories Mode

        // Clear existing links and svg canvas
        nodes = []
        links = []

        // Clear existing svg canvas?



    }
    else if (d1 == 1) { // Render node mode

    }



}














//var link_strength = 0.8
var link_strength = 0.6
var link_distance_metric = 75

function format_baseline() {

    initialize_central_nodes();

    var yay1 = 0;
    var nay1 = 0;

    var yay2 = 0;
    var nay2 = 0;

    // NODES ARE CREATED HERE
    //for (var i = 0; i < csv_data_array.length; i++) {
    for (var i = 400; i < 500; i++) {
        // create_dependencies(csv_data_array[i])
        if (csv_data_array[i].prerequisite_feats != "") create_dependencies(csv_data_array[i])
    }

    // Set links
    console.log("NODES HERE")
    console.log(nodes)
    console.log("LINKS HERE")
    console.log(links)

    simulation = d3.forceSimulation()
        .force("link", d3.forceLink()
            .strength(function(d) {
                if (d.source.index == 0) {
                    return link_strength;
                }
                else if ((d.source.index < modular_num_categories) && (d.target.index < modular_num_categories)) {
                    return link_strength;
                }
                return link_strength             

            })
            .distance(function(d) {
                if (d.source.index == 0) {
                    return link_distance_metric;
                }
                else if ((d.source.index <= modular_num_categories) && (d.target.index <= modular_num_categories)) {
                    return (algebra_hyp)
                }
                // If they both have layers attached (Which they should), build link distance based off this
                else if ((nodes[d.source.index].layer != -1) && (nodes[d.target.index].layer != -1)) {
                    // Distance of 50 for each link layer apart, this will generally be 50 --> TODO: Variable this, or build it off 'link_distance_metric'
                    return Math.abs((nodes[d.source.index].layer - nodes[d.target.index].layer != -1))*link_distance_metric
                }
                return link_distance_metric;
            }))
        .force("charge", d3.forceManyBody()
            .strength(function(d) {
                if(d.index == 0) { // Make middle ROOT act as a VERY repulsive gravity force
                    return -10000
                }
                else if (d.index < modular_num_categories + 1) {
                    return -1500 // Make each category node act as a somewhat resulive gravity force
                }
                else {
                    return -25 // Give each feat some gravity to help with avoiding overlap
                }
            }))
        //.force("x", d3.forceX(0))
        //.force("y", d3.forceY(0))
        //.force("center", d3.forceCenter().x(width*0.5).y(height*0.5))
        //.force("repulsion", d3.forceManyBody().strength(-150))
        .force("collision", d3.forceCollide().radius(12))
        //.force("gravity", d3.forceManyBody(-250))

    // Set links between all nodes
    svg_links = svg.selectAll(".link")
        .data(links)
        .enter().append("line")
        .attr("class", "link")
        .attr("stroke-width", 1)
        .attr("stroke", "black");

    var tmp_i = 0;

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
        if (!d3.event.active) simulation.alphaTarget(0.1).restart();
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

// Function that slices prerequisite feats and returns and array of formatted feats
// Also works for skills and general PR field
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
            if(feat_array[i].slice(-8) != "(Mythic)") {
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

// TOOLTIP STUFF HERE: Uses the d3-tip library extension that mimics d3-v3's tooltip functionality

// TODO: Total PR (Including Feats and non-feats) function
    // Ability Scores + Levels
    // Skills + Levels
    // BAB
    // Races
    // "Misc": Which won't be filterabler (Trait, char level, caster level, etc.

// Input: Array of values to be iterated through and give colors of stuff
function tip_return_val(data) {

    var data_obj = anything_to_feat_object(data);

    console.log(data_obj)

    var return_str = ("<span style ='color:red'>Name: </span>" + data_obj.name + "<br>")

    var tmp_string = ""

    var tmp_array = [data_obj.ability_tokens,
                     data_obj.skill_tokens,
                     data_obj.race_tokens,
                     data_obj.misc_tokens]

    console.log(tmp_array[0])

    for (var i = 0; i < tmp_array.length; i++) {
        if((tmp_array[i] != 0) && (tmp_array[i] != -1) && (tmp_array[i] != []) && (tmp_array[i] != undefined)) {
            return_str += ("<span style ='color:" + tip_colors[i] + "'>" + tip_words[i] + "</span>")

            for (var n = 0; n < tmp_array[i].length; n++) {
                return_str += (tmp_array[i][n] + ", ")
            }

            // Remove last ", " added
            return_str = return_str.slice(0, -2)

            // Add <br>
            return_str += "<br>"
        }
    }

    if (data_obj.prerequisite_bab != 0 && data_obj.prerequisite_bab != undefined) {
        return_str += ("<span style ='color:green'>BAB: </span>" + data_obj.prerequisite_bab + "<br>")
    }

    return return_str;
}

var node_tooltip = d3.tip()
    .attr("class", "d3-tip")
    .attr("id", "d3-tip")
    .offset([-8, 0])
    //.style("width", "300px") // TODO: Figure out why this doesn't work
    .html(function(d) { 
        var tmp_dev_mode = true;

        if (tmp_dev_mode) {
            console.log("----------------TOOLTIP---------------")
            console.log(d)
            console.log("Feat ID: " + nodeID_to_featID_map.get(d.index))
            console.log("FEAT NAME: " + featID_to_stringID_map.get(nodeID_to_featID_map.get(d.index)))
        }

        if (tmp_dev_mode) console.log("----------------TOOLTIP_END-----------")

        // If this is within the central node
        if(d.index <= num_categories) {
            return ("<span style='color: red'>Feat Category: </span>" + feat_categories[d.index].name)
        }
        // Else this is a feat node
        else {
            return tip_return_val(nodeID_to_featID_map.get(d.index));
        }

    })
