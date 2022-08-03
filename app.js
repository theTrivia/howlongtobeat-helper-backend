const express = require('express');
const hltb = require('howlongtobeat');
const axios = require ('axios');
const cheerio = require('cheerio');


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

app.get('/gameDetail/:platform/:gameName', async function(req,res){
	try{
		let platform = req.params.platform;
	let gameName = req.params.gameName;
	let URL_R = 'https://www.metacritic.com/game' + '/' + platform + '/' + gameName;
	console.log(URL_R);
	let result ;

 await axios(URL_R).then((res)=>{
		const html = res.data;
		
		const $ = cheerio.load(html);
		const mango = $(".product_summary > span:nth-child(2) > span:nth-child(1) > span:nth-child(2)");
		const gameDetail = mango.html();
		result = gameDetail;
	}).catch (e=>{
		console.log('e');
		result = "Not Found";
	})

	res.json({"game-detail":result});

	}catch (error){
		console.log('error');
	res.json({"metascore":"Not Found"});

	}
	

});


app.get('/metascore/:platform/:gameName', async function(req,res){
	try{
		let platform = req.params.platform;
	let gameName = req.params.gameName;
	let URL_R = 'https://www.metacritic.com/game' + '/' + platform + '/' + gameName;
	console.log(URL_R);
	let result ;

 await axios(URL_R).then((res)=>{
		const html = res.data;
		
		const $ = cheerio.load(html);
		const mango = $(".xlarge > span:nth-child(3)");
		const gameDetail = mango.html();
		result = gameDetail;
	}).catch (e=>{
		console.log(e);
		result = "Not Found";
	})

	res.json({"metascore":result});
	}catch (error){
		console.log(error);
	res.json({"metascore":"Not Found"});

	}
	

});

app.listen(3000);

