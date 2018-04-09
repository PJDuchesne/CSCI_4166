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
-> Name: svg_initialize.js
-> Brief: Contains d3 code and helper functions related to initializing the menu and svg canvas
-> Date: March 2018
-> Author: Paul Duchesne (B00332119)
-> Contact: pl332718@dal.ca
*/


/*
    Function Name: svg_initialize
    Description: initializes the svg canvas and the menu d3 elements
*/
function svg_initialize() {
    svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)

    // Function to return line coordinates to draw
    var linefunction = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });

    var box = svg.append("rect")
        .attr("x", rect_offset)
        .attr("y", rect_offset)
        .attr("class", "menu")
        .attr("width", rect_width)
        .attr("height", rect_height)
        .style("opacity", 0.25)
        .attr("fill", "#4a4a4f")

    var border = svg.append("path")
        .attr("d", linefunction(border_data))
        .attr("stroke-width", 2)
        .attr("stroke", "black")
        .attr("fill", "none");

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
            .attr("placeholder", "Lower")
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
            .attr("placeholder", "Upper")
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
        .attr("id", "search_result_header")
        .style("fill", "Black")
        .style("font-size", "50px")
        .text("Search Results")

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

    // Definition of d3-tip variable, this is used for the hover display
    node_tooltip = d3.tip()
        .attr("class", "d3-tip")
        .attr("id", "d3-tip")
        .offset([-8, 0])
        .html(function(d) { 
            var tmp_dev_mode = false;

            if (tmp_dev_mode) {
                console.log("----------------TOOLTIP---------------")
                console.log(d)
                console.log("Feat ID: " + nodeID_to_featID_map.get(d.index))
                console.log("FEAT NAME: " + featID_to_stringID_map.get(nodeID_to_featID_map.get(d.index)))
            }

            if (tmp_dev_mode) console.log("----------------TOOLTIP_END-----------")

            // If this is within the central node
            if(d.index <= num_categories) {
                return ("<span style='color: #222'>Feat Category: </span>" + feat_categories[d.index].name)
            }
            // Else this is a feat node
            else {
                return tip_return_val(nodeID_to_featID_map.get(d.index));
            }

        })
}

// General Note on Tooltips: Uses the d3-tip library extension that mimics d3-v3's tooltip functionality

/*
    Function Name: tip_return_val
    Description: Creates a d3-tip message to display certain fields on mouseover. This is
                done by processing and parsing certain fields of the feat within the csv_input_array
    Inputs: feat (by string, ID, or object)
    Outputs: return_str: A string with HTML coding to display values on mouseover
*/
function tip_return_val(data) {

    var tmp_dev_mode = false

    if (tmp_dev_mode) console.log("----------------------------tip_return_val----------------------------")

    var data_obj = anything_to_feat_object(data);

    if (tmp_dev_mode) console.log(data_obj)

    var return_str = ("<span style ='color:red'>Name: </span>" + data_obj.name + "<br>")

    var tmp_array = [data_obj.ability_tokens,
                     data_obj.skill_tokens,
                     data_obj.race_tokens,
                     data_obj.misc_tokens]

    if (tmp_dev_mode) console.log(tmp_array[0])

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

    if (tmp_dev_mode) console.log("--------------------------tip_return_val END--------------------------")

    return return_str;
}

/*
    Function Name: cache_display_fn
    Description: Triggered by the cache button in the upper left corner, this function
                 renders the previous display (if any) by accessing the display_cache 

    Note: This cache has a maximum depth of 8 in order to save on memory
*/
function cache_display_fn() {

    if (display_cache.length == 0) return;

    if (first_click_flag) {
        display_cache.pop()
        first_click_flag = false
    }

    console.log(display_cache)

    // Get values for previous display
    var render_val = display_cache.pop()

    // Redundant display check
    if (render_val == undefined) return

    console.log("RENDER_VAL")
    console.log(render_val)

    using_cache_flag = true;
    modular_render_many(render_val.in1, render_val.in2)
    using_cache_flag = false;
}

// This function performs a search_button_fn() and then also graphs it!

