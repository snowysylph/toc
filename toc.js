
var toc = {};

toc.init = function init (){
	$(".stat").spinner({min: 3, max: 8, stop: toc.update}).val(3);
	$("#health").spinner({min: 0, stop: toc.update}).val(0);
	$("#mana").spinner({min: 0, stop: toc.update}).val(0);
	
	Object.keys(toc.archetypes).sort().forEach(function (kit){
		$("#archetype").append("<option value="+ kit +">"+ toc.capWord(kit) +"</option>");
	})
	Object.keys(toc.kits).sort().forEach(function (kit){
		$(".kit").append("<option value="+ kit +">"+ toc.capWord(kit) +"</option>");
	})
	
	$("input").on("change", toc.update)
	$("select").on("change", toc.update)
	$("#statusText").on("change", toc.update)
	$("#traitsText").on("change", toc.update)
	
	$("#maxStatus").on("click", function (){
		toc.update();
		$("#health").val($("#maxHealth").text());
		$("#mana").val($("#maxMana").text());
		toc.update();
	})
}

toc.capWord = function capWord (string){
	return string && string.charAt(0).toUpperCase() + string.slice(1);
};

toc.update = function update (){
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
	
	if (char.maxMana)	$(".magic").show();
	else $(".magic").hide();
		
	toc.printChar(char);
}

toc.buildChar = function buildChar (){
	var char = {
		name: $("#name").val(),
		health: $("#health").val(),
		mana: $("#mana").val(),
		archetype: $("#archetype").val(),
		kits: [$("#kit1").val(), $("#kit2").val()],
		strength: $("#strength").val(),
		speed: $("#speed").val(),
		stamina: $("#stamina").val(),
		agility: $("#agility").val(),
		will: $("#will").val(),
		charm: $("#charm").val(),
	};
	
	char.maxHealth = 4 * char.stamina;
	char.maxMana = 0;
	if (char.archetype == "mage") char.maxMana += 12;
	if (char.kits[0] == "sorcery") char.maxMana += 4;
	if (char.kits[1] == "sorcery") char.maxMana += 4;
	
	return char;
}

toc.printChar = function printChar (char){
	var output = "";
	
	output += "[user]"+ char.name +"[/user] - " + 
		"Health: [color=red]"+ char.health +"[/color]/[color=red]"+ char.maxHealth +"[/color]";
		
	if (char.maxMana) output += " | Mana: [color=blue]"+ char.mana +
		"[/color]/[color=blue]"+ char.maxMana +"[/color]";

	if ($("#statusText").val()) output += " | "+ $("#statusText").val();
	
	output += "\n[color="+ toc.archetypes[char.archetype].color +"]"+ toc.capWord(char.archetype) +"[/color]"+ 
		" | [color="+ toc.kits[char.kits[0]].color +"]"+ toc.capWord(char.kits[0]) +"[/color],"+
		" [color="+ toc.kits[char.kits[1]].color +"]"+ toc.capWord(char.kits[1]) +"[/color]"+
		" ( STR "+ char.strength +" | SPD "+ char.speed +" | STA "+ char.stamina +
		" | AGI "+ char.agility +" | WIL "+ char.will + " | CHA "+ char.charm + " )";	
	
	if ($("#traitsText").val()) output += "\n"+ $("#traitsText").val();
	
	$("#preview").html(bb.parse(output));
	$("#output").text(output);
	return output;
}

toc.archetypes = {
	fighter: {color: "orange"},
	brute: {color: "green"},
	mage: {color: "blue"},
}

toc.kits = {
	acrobatics: {color: "orange"},
	archery: {color: "blue"},
	awareness: {color: "green"},
	berserk: {color: "red"},
	block: {color: "green"},
	endurance: {color: "green"},
	evasion: {color: "blue"},
	fearsome: {color: "purple"},
	flight: {color: "green"},
	keen: {color: "orange"},
	initiative: {color: "green"},
	manipulate: {color: "purple"},
	poison: {color: "purple"},
	ripose: {color: "orange"},
	sorcery: {color: "blue"},
}

toc.spells = {
	"energy blast": {color: "blue"},
	enfeeblement: {color: "purple"},
	fear: {color: "purple"},
	haste: {color: "orange"},
	imbue: {color: "green"},
	"magic missile": {color: "blue"},
	"mind lash": {color: "purple"},
	purify: {color: "green"},
	shield: {color: "green"},
	"ward": {color: "green"},
	wither: {color: "purple"},
}
