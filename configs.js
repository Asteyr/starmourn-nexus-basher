nb.configs = {
	//general configs
	"hp_heal_threshold" : {
		"val":0.7,
		"category":"General",
		"desc":"Use class heal when your hp percent is below this. Must be a number between 0 and 1. Default: 0.7",
		"validateMsg":"hp_heal_threshold must be a number between 0 and 1.",
		"validate":nb.isPercentage
	},

	"heal_full_after_room_clear" : {
		"val":false,
		"category":"General",
		"desc":"NB will try to heal you to 100% after you fully clear a room. Must be true or false. Default: false.",
		"validateMsg":"heal_full_after_room_clear must be a boolean true or false.",
		"validate":nb.isBool
	},

	"heal_after_each_mob" : {
		"val":0,
		"category":"General",
		"desc":"NB will wait until your health is above this percent before hitting the next mob. Must be a number between 0 and 1. Set to 0 to ignore this feature entirely. Default: 0. Do not use if fighting aggressive mobs.",
		"validateMsg":"heal_after_each_mob must be a number between 0 and 1.",
		"validate":nb.isPercentage
	},
	"trust_other_interrupts" : {
		"val":true,
		"category":"General",
		"desc":"NB will trust interrupts originating from other players. Default: true.",
		"validateMsg":"trust_other_interrupts must be a boolean true or false",
		"validate":nb.isBool
	},

	//Beast
	//Engineer
	//Fury
	//Nanoseer
	"use_pointzero" : {
		"val":false,
		"category":"Nanoseer",
		"desc":"NB will use pointzero if you have the skill. Default: true. Effectiveness of pointzero drops off when you reach crits.",
		"validateMsg":"use_pointzero must be a boolean true or false.",
		"validate":nb.isBool

	},
	"pointzero_target_count_threshold" : {
		"val":3,
		"category":"Nanoseer",
		"desc":"NB will only use pointzero in rooms with this number of valid targets or more. Default: 3.",
		"validateMsg":"pointzero_target_count_threshold must be a number.",
		"validate":nb.isNumber
	},
	"speedup_target_count_threshold" : {
		"val":2,
		"category":"Nanoseer",
		"desc":"NB will only use speedup in rooms with this number of valid targets or more. Default: 2.",
		"validateMsg":"speedup_target_count_threshold must be a number.",
		"validate":nb.isNumber
	},
	//Scoundrel
	"override_ied_type" : {
		"val":"",
		"category":"Scoundrel",
		"desc":"NB will only use this IED. Default: empty string ''.",
		"validateMsg":"override_ied_type must be a string.",
		"validate":nb.isString
	},
	"melter_target_hp_threshold" : {
		"val":.4,
		"category":"Scoundrel",
		"desc":"NB will use melters if you have the skill when the target is above this health percentage. Default: 0.4. Not compatible with user defined override_ied_type.",
		"validateMsg":"melter_target_hp_threshold must be a number between 0 and 1.",
		"validate":nb.isPercentage,
	},
}


nb.isPercentage = function(v){
	if ((typeof v !== "number")||(v<0)||(v>=1)) {
		return false
	}
	return true;
}

nb.isBool = function(v){ return (typeof v === "boolean") ? true : false; }

nb.isNumber = function(v){ return (typeof v === "number") ? true : false; }

nb.isString = function(v){ return (typeof v === "string") ? true : false; }

nb.loadUserConfigs = function(){
	//nb.userConfigs comes from the .nxs from 0.5 up, which calls this function.
	var count = 0;
	for (var c in nb.userConfigs) {
		if (c.split("_")[0] === "sample") continue;
		if (!(c in nb.configs)) {
			nb.warn("Failed to load userConfig "+c+ ". No such config exists.");
			continue;
		}
		let v = nb.userConfigs[c];
		if (!nb.configs[c].validate(v)) {
			nb.warn("Failed to load userConfig "+c+ ". "+nb.configs[c].validateMsg);
			continue;
		}
		nb.configs[c].val = v;
		count++;
	}
	if (count) {
		var str = "NB loaded "+count+ " user config"
		if (count > 1) str+="s";
		str+=".";
		display_notice(str,"green");
	}
}

nb.reloadUserConfigs = function(){
	run_function("userConfigs","","Nexus community basher");
}

nb.configHelp = function() {
	display_notice("Use command NBCONFIG to view available configuration options.");
	display_notice("To edit your user configs, enter Nexus Client Settings, go to Reflexes, and head into the Nexus community basher package.");
	display_notice("Enter your user configs in (function) userConfigs, following the instructions there.");
	display_notice("When you are done, hit save changes, then NBCONFIG RELOAD to reload them. These configs will be saved between sessions.");
}
nb.configDisplay = function() {
	var output = {};
	output.title = 'Nexus community basher configuration options'
	output.heading = ['config', 'value','description'];
	output.rows = []
	for (key in nb.configs) {
		var row = [];
		row.push(key);
		row.push(nb.configs[key].val);
		row.push(nb.configs[key].desc);
		output.rows.push(row);
	}
    
	var final = AsciiTable.factory(output);
	nb.tableReport(final);

}