/*
    Function Name: filter_button_fn
    Description: Calls search_button_fn() and then renders the results
*/
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

/*
    Function Name: clear_button_fn
    Description: Clears user input fields in the menu
*/
function clear_button_fn() {

    d3.select("#search_result_header").text("Search Results")
    d3.selectAll("#search_result_strings").remove()

    d3.select("#feat_text_box").property("value", "")
    d3.select("#race_text_box").property("value", "")
    d3.select("#lower_bound_text_box").property("value", "")
    d3.select("#upper_bound_text_box").property("value", "")

    for (var i = 0; i < num_categories; i++) {
        d3.select("#cb" + i).property("checked", false)
    }

}


// This function reads all the input data from the menu and then performs a search (search_fn)

/*
    Function Name: search_button_fn
    Description: Polls the user input fields and makes performs a search (search_fn) with
                 the result. Some input error checking is perforrmed and some preliminary
                 results are printed directly onto the menu.
*/
function search_button_fn() {
    console.log("foobar")

    var render_types = [false,0,0,0,0,0,0,0,0]

    // Grab all the data from the inputs

    var feat_string = d3.select("#feat_text_box").node().value
    if (feat_string == "") feat_string = -1

    var race_string = d3.select("#race_text_box").node().value
    if (race_string == "") race_string = -1

    var race_string_tokenized = parsefeats(race_string)

    console.log("RACE STRING INPUT-------------------")
    console.log(race_string)
    console.log(race_string_tokenized)

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
        race: race_string_tokenized,
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

    var tmp_str;

    if (search_result.length <= 5) {
        tmp_str = "Search Results"
    }
    else {
        tmp_str = ("Search Results (First 5 of " + search_result.length + ")")
    }
   
    d3.select("#search_result_header").text(tmp_str)

    d3.selectAll("#search_result_strings").remove()

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
            .transition()
                .delay(3000)
                .duration(5000)
                .style("opacity", 0)
    }

    console.log("Resulting Values: (search structure, search results): ")
    console.log(search_structure)
    console.log(search_result)

    // Return array
    return search_result;

}

/*
    Function Name: search_fn
    Description: Performs an inclusive search on the data elements and returns the results

    Input: input_structure {
        feat_name: <string>  
        race: { <string> } 
        type: <string> // Just one type
        range: {lower: <int>, upper: <int>}
    }
    Output: Array of feat objects that match the search criteria

    Note 1: for any attribute that is ignored, "-1" will be entered
    NOTE 2: For races, the search shows the feats AVAILABLE to that race. But because
            most feats (~80%) do not have a racial requirement, this option is rarely helpful
*/
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

    var first_race_flag = true;

    // Check Races
    if (input_structure.race != -1) {
        console.log("CHECKING RACES >>>>>>>>>>>>>>>")
        // Typecheck
        if (typeof(input_structure.race) == 'object') {

            // If first flag, grab everything associated with this race
            if (first_flag) {

                // iterate through all input races
                for (var i = 0; i < input_structure.race.length; i++) {

                    input_structure.race[i] = input_structure.race[i].toUpperCase()

                    // For each race, iterate through the range of feats to check against
                    for (var n = lower_bound; n < upper_bound; n++) {

                        // If no prerequisite race, simply add (If not already added)
                        if (csv_data_array[n].race_tokens.length == 0) {
                            if (first_race_flag) return_array.push(csv_data_array[n])
                        }
                        else {

                            for (var m = 0; m < csv_data_array[n].race_tokens.length; m++) {
                                tmp_val = csv_data_array[n].race_tokens[m].toUpperCase();

                                if (input_structure.race[i] == tmp_val) {

                                    tmp_array = []
                                    for (var p = 0; p < return_array; p++) tmp_array.push(return_array[p].name)

                                    if (!array_contains(csv_data_array[n].name, tmp_array)) {
                                        return_array.push(csv_data_array[n])
                                    }
                                    continue
                                }
                            }
                        }
                    }
                    first_race_flag = false;
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
        console.log("CHECKING RACES <<<<<<<<<<<<<<<<")
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
