var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database-mongo');
const axios = require('axios');
const cheerio = require('cheerio');
var billboard = require("billboard-top-100").getChart;

const port = process.env.PORT || 3000

var app = express();

app.use(express.static(__dirname + '/../react-client/dist'));

var count = {
  balenciaga: 0,
  bape: 0,
  chanel: 0,
  dior: 0,
  fendi: 0,
  giuseppe: 0,
  goyard: 0,
  givenchy: 0,
  gucci: 0,
  jordan: 0,
  laurent: 0,
  louis: 0,
  margiela: 0,
  nike: 0,
  patek: 0,
  polo: 0,
  prada: 0,
  raf: 0,
  'ralph lauren': 0, 
  saint: 0,
  versace: 0,
  vuitton: 0,
  zanotti: 0
}

var chartData = [];
var none = [];

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

asyncCall()
.then((countObj) => {
  var frequency = []
  for (var brand in count) {
    frequency.push(`${brand},${count[brand]}`)
  }
  console.log(frequency);

  frequency.map((brand) => {
    var tuple = brand.split(',');
    if (tuple[1] > 0) {
      chartData.push({x: tuple[0], y: (tuple[1] / 50 * 100)})
    } else {
      none.push(tuple[0])
    }
  })

  for (const brand in count) {
    count[brand] = 0;
  }
  console.log('async call done')
})

app.get('/data', (req, res) => {
  var data = {chart: chartData, empty: none}
  res.send(JSON.stringify(data));
})

// asyncCall();

app.listen(port, function() {
  console.log(`listening on port ${port}!`);
});