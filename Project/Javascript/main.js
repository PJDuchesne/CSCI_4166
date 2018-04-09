// Main!

// <<<<<<<<<<<<<<<<<<< SECTION BREAK: Globals >>>>>>>>>>>>>>>>>>>>>

var width = 3500;
var height = 2750;

var link_strength = 0.6
var link_distance_metric = 75
var middle_link_distance_metric = link_distance_metric*8

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
                        { name: "Items",
                          render: true },
                        { name: "Other",
                          render: true } ]

var render_all = [true, true, true, true, true, true, true, true, true]

var render_none = [false, false, false, false, false, false, false, false, false]

var algebra_angle;
var algebra_hyp;

// Number of categories, excluding root
var num_categories = feat_categories.length - 1
var modular_num_categories = feat_categories.length - 1

var central_node_cache = []

var csv_data_array;

var nodes = []
var links = []

var simulation = undefined
var svg_nodes
var svg_links

// Filled outright in format_baseline()
var featString_to_featID_map = new Map();
var featID_to_stringID_map = new Map();

// Filled as nodes are created in create_dependencies()
var nodeID_to_featID_map = new Map();
var MAIN_featID_to_NodeID_map = new Map();  // Will list the one FINAL node associated with a given feat

// SVG & MENU STUFF

var tau = 2*Math.PI

var myArc_outer = d3.arc()
    .innerRadius(20)
    .outerRadius(35)
    .startAngle(0.5*tau)
    .endAngle(-0.25*tau);

var myArc_inner = d3.arc()
    .innerRadius(0)
    .outerRadius(20)
    .startAngle(0.5*tau)
    .endAngle(-0.25*tau);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)

// Function to return line coordinates to draw
var linefunction = d3.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

var rect_width = 600
var rect_height = 800
var rect_offset = 10

var box = svg.append("rect")
    .attr("x", rect_offset)
    .attr("y", rect_offset)
    .attr("class", "menu")
    .attr("width", rect_width)
    .attr("height", rect_height)
    .style("opacity", 0.25)
    .attr("fill", "#4a4a4f")

var border_data = [{ "x": rect_offset, "y": rect_offset }, { "x": rect_offset + rect_width, "y": rect_offset},
                    { "x": rect_width + rect_offset, "y": rect_height + rect_offset }, { "x": rect_offset, "y": rect_height + rect_offset},
                    { "x": rect_offset, "y": rect_offset - 1} ]

var border = svg.append("path")
    .attr("d", linefunction(border_data))
    .attr("stroke-width", 2)
    .attr("stroke", "black")
    .attr("fill", "none");

var tri_start = {x: 31, y: 60}

var triangle_data = [{"x": tri_start.x - 12, "y": tri_start.y }, {"x": tri_start.x + 12, "y": tri_start.y },
                     {"x": tri_start.x, "y": tri_start.y + 15},  {"x": tri_start.x - 10, "y": tri_start.y }]

var back_button_1 = svg.append("path")
    .attr("d", myArc_outer)
    .attr("fill", "black")
    .style("cursor", "pointer")
    .attr("transform", "translate(60, 60)")
    .on("click", function() { cache_display_fn() });

var back_button_2 = svg.append("path")
    .attr("d", linefunction(triangle_data))
    .attr("stroke-width", 1)
    .attr("stroke", "none")
    .attr("fill", "black")
    .on("click", function() { cache_display_fn() });

var back_button_3 = svg.append("path")
    .attr("d", myArc_inner)
    .attr("fill", "#4a4a4f")
    .style("opacity", 0)
    .style("cursor", "pointer")
    .attr("transform", "translate(60, 60)")
    .on("click", function() { cache_display_fn() });

var clear_button = svg.append("rect")
    .attr("x", 445)
    .attr("y", 20)
    .attr("width", 150)
    .attr("height", 65)
    .style("opacity", 0.5)
    .style("cursor", "pointer")
    .attr("fill", "#4a4a4f")
    .attr("stroke-width", 5)
    .attr("stroke", "black")
    .on("click", function () { clear_button_fn() })

