$(function(){
//-------------------------------
//Prototypes

String.prototype.getScore = function(){
	let score = 1;
	for(let index = 0; index < this.length; index++){
		if(this.charAt(index) ===  target.charAt(index)){
			score++;
		}
	}
	return score*score;
}

Array.prototype.random = function(){
	return this[Math.floor(Math.random()*this.length)];
}

//------------------------------------------
//Variables

const mutation = 2;
let target;
let generation = 0;
let timer;
const FPS = 50;
const dico = [];
for(let i = ' '.charCodeAt(0); i <= '~'.charCodeAt(0); i++){
	dico.push(String.fromCharCode(i));
}
let population = {
	allWords:[],
	popSize:100,
	matingPool:[]
};
population.setRanWords = () => {
	population.allWords = [];
	for(let i=0; i<population.popSize; i++){
		let ranWord = '';
		for(let iletter=0; iletter<target.length; iletter++){
			ranWord += dico.random();
		}
		if(ranWord.length !== target.length){
			console.log(ranWord);
		}
		population.allWords.push(ranWord);
	}
}
population.showWords = () => {
	$('#pop').html('');
	for(let i in population.allWords){
		let showWord = '';
		for(let j = 0; j < population.allWords[i].length; j++){
			let curChar = population.allWords[i].charAt(j);
			showWord += (curChar === '<') ? '&lt;' : curChar;
		}
		$('#pop').append(showWord).append('<br>');
	}
}
population.setWordsWeight = () => {
	let max = {score:0,index:0};
	for(let i=0; i<population.allWords.length; i++){
		let curScore = population.allWords[i].getScore();
		if(max.score < curScore){
			max.score = curScore;
			max.index = i;
		}
	}
	$('#max').text(population.allWords[max.index]);
	population.matingPool = [];
	for(let i=0; i<population.allWords.length; i++){
		let n = population.allWords[i].getScore()/max.score;
		for(let j=0; j<n*100; j++){
			population.matingPool.push(population.allWords[i]);
		}
	}
}
population.newSon = ()  => {
	let parents = [population.matingPool.random(), population.matingPool.random()];
	let son = '';
	for(let i=0; i<target.length; i++){
		son += (Math.random()<mutation/100) ? dico.random() : parents.random().charAt(i);
	}
	return son;
}
population.newGen = () => {
	for(let i in population.allWords){
		population.allWords[i] = population.newSon();
	}
}

//------------------------------------------
//Update

const update = () => {
	population.showWords();
	population.setWordsWeight();
	population.newGen();
}

//------------------------------------------
//jQuery 

$('input').css({
	'width':''+window.innerWidth/2
});
const start = () => {
	for(let i=0; i<50; i++){
		$('#UI2').append('<br>');
	}
	$('#mainbtn').attr('disabled', 'true');
	$('#maintxb').attr('disabled', 'true');
	$('#UI2').slideToggle(1000, 'swing', () => {
		$('#hr').animate({'width':'toggle'}, {complete:() => {
			target = $('#maintxb').val();
			population.setRanWords();
			timer = setInterval(update,1000/FPS);
		}});

	});
	$('#mainbtn').fadeToggle();
}
$('#maintxb').keypress(e => {
	if(e.which == 13){
		start();
	}
});
$('#mainbtn').click(start);

});//OnLoad