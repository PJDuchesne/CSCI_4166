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
-> Name:  main.js
-> Brief: Implementation for the main.cpp the code that runs executive commands
-> Date: March 2018
-> Author: Paul Duchesne (B00332119)
-> Contact: pl332718@dal.ca
*/

// Read CSV file and start everything up
d3.csv("Data/pathfinder_feats.csv", function(data) {
    // Store data for future usage
    csv_data_array = data;

    // Initialize CSV array
    svg_initialize()

    // Do some preprocessing on the data
    format_csv_data()

    // Launch the default version of the visualization
    launch_simulation()

    // Enable tooltips
    svg.call(node_tooltip)
});

/*
    Function Name: format_csv_data
    Description: Has three main tasks:
        1. Fill keymaps for future use
        2. Checks for circular dependencies (Now redundant)
        3. Preparse some fields into tokens for quick use later
*/
function format_csv_data() {

    var tmp_dev_mode = false

    if (tmp_dev_mode) console.log("------------------------------format_csv_data_array------------------------------")


    // Fill keymaps
    csv_data_array.forEach(function(element, index) {
        // Fill string to featID keymap
        featString_to_featID_map.set(element.name, index)
        featID_to_stringID_map.set(index, element.name)
    })

    // Formatting Part 1: Originally used to find circular dependencies.
    //      These have been fixed manually in the csv file

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
                    if (tmp_dev_mode) {
                        console.log("THIS FEAT HAS ITSELF AS A PREREQUISITE")
                        console.log(csv_data_array[x])
                        console.log(x)
                    }
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

    if (dev_mode_tmp)console.log("----------------------------format_csv_data_array END----------------------------")
}

/*
    Function Name: launch_simulation
    Description: Launches simulation by defining 'simulation' variable and calling restart_display()
*/
function launch_simulation() {

    var dev_mode_tmp = false;

    if (dev_mode_tmp) console.log("-------------------------format_baseline-------------------------")

    // Starts with ~200 random feats displayed
    modular_render_many(render_all, random_start(200))

    if (dev_mode_tmp) {
        console.log("NODES HERE")
        console.log(nodes)
        console.log("LINKS HERE")
        console.log(links)
    }

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

    if (dev_mode_tmp) console.log("-----------------------format_baseline END-----------------------")

}