var clear_button_text = svg.append("text")
    .attr("x", 477)
    .attr("y", 70)
    .style("fill", "Black")
    .style("font-size", "40px")
    .style("cursor", "pointer")
    .text("clear")
    .on("click", function () { clear_button_fn() })

var filter_button = svg.append("rect")
    .attr("x", 445)
    .attr("y", 730)
    .attr("width", 150)
    .attr("height", 65)
    .style("opacity", 0.5)
    .style("cursor", "pointer")
    .attr("fill", "#4a4a4f")
    .attr("stroke-width", 5)
    .attr("stroke", "black")
    .on("click", function () { filter_button_fn() })

var filter_button_text = svg.append("text")
    .attr("x", 475)
    .attr("y", 777)
    .style("fill", "Black")
    .style("font-size", "40px")
    .style("cursor", "pointer")
    .text("filter")
    .on("click", function () { filter_button_fn() })

var search_button = svg.append("rect")
    .attr("x", 25)
    .attr("y", 730)
    .attr("width", 150)
    .attr("height", 65)
    .style("opacity", 0.5)
    .style("cursor", "pointer")
    .attr("fill", "#4a4a4f")
    .attr("stroke-width", 5)
    .attr("stroke", "black")
    .on("click", function () { search_button_fn() })

var search_button_text = svg.append("text")
    .attr("x", 55)
    .attr("y", 777)
    .style("fill", "Black")
    .style("font-size", "40px")
    .style("cursor", "pointer")
    .text("Search")
    .on("click", function () { search_button_fn() })

console.log("BOX")
console.log(box)

var text = svg.append("text")
    .attr("x", 215)
    .attr("y", 107)
    .style("fill", "brown")
    .style("font-size", "100px")
    .text("menu")

var search_options_text = svg.append("text")
    .attr("x", 30)
    .attr("y", 180)
    .style("fill", "Black")
    .style("font-size", "50px")
    .text("Search Options")

var feat_text = svg.append("text")
    .attr("x", 30)
    .attr("y", 238)
    .style("fill", "Black")
    .style("font-size", "36px")
    .text("Feat (String): ")

var feat_text_box = svg.append("foreignObject")
    .attr("x", 240)
    .attr("y", 200)
    .attr("width", 100)
    .attr("height", 200)
    .append("xhtml:body").append("xhtml:input")
        .attr("id", "feat_text_box")
        .attr("size", 18)
        .attr("type","input")
        .attr("placeholder", "Feat Search String")
        .style("font-size", "25px")

var race_text = svg.append("text")
    .attr("x", 30)
    .attr("y", 290)
    .style("fill", "Black")
    .style("font-size", "36px")
    .text("Race (String): ")

var race_text_box = svg.append("foreignObject")
    .attr("x", 240)
    .attr("y", 250)
    .attr("width", 100)
    .attr("height", 200)
    .append("xhtml:body").append("xhtml:input")
        .attr("id", "race_text_box")
        .attr("size", 18)
        .attr("type","input")
        .attr("placeholder", "Race Search String")
        .style("font-size", "25px")

var range_text = svg.append("text")
    .attr("x", 30)
    .attr("y", 342)
    .style("fill", "Black")
    .style("font-size", "36px")
    .text("ID Range (Int, Int): ")

var lower_bound_text_box = svg.append("foreignObject")
    .attr("x", 240)
    .attr("y", 300)
    .attr("width", 100)
    .attr("height", 200)
    .append("xhtml:body").append("xhtml:input")
        .attr("id", "lower_bound_text_box")
        .attr("size", 6)
        .attr("type","input")
        .attr("placeholder", "Lower Bound")
        .style("font-size", "25px")

var upper_bound_text_box = svg.append("foreignObject")
    .attr("x", 415)
    .attr("y", 300)
    .attr("width", 100)
    .attr("height", 200)
    .append("xhtml:body").append("xhtml:input")
        .attr("id", "upper_bound_text_box")
        .attr("size", 6)
        .attr("type","input")
        .attr("placeholder", "Upper Bound")
        .style("font-size", "25px")

var range_text = svg.append("text")
    .attr("x", 30)
    .attr("y", 394)
    .style("fill", "Black")
    .style("font-size", "36px")
    .text("Feat Types: ")

