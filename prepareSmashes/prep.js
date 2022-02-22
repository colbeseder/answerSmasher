const axios = require('axios')

var apiURI = "http://localhost:3000"

function findPair(first){
	axios.get(apiURI + "/api/entryByStart/" + encodeURIComponent(first.end))
		.then(function(res){
			try {
				console.log(first.end)
				console.log('---')
				console.log(res.data.start)
				var smash = {
					firstAnswer: first._id,
					firstClue: first.clue,
					secondAnswer: res.data._id,
					secondClue: res.data.clue
				}
				saveSmash(smash)
		}
		catch(err){}
	});
}

function newSmash(){
	axios.get(apiURI + "/api/randomEntry")
	.then(function(res){
		findPair(res.data)
	});
}

function saveSmash(smash){
	if (smash.secondAnswer){
		console.log(smash)
	}
	else {
		newSmash();
	}
}

newSmash()