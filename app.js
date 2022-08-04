const express = require('express');
const hltb = require('howlongtobeat');
const axios = require ('axios');
const cheerio = require('cheerio');



const popularGamesCssSelectors = [{
	"gameId" : "div.contain_out:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
	"name" : "div.contain_out:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li:nth-child(2) > div:nth-child(2) > h3:nth-child(1) > a:nth-child(1)",
	"image" : "div.contain_out:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li:nth-child(2) > div:nth-child(1) > a:nth-child(1) > img:nth-child(1)",
	"mainStoryTime" : "div.contain_out:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)",
	"mainPlusExtraTime" : "div.contain_out:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(4)",
	"completionistTime" : "div.contain_out:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(6)",

},
{	"gameId" : "div.contain_out:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
	"name" : "div.contain_out:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li:nth-child(3) > div:nth-child(2) > h3:nth-child(1) > a:nth-child(1)",
	"image" : "div.contain_out:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li:nth-child(3) > div:nth-child(1) > a:nth-child(1) > img:nth-child(1)",
	"mainStoryTime" : "div.contain_out:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)",
	"mainPlusExtraTime" : "div.contain_out:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(4)",
	"completionistTime" : "div.contain_out:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(6)",

},{ "gameId" : "li.back_darkish:nth-child(5) > div:nth-child(1) > a:nth-child(1)", 
	"name" : "li.back_darkish:nth-child(5) > div:nth-child(2) > h3:nth-child(1) > a:nth-child(1)",
	"image" : "li.back_darkish:nth-child(5) > div:nth-child(1) > a:nth-child(1) > img:nth-child(1)",
	"mainStoryTime" : "li.back_darkish:nth-child(5) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)",
	"mainPlusExtraTime" : "li.back_darkish:nth-child(5) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(4)",
	"completionistTime" : "li.back_darkish:nth-child(6) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(6)",

},{ "gameId" : "li.back_darkish:nth-child(6) > div:nth-child(1) > a:nth-child(1)",
	"name" : "li.back_darkish:nth-child(6) > div:nth-child(2) > h3:nth-child(1) > a:nth-child(1)",
	"image" : "li.back_darkish:nth-child(6) > div:nth-child(1) > a:nth-child(1) > img:nth-child(1)",
	"mainStoryTime" : "li.back_darkish:nth-child(6) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)",
	"mainPlusExtraTime" : "li.back_darkish:nth-child(6) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(4)",
	"completionistTime" : "li.back_darkish:nth-child(6) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(6)",

},{ "gameId" : "li.back_darkish:nth-child(8) > div:nth-child(1) > a:nth-child(1)",
	"name" : "li.back_darkish:nth-child(8) > div:nth-child(2) > h3:nth-child(1) > a:nth-child(1)",
	"image" : "li.back_darkish:nth-child(8) > div:nth-child(1) > a:nth-child(1) > img:nth-child(1)",
	"mainStoryTime" : "li.back_darkish:nth-child(8) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)",
	"mainPlusExtraTime" : "div.time_50:nth-child(4)",
	"completionistTime" : ".time_00",

},{ "gameId" : "li.back_darkish:nth-child(9) > div:nth-child(1) > a:nth-child(1)",
	"name" : "li.back_darkish:nth-child(9) > div:nth-child(2) > h3:nth-child(1) > a:nth-child(1)",
	"image" : "li.back_darkish:nth-child(9) > div:nth-child(1) > a:nth-child(1) > img:nth-child(1)",
	"mainStoryTime" : "li.back_darkish:nth-child(9) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)",
	"mainPlusExtraTime" : "li.back_darkish:nth-child(9) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(4)",
	"completionistTime" : "li.back_darkish:nth-child(9) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(6)",

}];



let app = express();


let  hltbService = new hltb.HowLongToBeatService();

app.get('/popularGames', async function(req,res){
	try{
	// let URL_R = 'https://www.metacritic.com/game' + '/' + platform + '/' + gameName;
    const URL_R = 'https://howlongtobeat.com/';
	// console.log(URL_R);
	let result =[];

 await axios(URL_R).then((res)=>{
         const html = res.data;
		const $ = cheerio.load(html);   
        for (i =0 ;i< 6;i++){
            var intRes = {};
			
			const gameIdDirty = $(popularGamesCssSelectors
            [i]['gameId']).attr('href');
			const gameId = gameIdDirty.split('=')[1];
            const image = $(popularGamesCssSelectors
            [i]['image']).attr('src');
            const name = $(popularGamesCssSelectors
            [i]['name']).html();
            const mainStoryTime = $(popularGamesCssSelectors
            [i]['mainStoryTime']).html();
            const mainPlusExtraTime = $(popularGamesCssSelectors
            [i]['mainPlusExtraTime']).html();
            const completionistTime = $(popularGamesCssSelectors
            [i]['completionistTime']).html();
            intRes.image = image;
			intRes.gameId = gameId;
            intRes.name = name;
            intRes.mainStoryTime = mainStoryTime;
            intRes.mainPlusExtraTime = mainPlusExtraTime;
            intRes.completionistTime = completionistTime;
            result[i] = intRes;
        }
		
		
	}).catch (e=>{
		console.log(e);
		result = e;
	})

	res.json({"popularGames":result});
	}catch (error){
		console.log(error);
	res.json({"popularGames":"Not Found"});

	}
	

});

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

