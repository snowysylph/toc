
var toc = {};

toc.init = function init (){
	$(".stat").spinner({min: 3, max: 8, stop: toc.update}).val(3);
	$("#health").spinner({min: 0, stop: toc.update}).val(0);
	$("#mana").spinner({min: 0, stop: toc.update}).val(0);
	
	Object.keys(toc.archetypes).sort().forEach(function (archetype){
		$("#archetype").append("<option value='"+ archetype +"' style='color:"+ 
			toc.archetypes[archetype].color +"'>"+ toc.capWords(archetype) +"</option>");
	})
	Object.keys(toc.kits).sort().forEach(function (kit){
		$(".kit").append("<option value='"+ kit +"' style='color:"+ 
			toc.kits[kit].color +"'>"+ toc.capWords(kit) +"</option>");
	})
	
	Object.keys(toc.spells).sort().forEach(function (spell){
		$("#spells").append($("<div style='color:"+ toc.spells[spell].color +"'>"+
		"<input type='checkbox' value='"+ spell +"'>"+ toc.capWords(spell) +
			"</input></div>"));
	})
	
	Object.keys(toc.masteries).sort().forEach(function (mastery){
		$("#masteries").append($("<div style='color:"+ toc.masteries[mastery].color +"'>"+
		"<input type='checkbox' value='"+ mastery +"'>"+ toc.capWords(mastery) +
			"</input></div>"));
	})
	
	$("input, select").on("change", toc.update)
	$(".textInput").on("input", toc.update)
	
	$("#maxStatus").on("click", function (){
		toc.update();
		$("#health").val($("#maxHealth").text());
		$("#mana").val($("#maxMana").text());
		toc.update();
	})
	
	$("#io-import").on("click", toc.io_import);
	$("#io-export").on("click", toc.io_export);
	
	$("#tabs").tabs();
}

toc.capWord = function capWord (string){
	return string && string.charAt(0).toUpperCase() + string.slice(1);
};

toc.capWords = function capWords (string){
	return string.split(" ").map(function(word){
		return toc.capWord(word);
	}).join(" ");
}

toc.io_export = function io_import (){
	var output = JSON.stringify(toc.buildChar()).replace(/","/g, "\", \"");
	$("#io-data").val(output);
	
	return output;
}

toc.io_import = function io_import (){
	var char = JSON.parse($("#io-data").val());
	
	toc.clear();
	
	for (key in char){
		if (typeof char[key] == "string"){
			$("#"+ key).val(char[key]);
		} 
	}
	
	char.kits.forEach(function (kit, index){
		$("#kit"+ (index + 1)).val(kit)
	})
	
	char.spells.forEach(function (spell){
		$("#spells").find("[value = '"+ spell +"']").prop("checked", true);
	})
	
	char.masteries.forEach(function (mastery){
		$("#masteries").find("[value = '"+ mastery +"']").prop("checked", true);
	})
	
	toc.update();
}

toc.clear = function clear (){
	$(":checkbox").prop("checked", false);
	$("#name").val("Player")
	$("#statusText").val(null)
	$("#traitsText").val(null)
	$(".stat").val(3)
	$("#archetype").val(Object.keys(toc.archetypes)[0])
	$("#kit1").val(Object.keys(toc.kits)[0])
	$("#kit2").val(Object.keys(toc.kits)[0])
	$("#health").val(0);
	$("#mana").val(0);
	toc.update();
}

toc.update = function update (){
	if ($("#archetype").val() == "mage"){
		$("[value = 'magic missile']").prop("checked", true);
	}
	
	var char = toc.buildChar();
	
	
	$("#maxHealth").text(char.maxHealth);
	$("#maxMana").text(char.maxMana);
	$("#statTotal").text(
		Number(char.strength) + 
		Number(char.speed) +
		Number(char.stamina) +
		Number(char.agility) +
		Number(char.will) +
		Number(char.charm));
	
	if (char.maxMana){
		var magicMax = 0;
		if (char.archetype == "mage") magicMax += 2
		if (char.kits[0] == "sorcery") magicMax += 3
		if (char.kits[1] == "sorcery") magicMax += 3;
		
		$(".magic").show("fade");
		//$("#magicUsed").text($("#spells, #masteries").find(":checked").length)
		$("#magicUsed").text(char.spells.length + char.masteries.length);
		$("#magicMax").text(magicMax);
		
	} else $(".magic").hide("fade");
		
	toc.printChar(char);
}

