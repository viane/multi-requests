//https://jsonmock.hackerrank.com/api/movies/search/?Title=maze

const express = require('express');
const https = require('https');
const http = require('http');
const app = express();
var rp = require('request-promise');
const server = http.createServer(app);
const async = require('async');
app.set('port', 3000);

server.listen(3000, function() {});

var getPromise = (url)=>{
  return new Promise(function(resolve, reject) {
    var options ={
      uri: url,
      method: 'get',
      json: true // Automatically parses the JSON string in the response
    }
    rp(options).then(data => {
      // console.log("Get data: ", data);
      resolve(data)
    })
  });
}


app.get('/:title', (req, sres) => {
  var substr = req.params.title;
  var options = {
    uri: 'https://jsonmock.hackerrank.com/api/movies/search/?Title=' + substr,
    method: 'get',
    json: true // Automatically parses the JSON string in the response
  };
  var titleAry = [];
  rp(options).then(function(parsedBody) {
    var totalPage = parsedBody.total_pages;
    var urls = [];
    for (var i = 1; i < totalPage + 1; i++) {
      urls.unshift('https://jsonmock.hackerrank.com/api/movies/search/?Title=' + substr + '&page=' + i);
    }

    const finalResultPromise = urls.map((url) => {
      // console.log("Url: ", url);
      return getPromise(url); // return each promise
    })

    let movieData = [];
    Promise.all(finalResultPromise).then(values => { // wait all promise resolved with data
      // console.log(JSON.strivalues);

      for (var i = 0; i < values.length; i++) {
        for (var x = 0; x < values[i].data.length; x++) {
          movieData.unshift(values[i].data[x].Title)
        }
      }

      console.log(movieData.sort());

      // for (var i = 0; i < values.data.length; i++) {
      //   movieData.unshift(values.data[i])
      // }

      sres.json({data: movieData});
    })




    // async.map(urls, function(url, callback) {
    //   request(url, function(error, response, html) {
    //     // Some processing is happening here before the callback is invoked
    //     callback(error, html);
    //   });
    // }, function(err, results) {
    //   // the result jsons should be in the results[]
    //   console.log(results);
    //   sres.json(results);
    // });

  }).catch(function(err) {
    // POST failed...
  });
})