var search_results_text = svg.append("text")
    .attr("x", 30)
    .attr("y", 525)
    .style("fill", "Black")
    .style("font-size", "50px")
    .text("Search Results (First 5)")

for (var i = 1; i < 9; i++) {
    var tmp_x = (i > num_categories/2) ? (i-4) : i
    var tmp_y = (i > num_categories/2) ? 1 : 0

    svg.append("foreignObject")
        .attr("class", "cb")
        .attr("x", 130+tmp_x*90).attr("y", (350 + tmp_y*50))
        .attr("width", 100).attr("height", 200)
        .append("xhtml:body").append("xhtml:input")
            .attr("id", ("cb" + i))
            .attr("value", true)
            .attr("size", 9).attr("id", ("cb" + i))
            .attr("type","checkbox")

    svg.append("text")
        .attr("x", 120 + tmp_x*90 + ((i >= 7) ? 8 : 0))
        .attr("y", 410 + tmp_y*50)
        .style("fill", "rgb(41, 73, 98)")
        .style("font-size", "25px")
        .text(feat_categories[i].name)

}

// Read CSV file to create nodes
d3.csv("/Data/pathfinder_feats.csv", function(data) {
    // Store data for future usage
    csv_data_array = data;

    // Do *some* preprocessing of the data
    format_csv_data_array()

    // Launch the default version of the visualization
    format_baseline()

    // Enable tooltips
    svg.call(node_tooltip)
});


// <<<<<<<<<<<<<<<<<<< SECTION BREAK: Helper Functions >>>>>>>>>>>>>>>>>>>>>

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
        csv_data_array[i].misc_tokens = [];

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

// Input: Array of categories (1 or 0 to indicate rendering)
function initialize_central_nodes() {

    var dev_mode_tmp = false;

    if (dev_mode_tmp) console.log("---------------------------initialize_central_nodes---------------------------")

    modular_num_categories = 0;
    var category_node_r = 20
    var root_node_r = 30

    for (var i = 0; i < feat_categories.length; i++) {
        if (feat_categories[i].render == true) modular_num_categories++;
    }

    switch (modular_num_categories) {
        case 1:
            middle_link_distance_metric = 0;
            break;
        case 2: 
            middle_link_distance_metric = link_distance_metric*4
            break;
        default:
            middle_link_distance_metric = link_distance_metric*8
            break;
    }

    if (dev_mode_tmp) {
        console.log("modular_num_categories: " + modular_num_categories)
        console.log(middle_link_distance_metric)
    }

    // Initialize nodes with central root (TODO: Not do this if modular_num_categories == 1)

    // Render central root node if at least 2 categories are being rendered, else render it offscreen
    if (modular_num_categories > 1) {
        nodes.push({ 
            index: i,
           fx: width/2,
           fy: height/2,
           r: 30
        })
        algebra_angle = (Math.PI/modular_num_categories)
        algebra_hyp = 2*middle_link_distance_metric*Math.sin(algebra_angle)
    }
    else {
        nodes.push({
            index: nodes.length,
            fx: -50,
            fy: -50,
            r: 30 
        })
        algebra_angle = 0
        algebra_hyp = 0
        category_node_r = root_node_r
    }

    var modular_i = 0

    central_node_cache = []
    var node_cache2 = [] // For debugging (TODO: Remove from final)

    if (dev_mode_tmp) console.log(feat_categories)

    // Render category nodes that are set to be rendered, otherwise render them offscreen
    for (var i = 1; i < feat_categories.length; i++) {

        if(feat_categories[i].render == true) {
            central_node_cache.push(nodes.length)

            nodes.push({
                index: nodes.length,
                fx: width/2 + compute_X(modular_i),
                fy: height/2 + compute_Y(modular_i),
                r: category_node_r
            })

            modular_i++;
        }
        else {
            node_cache2.push(nodes.length)

            nodes.push({
                index: nodes.length,
                fx: -50,
                fy: -50,
                r: category_node_r 
            })
        }
    }

    if (dev_mode_tmp) {
        console.log("NODE CACHES HERE")
        console.log(central_node_cache)
        console.log(node_cache2)
        console.log(modular_i)
    }

    // Link nodes!

    // If only 1 category is being made, don't create any links
    if (modular_num_categories == 1) return;

    for (var i = 0; i < central_node_cache.length-1; i++) {
        // Link all created nodes to center
        links.push({ 
            source: 0,
            target: central_node_cache[i]
        })

        // Link nodes in a circle
        links.push( {
            source: central_node_cache[i],
            target: central_node_cache[i+1], // This is the reason this must be done to length - 1
        })
    }

    // Last link to center
    links.push({
        source: 0,
        target: central_node_cache[central_node_cache.length-1]
    })

    // Close the circle
    links.push({
        source: central_node_cache[0],
        target: central_node_cache[central_node_cache.length-1]
    })

    if (dev_mode_tmp) {
        console.log("NODES HERE:")
        console.log(nodes)
        console.log("LINKS HERE:")
        console.log(links)

        console.log("-------------------------initialize_central_nodes END-------------------------")
    }

}

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

