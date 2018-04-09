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
-> Name: node_tree_functions.js
-> Brief: Contains all functions related to iteratively creating a dependency tree for each node.
          Essentially, this file contains create_dependencies() and the functions required to let it
          function.
-> Date: March 2018
-> Author: Paul Duchesne (B00332119)
-> Contact: pl332718@dal.ca
*/


/*
    Function Name: create_dependencies
    Description: Creates nodes and links for a single node, using many, many for loops
    Inputs: feat to creat node for (As string, ID, or object)
*/
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

/*
    Function Name: next_layer_checker
    Description: Takes in an array of feat names and checks which feats should
                 be displayed on the next layer. This takes into account mutual
                 and eventual depencencies and avoids aliasing feats.
    Inputs: Array of feat names
    Outputs: Array of feat names that should be directly on the next layer
*/
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

/*
    Function Name: PR_layers_fn
    Description: Creates an initial layered function of dependencies for a given feat.
    Inputs: feat (by string, ID, or object)
    Outputs: Layered structure containing all prerequites of previous layer on each layer. First layer is input feat.
    
    NOTE: This function does not account for duplicates
*/
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

/*
    Function Name: list_total_PR
    Description: This function returns all prerequisite feats that are required for the given feat
                 AND its prerequisites, iteratively down to the root.
    Inputs: feat (by string, ID, or object)
    Output: A single array that contains all prerequisite feats (implicit and explicit) for a given function

    NOTE: Does account for duplicates!
*/
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

/*
    Function Name: list_total_explicity_implicit_PR
    Description: This function takes the result from list_total_PR and splits it into explicit and implicit results:
                 Explicit Prerequisites: Those that no other prerequisite feat requires
                 Implicit Prerequisites: Those that are required by explicitely prerequisite feats
    Inputs: feat (by string, ID, or object)
    Output: structure { (With example values )
        explicit_prerequisites_STR: {}
        implicit_prerequisites_STR: {}
        explicit_prerequisites_ID: {}
        implicit_prerequisites_ID: {}
    }
*/
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