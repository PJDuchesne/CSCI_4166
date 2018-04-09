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
-> Name: render_restart.js
-> Brief: Contains all functions related to rendering and restarting the nodes
-> Date: March 2018
-> Author: Paul Duchesne (B00332119)
-> Contact: pl332718@dal.ca
*/

/*
    Function Name: modular_render_one
    Description: Renders a single feat, used by click effect on individual nodes
    Inputs: feat (by string, ID, or object)
    Outputs: <Rerender the whole svg canvas with only that node visible>
*/
function modular_render_one(data) {

    var dev_mode_tmp = false

    if (dev_mode_tmp) console.log("---------------------------modular_render_one---------------------------")

    var data_obj = anything_to_feat_object(data);

    if (dev_mode_tmp) {
        console.log("Data")
        console.log(data_obj)
    }

    var render_array = [false, false, false, false, false, false, false, false, false]

    // Set only that type to render
    render_array[feat_type_to_number(data_obj.type)] = true;

    modular_render_many(render_array, [data_obj])

    if (dev_mode_tmp) console.log("-------------------------modular_render_one end-------------------------")

}

/*
    Function Name: modular_render_many
    Description: Rerenders the visualization with given feat types and a list of feats
    Inputs: input_1: Array of Categories to render (Including Root)
            input_2: Array of Feats to Render (Empty array to display all)
    Outputs: <Rerender the whole svg canvas with only specificied types and nodes>

    Note 1: If no feats are provided, all feats for the rendered categories will be rendered
    Note 2: If feats are given from categories that are not set to be rendered, they will not be rendered
*/
function modular_render_many(input_1, input_2) {

    var dev_mode_tmp = false

    nodeID_to_featID_map = new Map();
    MAIN_featID_to_NodeID_map = new Map();

    if (dev_mode_tmp) console.log("---------------------------modular_render_many---------------------------")

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

        // Set max cache length to 8 to avoid memory runaway
        if (display_cache.length > 8) {
            display_cache.splice(0, 1)
        }
        first_click_flag = true // Indicates that the current render is cached at the top and should be ignored
    }

    // Clear nodes and links arrays
    nodes = []
    links = []

    if (dev_mode_tmp) {
        console.log("INPUTS HERE")
        console.log(input_1.slice())
        console.log(input_2.slice())
    }

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

        if (dev_mode_tmp) {
            console.log("NODES AND LINKS BEFORE RESTART")
            console.log(nodes)
            console.log(links)
        }

        restart_display();

    }

    if (dev_mode_tmp) {
        console.log("display cache")
        console.log(display_cache)

        console.log("-------------------------modular_render_many END-------------------------")
    }

} 

/*
    Function Name: restart_display
    Description: Clears the SVG canvas and DOM elements on the display to correspond to new
                 nodes and links array values. This then recreates the elements and restarts
                 the simulation
*/
function restart_display() {

    var dev_mode_tmp = false

    if (dev_mode_tmp) console.log("-----------------------restart_display-----------------------")

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

    nodes.forEach(function(d) {d.x = width/2, d.y = height/2 })

    // Create nodes themselves with hover capacity
    svg_nodes = svg.selectAll("node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .on("mouseover", node_tooltip.show)
        .on("mouseout", node_tooltip.hide)
        .on("click", function(d) { 
            node_tooltip.hide() // Hide the tooltip which will otherwise get stuck because the object is deleted
            if (d.index == 0) { // If the root is clicked on, render everything
                modular_render_many(render_all, [])
            }
            else if (d.index <= num_categories) { // If one of the categories is clicked on, render everything from that category
                render_none[d.index] = true
                modular_render_many(render_none, [])
                render_none[d.index] = false
            }
            else { // Otherwise, render individual node that was clicked on



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

    simulation.alpha(1.0).restart()

    if (dev_mode_tmp) console.log("---------------------restart_display END---------------------")

}

/*
    Function Name: initialize_central_nodes
    Description: Uses feat_categories to modularly resize the central node to fit the number of
                 categories being displayed. If only 1 category is being shown, that category will
                 be placed in the center alone, with the root not displayed.
    Input: <global: feat_categories>
*/
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