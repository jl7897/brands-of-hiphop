var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database-mongo');
const axios = require('axios');
const cheerio = require('cheerio');
var billboard = require("billboard-top-100").getChart;

var app = express();

app.use(express.static(__dirname + '/../react-client/dist'));

var count = {
  patek: 0,
  gucci: 0,
  versace: 0,
  prada: 0,
  chanel: 0,
  louis: 0,
  vuitton: 0,
  fendi: 0,
  dior: 0,
  givenchy: 0,
  ralph: 0, 
  polo: 0,
  saint: 0,
  laurent: 0,
  bape: 0,
  balenciaga: 0,
  giuseppe: 0,
  zanotti: 0,
  nike: 0,
  jordan: 0,
  margiela: 0,
  "alexander wang": 0,
  goyard: 0,
  raf: 0
}

const billboardPromise = new Promise ((resolve, reject) => {
  billboard('r-b-hip-hop-songs', (songs, err) => {
    if (err) {
      reject(err)
    } else {
      resolve(songs)
    }
  })
})

async function asyncCall() {
  console.log('CALLING');
  var result = await billboardPromise;
  for (const listing of result) {
    var artist = listing.artist.split('Featuring')[0].trim().split(' ').join('-');
    try {
      var html = await axios.get(`http://www.songlyrics.com/${artist}/${listing.title}-lyrics/`)
      const $ = cheerio.load(html.data);
      const lyrics = $('#songLyricsDiv').text()
      //.split('\n').join(' ').split(' ');
      // lyrics.forEach((word) => {
      for (var brand in count) {
        if (lyrics.toLowerCase().includes(brand)) {
          count[brand]++
        }
      }
      // })
    } catch (err) {
      console.log('NOT FOUND');
    }
  }
  console.log('DONE');
  return count;
}

app.get('/data', (req, res) => {
  asyncCall()
  .then((countObj) => {
    console.log(countObj.patek);
    var frequency = []
    for (var brand in count) {
      frequency.push(`${brand},${count[brand]}`)
    }
    console.log(frequency);
    res.send(JSON.stringify(frequency))
  })
})

// asyncCall();

app.listen(3000, function() {
  console.log('listening on port 3000!');
});