/* modular_render_one:
    Input 1: feat string, name, or object
    Output: Rerender the whole svg canvas with only that node visible

    Essentially zooms in on one node
*/

function modular_render_one(data) {

    console.log("---------------------------modular_render_one---------------------------")

    var data_obj = anything_to_feat_object(data);

    console.log("Data")
    console.log(data_obj)

//    var render_array = [false, false, false, false, false, false, false, false, false]
    var render_array = [false, false, false, false, false, false, false, false, false]

    // Set only that type to render
    render_array[feat_type_to_number(data_obj.type)] = true;

    modular_render_many(render_array, [data_obj])

    console.log("-------------------------modular_render_one end-------------------------")

}

/* modular_render_many:
    Input 1: Array of Categories to render (Including Root)
    Input 2: Array of Feats to Render (Empty array to display all) -> Feats can be given as ID, string, or obj
        Note 1: If no feats are provided, all feats for the rendered categories will be rendered
        Note 2: If feats are given from categories that are not set to be rendered, they will not be rendered
*/

function modular_render_many(input_1, input_2) {

    nodeID_to_featID_map = new Map();
    MAIN_featID_to_NodeID_map = new Map();

    console.log("---------------------------modular_render_many---------------------------")

    if (typeof(input_1) != 'object') {
        console.log("<modular_render_many> INPUT_1 TYPE ERROR : ")
        console.log(typeof(input_1))
        console.log(input_1)
        return;
    }

    if (input_1.length != feat_categories.length) {
        console.log("<modular_render_many> INPUT_1 SIZE ERROR: ")
        console.log(input_1.length)
        console.log(input_1)
        return;
    }

    if (typeof(input_2) != 'object'){
        console.log("<modular_render_many> INPUT_2 ERROR: ")
        console.log(input_2)
        return;
    }

    // Cache display value if not using cache function
    if (!using_cache_flag) {
        display_cache.push({in1: input_1.slice(), in2: input_2.slice()})
        first_click_flag = true // Indicates that the current render is cached at the top and should be ignored
    }

    // Clear nodes and links arrays
    nodes = []
    links = []

    console.log("INPUTS HERE")
    console.log(input_1.slice())
    console.log(input_2.slice())

    // Deal with input_1 by setting up central node
    for (var i = 1; i < feat_categories.length; i++) {
        feat_categories[i].render = input_1[i]
    }

    initialize_central_nodes()

    // Deal with input_2 by creating dependency trees

    // If empty array supplied, render them all!
        // Note: Feats with 0 prerequisites are not displayed to save space
    if (input_2.length == 0) {
        for (var i = 0; i < csv_data_array.length; i++) {
            if (csv_data_array[i].prerequisite_feats != "") {
                create_dependencies(csv_data_array[i])
            }
        }
    }
    else { // Else, render the list provided
        for (var i = 0; i < input_2.length; i++) {
            create_dependencies(input_2[i])
        }
    }

    if (simulation != undefined) {

        console.log("NODES AND LINKS BEFORE RESTART")
        console.log(nodes)
        console.log(links)

        restart_display();

    }

    console.log("display cache")
    console.log(display_cache)

    console.log("-------------------------modular_render_many END-------------------------")

} 

