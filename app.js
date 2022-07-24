let express = require('express');
let hltb = require('howlongtobeat');

let app = express();

let  hltbService = new hltb.HowLongToBeatService();

app.get('/getGames/:searchEntry',async function(req,res){
	let searchEntry = req.params.searchEntry;
	console.log(searchEntry);
	await hltbService.search(searchEntry).then(result => {
		console.log(result);
		res.json({'result':result});
	}).catch(e=> res.send('some error occured!'));
})


app.get('/gameDetail/:gameId',async function(req,res){

	let gameId = req.params.gameId;
	console.log(gameId);
	hltbService.detail(gameId).then(result =>{
		var constructedResponse = {
			'id' : result['id'],
			'name' : result['name'],
			'description' : '',
			'platforms' : result['platforms'],
			'imageUrl' : result['imageUrl'],
			'timeLabels' : result['timeLabels'],
			'gameplayMain' : result['gameplayMain'],
			'gameplayMainExtra' : result['gameplayMainExtra'],
			'gameplayCompletionist' : result['gameplayCompletionist'],
			'similarity' : result['similarity'],
			'searchTerm' : result['searchTerm'],
			'playableOn' : result['playableOn'],
		}
		var modifiedDescription = result['description'].replace(/\n/g, '').replace(/\t/g, '');
		constructedResponse['description'] = modifiedDescription;
		console.log(constructedResponse);
		res.json({'result':constructedResponse});
	}).catch(e => res.send('some error occured'));
})

app.listen(3000);