toc.buildChar = function buildChar (){
	var char = {
		name: $("#name").val(),
		health: $("#health").val(),
		mana: $("#mana").val(),
		archetype: $("#archetype").val(),
		
		kits: [$("#kit1").val(), $("#kit2").val()],
		spells: [],
		masteries: [],
		
		strength: $("#strength").val(),
		speed: $("#speed").val(),
		stamina: $("#stamina").val(),
		agility: $("#agility").val(),
		will: $("#will").val(),
		charm: $("#charm").val(),
		
		statusText: $("#statusText").val(),
		traitsText: $("#traitsText").val(),
	};
	
	if (char.kits.indexOf("endurance") >= 0){
		char.maxHealth = 5 * char.stamina;
	} else char.maxHealth = 4 * char.stamina;
	
	char.maxMana = 0;
	if (char.archetype == "mage") char.maxMana += 12;
	if (char.kits[0] == "sorcery") char.maxMana += 4;
	if (char.kits[1] == "sorcery") char.maxMana += 4;
	
	
	$("#spells").find(":checked").each(function (index, element){
		char.spells.push($(element).val());
	})
	
	$("#masteries").find(":checked").each(function (index, element){
		char.masteries.push($(element).val());
	})
	
	return char;
}

toc.printChar = function printChar (char){
	var output = "";
	
	output += "[user]"+ char.name +"[/user] - " + 
		"Health: [color=red]"+ char.health +"[/color]/[color=red]"+ char.maxHealth +"[/color]";
		
	if (char.maxMana) output += " | Mana: [color=blue]"+ char.mana +
		"[/color]/[color=blue]"+ char.maxMana +"[/color]";

	if ($("#statusText").val()) output += " | "+ $("#statusText").val();
	
	output += "\n[color="+ toc.archetypes[char.archetype].color +"]"+ toc.capWords(char.archetype) +"[/color]"+ 
		" | [color="+ toc.kits[char.kits[0]].color +"]"+ toc.capWords(char.kits[0]) +"[/color],"+
		" [color="+ toc.kits[char.kits[1]].color +"]"+ toc.capWords(char.kits[1]) +"[/color]"+
		" ( STR "+ char.strength +" | SPD "+ char.speed +" | STA "+ char.stamina +
		" | AGI "+ char.agility +" | WIL "+ char.will + " | CHA "+ char.charm + " )";	
		
	if (char.maxMana){
		output += "\n";	
		
		if (char.spells.length){
			output += "Spells:";
			char.spells.forEach(function (spell, index){
				if (index) output += ",";
				output += " [color="+ toc.spells[spell].color +"]"+ toc.capWords(spell) +
					"[/color]";
			})
		}
	
		if (char.masteries.length){
			if (char.spells.length) output += " | ";
			output += "Masteries:";
			char.masteries.forEach(function (mastery, index){
				if (index) output += ",";
				output += " [color="+ toc.masteries[mastery].color +"]"+ toc.capWords(mastery) +
					"[/color]";
			})
		}
	}
	if ($("#traitsText").val()) output += "\n"+ $("#traitsText").val();
	
	$("#preview").html(bb.parse(output));
	$("#output").val(output);
	return output;
}

toc.archetypes = {
	fighter: {color: "orange"},
	brute: {color: "red"},
	mage: {color: "blue"},
	ranger: {color: "green"},
	master: {color: "purple"},
}

toc.kits = {
	//acrobatics: {color: "orange"},
	//archery: {color: "blue"},
	aura: {color: "green"},
	awareness: {color: "green"},
	berserk: {color: "red"},
	//block: {color: "green"},
	endurance: {color: "green"},
	evasion: {color: "blue"},
	fearsome: {color: "purple"},
	flight: {color: "green"},
	keen: {color: "orange"},
	initiative: {color: "green"},
	manipulate: {color: "purple"},
	poison: {color: "purple"},
	regeneration: {color: "green"},
	resilience: {color: "green"},
	riposte: {color: "orange"},
	shield: {color: "green", subkits: ["block", "spell"]},
	sorcery: {color: "blue"},
	support: {color: "blue"},
}

toc.spells = {
	"energy blast": {color: "blue"},
	enfeeblement: {color: "purple"},
	fear: {color: "purple"},
	haste: {color: "orange"},
	imbue: {color: "orange"},
	"magic missile": {color: "blue"},
	"mind lash": {color: "purple"},
	purify: {color: "green"},
	shell: {color: "green"},
	"ward": {color: "green"},
	wither: {color: "purple"},
}

toc.masteries = {
	chill: {color: "purple"},
	combat: {color: "orange"},
	counterspell: {color: "blue"},
	grapple: {color: "orange"},
	guardian: {color: "green"},
	keen: {color: "orange"},
	"mage armor": {color: "green"},
	"mana flow": {color: "blue"},
	"mana surge": {color: "orange"},
	"mass": {color: "green"},
	"overcharge": {color: "blue"},
	"poison": {color: "purple"},
	"protection": {color: "green"},
	"push": {color: "blue"},
	"twin spell": {color: "blue"},
}