// This function performs a search_button_fn() and then also graphs it!
function filter_button_fn() {
    var search_result = search_button_fn();

    // If an error occured in the search function
    if (search_result == -1) return -1;

    // If 0 results were found
    if (search_result.length == 0) return;

    // Put this array to false
    for (var i = 0; i < render_none.length; i++) render_none[i] = false;

    // Set render_none fields to display proper nodes
    for (var i = 0; i < search_result.length; i++) {
//        if (feat_type_to_number(csv_data_array[featString_to_featID_map.get(search_result[i])].type)) { 
//            render_none[feat_type_to_number(csv_data_array[featString_to_featID_map.get(search_result[i])].type)] = true;
//        }
        if (feat_type_to_number(search_result[i].type)) { // This if is an error statement
            render_none[feat_type_to_number(search_result[i].type)] = true;
        }
    }

    console.log("stuff-------------------------------------------------")
    console.log(render_none.slice())
    console.log(search_result)

    modular_render_many(render_none, search_result)

    // Put this value back to all false
    for (var i = 0; i < render_none.length; i++) render_none[i] = false;
}


// This function clears all text fields and checkboxes in the menu
function clear_button_fn() {
    d3.select("#feat_text_box").property("value", "")
    d3.select("#race_text_box").property("value", "")
    d3.select("#lower_bound_text_box").property("value", "")
    d3.select("#upper_bound_text_box").property("value", "")

    for (var i = 0; i < num_categories; i++) {
        d3.select("#cb" + i).property("checked", false)
    }

}

// This function reads all the input data from the menu and then performs a search (search_fn)
function search_button_fn() {
    console.log("foobar")

    var render_types = [false,0,0,0,0,0,0,0,0]

    // Grab all the data from the inputs

    var feat_string = d3.select("#feat_text_box").node().value
    if (feat_string == "") feat_string = -1

    var race_string = d3.select("#race_text_box").node().value
    if (race_string == "") race_string = -1

    var lower_bound_int = Number(d3.select("#lower_bound_text_box").node().value)
    if (lower_bound_int == "") lower_bound_int = -1
    if (lower_bound_int < 0) lower_bound_int = -1
    if (lower_bound_int > csv_data_array.length ) lower_bound_int = -1

    var upper_bound_int = Number(d3.select("#upper_bound_text_box").node().value)
    if (upper_bound_int == "") upper_bound_int = -1
    if (upper_bound_int < 0) upper_bound_int = -1
    if (upper_bound_int > csv_data_array.length ) upper_bound_int = -1


    // If only one bound is given, assume they want the rest of the range
        // i.e. if only upper is given, go from 0...upper
        // and if only lower is given, go from lower ... max

    console.log(lower_bound_int)
    console.log(upper_bound_int)
    console.log(typeof(upper_bound_int))
    console.log(upper_bound_int < lower_bound_int)
  
    if (upper_bound_int < lower_bound_int) {
        upper_bound_int = -1
        lower_bound_int = -1
    }

    if ((lower_bound_int != -1) && (upper_bound_int == -1)) {
        upper_bound_int = csv_data_array.length
    }
    else if ((lower_bound_int == -1) && (upper_bound_int != -1)) {
        lower_bound_int = 0
    }

    for (var i = 1; i < num_categories+1; i++) {
        render_types[i] = feat_categories[i].render = d3.select("#cb" + i).property("checked")
    }

    true_counter = 0;

    for (var i = 0; i < render_types.length; i++) if (render_types[i]) true_counter++;

    // Perform search itself:

    var search_structure = {
        feat_name: feat_string,
        race: race_string,
        type: render_types,
        range: {lower: lower_bound_int, upper: upper_bound_int}
    } 

    if ((lower_bound_int == -1) && (upper_bound_int == -1)) {
        search_structure.range = -1
    }

    if (true_counter == 0) {
        search_structure.type = -1
    }

    var search_result = search_fn(search_structure)

    // Display some results!

    svg.selectAll("#search_result_strings").remove()

    for(var i = 0; i < ((search_result.length > 5) ? 5 : search_result.length); i++) {

        svg.append("text")
            .attr("id", "search_result_strings")
            .attr("x", 30)
            .attr("y", 570+i*30)
            .style("fill", "Black")
            .style("font-size", "25px")
            .text("#" + (i+1) + ": " + search_result[i].name)
    }

    if (search_result.length == 0) {
        svg.append("text")
            .attr("id", "search_result_strings")
            .attr("x", 30)
            .attr("y", 570+i*30)
            .style("fill", "Red")
            .style("font-size", "35px")
            .text("No feats found")
    }

    console.log("Resulting Values: (search structure, search results): ")
    console.log(search_structure)
    console.log(search_result)

    // Return array
    return search_result;

}

// Input: input_structure {
//     D feat_name: <string>  
//     D race: { <string> }
//     D type: <string> // Just one type
//     D range: {lower: <int>, upper: <int>}
// }
    // Note: for any attribute that is ignored, "-1" will be entered
// Output: Array of feat IDs that match the search criteria

function search_fn(input_structure) {

    console.log("INPUT STRUCTURE")
    console.log(input_structure)
    
    // Array of values
    var return_array = []

    var tmp_val;
    var lower_bound;
    var upper_bound;

    var first_flag = true;
    var delete_flag = true;

    // Apply bounding for all future looping
    if (typeof(input_structure.range) == 'object') {
        lower_bound = input_structure.range.lower
        upper_bound = input_structure.range.upper
    }
    else {
        lower_bound = 0
        upper_bound = csv_data_array.length
    }

    // Check string
    if (input_structure.feat_name != -1) {
        if (typeof(input_structure.feat_name) == 'string') {

            // put input feat name to upper
            input_structure.feat_name = input_structure.feat_name.toUpperCase()

            for (var i = lower_bound; i < upper_bound; i++) {
                tmp_val = csv_data_array[i].name.toUpperCase();

                if (tmp_val.includes(input_structure.feat_name)) {
                    return_array.push(csv_data_array[i])
                }
            }
        }
        else {
            console.log("<search> Input Error on feat_name: " + input_structure.feat_name)
            return -1;
        }
        first_flag = false;
    }

    // Check Races
    if (input_structure.race != -1) {
        console.log("CHECKING RACES >>>>>>>>>>>>>>>")
        // Typecheck
        if (typeof(input_structure.race) == 'object') {

            // If first flag, grab everything associated with this race
            if (first_flag) {

                // iterate through all given races
                for (var i = 0; i < input_structure.race.length; i++) {
                    input_structure.race[i] = input_structure.race[i].toUpperCase()

                    // For each race, iterate through the range of feats to check against
                    for (var n = lower_bound; n < upper_bound; n++) {

                        // If no prerequisite feat, simply add (If not already added)
                        if (csv_data_array[n].race_tokens.length == 0) {
                            if (!array_contains(csv_data_array[i].name, return_array)) {
                                return_array.push(csv_data_array[i])
                            }
                        }
                        else {

                            for (var m = 0; m < csv_data_array[n].race_tokens.length; m++) {
                                tmp_val = csv_data_array[n].race_tokens[m].toUpperCase();

                                if (input_structure.race.name == tmp_val) {

                                    for (var p = 0; p < return_array; p++) tmp_array.push(return_array[p].name)

                                    if (!array_contains(csv_data_array[i].name, tmp_array)) {
                                        return_array.push(csv_data_array[i])
                                    }
                                    continue
                                }
                            }
                        }
                    }
                }
            }
            else { // Not first criteria, so cycle through previously found values
                if (return_array.length == 0) return [];

                // iterate through all given races
                for (var i = 0; i < input_structure.race.length; i++) {
                    input_structure.race[i] = input_structure.race[i].toUpperCase()

                    // For each race, iterate through the previously found feats
                    for (var n = 0; n < return_array.length; n++) {

                        // If no prerequisite races, keep this token
                        // If prerequisite races, check if it is one of the given races
                        if (csv_data_array[n].race_tokens.length != 0) {

                            delete_flag = true;

                            // iterate through all race tokens on this feat
                            for (var m = 0; m < return_array[n].race_tokens.length; m++) {
                                tmp_val = return_array[n].race_tokens[m].toUpperCase();

                                // If one matches, lower the delete flag
                                if (input_structure.race.name == tmp_val) {
                                    delete_flag = false;
                                    continue
                                }
                            }

                            // if flag is still set, delete the item!
                            if (delete_flag) return_array.splice(n, 1)
                        }
                    }
                }
            }
        }
        else {
            console.log("<search> Input Error on race: >>" + typeof(input_structure.race) + "<<")
            console.log(typeof(input_structure.race))
            console.log(input_structure.race)
            return -1;
        }
        first_flag = false;
    }

    console.log(input_structure)

    // Check type
    if (input_structure.type != -1) {
        if (typeof(input_structure.type) == 'object') {

            // If first flag, get all feats associated with the given types
            if (first_flag) {
                for (var i = 0; i < input_structure.type.length; i++) {

                    // If this feat is active, add all feats of that type in the range
                    if (input_structure.type[i]) {
                        // i is the feat number at this point

                        // Iterate through all feats in the range
                        for (var n = lower_bound; n < upper_bound; n++) {
                            // If types match, add the item!
                            if (feat_type_to_number(csv_data_array[n].type) == i){
                                return_array.push(csv_data_array[n])
                            }
                        }
                    }
                    else continue
                }
            }
            else { // Else, check feats already in return_array
                console.log("GETTING HEREEEEEEEEEEEEEEEE")
                console.log(input_structure.type)
                console.log(return_array.slice())

                var tmp_length = return_array.length
                var tmp_i;

                // Iterate through all the values in the return array
                for (var tmp_i = 0; tmp_i < tmp_length; tmp_i++) {

                    tmp_val = feat_type_to_number(return_array[tmp_i].type)

                    console.log("tmp_i: " + tmp_i + " || tmp_val: " + tmp_val)

                    // If input for that type is set high, then don't delete
                    if (input_structure.type[tmp_val] != true) {
                        console.log("DELETING DUE TO TYPE")
                        return_array.splice(tmp_i, 1)
                        tmp_i--;
                        tmp_length--;
                    }
                }
            }
        }
        else {
            console.log("<search> Input Error on type: >>" + typeof(input_structure.type) + "<<")
            console.log(typeof(input_structure.type))
            console.log(input_structure.type)
            return -1;
        }
        first_flag = false;
    }

    console.log(first_flag)
    console.log(input_structure.range)

    // If range was provided alone, simply return everything in that range
    if (typeof(input_structure.range) == 'object') {
        console.log("foobar")
        if (first_flag == true ) {
            console.log("foobar")
            console.log(lower_bound)
            console.log(upper_bound)
            for (var i = lower_bound; i < upper_bound; i++) {
                console.log("foobar")
                return_array.push(csv_data_array[i])
            }
        }
    }

    return return_array
}

var display_cache = []
var first_display_flag = false;
var using_cache_flag = false;

function cache_display_fn(render_val) {
    if (display_cache.length == 1) return;

    if (first_click_flag) {
        display_cache.pop()
        first_click_flag = false
    }

    // Get values for previous display
    var render_val = display_cache.pop()

    console.log("RENDER_VAL")
    console.log(render_val)

    using_cache_flag = true;
    modular_render_many(render_val.in1, render_val.in2)
    using_cache_flag = false;
}

function restart_display() {

    console.log("-----------------------restart_display-----------------------")

    var fade_time = 1500 // in ms

    svg.selectAll("line").transition().duration(fade_time).style("opacity", 0).remove()
    svg.selectAll("node").transition().duration(fade_time).style("opacity", 0).remove()
    svg.selectAll("circle").transition().duration(fade_time).style("opacity", 0).remove()

    svg_links = svg.selectAll("link")
        .data(links)
        .enter().append("line")
        .attr("class", "link")
        .attr("stroke-width", 1)
        .attr("stroke", "black");

    svg_links.exit().remove()

    svg_links.enter().append("line")
        .attr("class", "link")
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .merge(svg_links)

    var javascript_d3_index_error_flag = (modular_num_categories == 1) ? true : false;

    // Create nodes themselves with hover capacity
    svg_nodes = svg.selectAll("node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .on("mouseover", node_tooltip.show)
        .on("mouseout", node_tooltip.hide)
        .on("click", function(d) { 
            node_tooltip.hide() // Hide the tooltip which will otherwise get stuck because the object is deleted
            console.log("data")
            console.log(d)
            if (d.index == 0) { // If the root is clicked on, render everything
                modular_render_many(render_all, [])
            }
            else if (d.index <= num_categories) { // If one of the categories is clicked on, render everything from that category
                render_none[d.index] = true
                modular_render_many(render_none, [])
                render_none[d.index] = false
            }
            else { // Otherwise, render individual node that was clicked on

/*
                var search_structure = {
                    feat_name: -1,
                    race: -1,
                    type: -1,
                    range: -1
                } 

                var test_val = search_fn(search_structure)

                console.log("SEARCHING HERE")
                console.log(test_val)
*/

                modular_render_one(nodeID_to_featID_map.get(d.index))
            }
        })
        .call(d3.drag()
            .on("start", drag_start)
            .on("drag", drag)
            .on("end", drag_end)
        )
        .append("circle")
        .attr("r", function(d) { return d.r })
        .attr("class", "circle")
        .style("fill", function(d) {
            if (!javascript_d3_index_error_flag) { 
                javascript_d3_index_error_flag = true;
                return feat_type_to_color(0);
            }
            if (csv_data_array[nodeID_to_featID_map.get(d.index)] != undefined)
            {
                return feat_type_to_color(csv_data_array[nodeID_to_featID_map.get(d.index)].type)
            }
            else { // Else these are the central nodes: their node number is equal to their type
                return feat_type_to_color(d.index)
            }
        });

    svg_nodes.exit().remove()

    simulation
        .nodes(nodes)
        .on("tick", tick)

    simulation.force("link")
        .links(links)

    simulation.alpha(0.8).restart()

    console.log("---------------------restart_display END---------------------")

}

function format_baseline() {

    var test_feats = csv_data_array.slice(100, 200)

    console.log(test_feats)

    modular_render_many(render_all, test_feats)

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
                else if ((d.source.index < num_categories) && (d.target.index < num_categories)) {
                    return link_strength;
                }
                return link_strength             

            })
            .distance(function(d) {

                if (d.source.index == 0) {
                    return link_distance_metric;
                }
                else if ((d.source.index <= num_categories) && (d.target.index <= num_categories)) {
                    return (algebra_hyp)
                }
                // If they both have layers attached (Which they should), build link distance based off this
                else if (nodes[d.source.index] != undefined && nodes[d.target.index] != undefined) {
                    if ((nodes[d.source.index].layer != -1) && (nodes[d.target.index].layer != -1)) {
                        // Distance of 50 for each link layer apart, this will generally be 50 --> TODO: Variable this, or build it off 'link_distance_metric'
                        return Math.abs((nodes[d.source.index].layer - nodes[d.target.index].layer != -1))*link_distance_metric
                    }
                }
                 
                return link_distance_metric;
            }))
        .force("charge", d3.forceManyBody()
            .strength(function(d) {
                if(d.index == 0) { // Make middle ROOT act as a VERY repulsive gravity force
                    return -10000
                }
                else if (d.index < num_categories + 1) {
                    return -1500 // Make each category node act as a somewhat resulive gravity force
                }
                else {
                    return -25 // Give each feat some gravity to help with avoiding overlap
                }
            }))
        .force("collision", d3.forceCollide().radius(12))

    restart_display();

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

// TOOLTIP STUFF HERE: Uses the d3-tip library extension that mimics d3-v3's tooltip functionality

// Input: Array of values to be iterated through and give colors of stuff
function tip_return_val(data) {

    var data_obj = anything_to_feat_object(data);

    console.log(data_obj)

    var return_str = ("<span style ='color:red'>Name: </span>" + data_obj.name + "<br>")

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

// Definition of d3-tip variable, this is used for the hover display
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
