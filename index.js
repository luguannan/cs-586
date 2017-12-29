var express = require('express');
var app = express();
var request = require('request');
var parser = require('csv');
var fs = require('fs');
var sparql = require("sparql");
var sparql-http-client = require("sparql-http-client");
const {Client} = require('virtuoso-sparql-client');

app.use(express.static(__dirname + '/public')); 


var query_result1 = [];
var query_result2 = [];
var query_result3 = [];
 
let client_service= new Client("http://localhost:8890/conductor/sparql_input.vspx?sid=6e28ad37958eef41b8dcf2ad2d3142d8&realm=virtuoso_admin");


function forwardRequest(req, res) {
    var input = req.param('input');
    var reu = "http://127.0.0.1:3006/"+input;

    if disaster =="earthquake"{

        var q = 'PREFIX rdf: <http://www.586-project.org/2017/tweets-rdf/3.0#>'+
            'SELECT ?time ?longitude ?latitude ?text WHERE{ {'+
            '?y rdf:time ?time. ?y rdf:longitude ?longitude. ?y rdf:latitude ?latitude. ?y rdf:text ?text. FILTER regex(?text, ".*quake.*", "i")}UNION'+
            '{ ?y rdf:time ?time. ?y rdf:longitude ?longitude. ?y rdf:latitude ?latitude. ?y rdf:text ?text. FILTER regex(?text, ".*shock.*", "i")}}'

        client_service.query(q)
          .then((results)=>{
            console.log(results);
            query_result3 = results;
            //return query_result3;

        })
      .catch(console.log);

    }else if disaster == "wildfire"{

      var q = 'PREFIX rdf: <http://www.586-project.org/2017/tweets-rdf/3.0#>'+
        'SELECT ?time ?longitude ?latitude ?text WHERE{{'+
        '?y rdf:time ?time. ?y rdf:longitude ?longitude. ?y rdf:latitude ?latitude. ?y rdf:text ?text. FILTER regex(?text, ".*fire.*", "i")}UNION'+
        '{ ?y rdf:time ?time. ?y rdf:longitude ?longitude. ?y rdf:latitude ?latitude. ?y rdf:text ?text. FILTER regex(?text, ".*burn.*", "i")}UNION'+
        '{ ?y rdf:time ?time. ?y rdf:longitude ?longitude. ?y rdf:latitude ?latitude. ?y rdf:text ?text. FILTER regex(?text, ".*flame.*", "i")}UNION'+
        '{ ?y rdf:time ?time. ?y rdf:longitude ?longitude. ?y rdf:latitude ?latitude. ?y rdf:text ?text. FILTER regex(?text, ".*blaz.*", "i")}}';


      client_service.query(q)
        .then((results)=>{
          console.log(results);
          query_result3 = results;
          //return query_result3;

        }

    req = request({

      url:reu


    }, function(error, response, body) {

      if (error) { return console.log(error); }

      res.send(query_result3);

      console.log(body);


  });
    //res.write(data);
}


function forwardSentimentRequest(req, res) {
    var input = req.param('input');
    var reu = "http://127.0.0.1:3006/"+input;

    req = request({

      url:reu


    }, function(error, response, body) {

      if (error) { return console.log(error); }

      res.send(body);

      console.log(body);


  });
    //res.write(data);
}

var disaster = "";


function forwardDisasterRequest(req, res) {

    var input = req.param('input');
    var month = req.param('month');
    var year = req.param('year');
    disaster = input;

    var q = 'PREFIX disaster:<http://www.586-project.com/disasters#>'+
      'SELECT ?name ?longitude ?latitude ?time ?state'+
      'WHERE { ?x disaster:name ?name. ?x disaster:longitude ?longitude. ?x disaster:latitude ?latitude. ?x disaster:time ?time. ?x disaster:state ?state. filter regex(?time, "'+ year + '-'+ month + '.*")}order by ?time';


    client_service.query(q)
      .then((results)=>{
      console.log(results);
      
      for( i in results){
        if name == input{
          query_result1.push(i);


        }
      }

    if input == "earthquake" {

      var newq = 'PREFIX disaster:<http://www.586-project.com/disasters#> PREFIX earthquake: <http://www.586-project.com/disasters/'+ input+'#>'+
          'SELECT ?name ?time ?longitude ?latitude ?magnitude WHERE {'+
          '?y disaster:name ?name. ?y disaster:time ?time. ?y disaster:longitude ?longitude. ?y disaster:latitude ?latitude. ?y earthquake:magnitude ?magnitude. }';

        client_service.query(newq)
          .then((results)=>{
            console.log(results);
            query_result2 = results;
            //return query_result2;


        })
    }else if input == "wildfire"{
      var newq = 'PREFIX disaster:<http://www.586-project.com/disasters#> PREFIX wildfire:<http://www.586-project.com/disasters/wildfire#>'+
      'SELECT ?name ?time ?longitude ?latitude ?state ?fire_size ?fire_size_class ?statistical_cause ?statistical_cause_code WHERE {'+
      '?y disaster:name ?name. ?y disaster:time ?time. ?y disaster:longitude ?longitude. ?y disaster:latitude ?latitude. ?y disaster:state ?state. ?y wildfire:fire_size ?fire_size.'+
      '?y wildfire:fire_size_class ?fire_size_class. ?y wildfire:statistical_cause ?statistical_cause. ?y wildfire:statistical_cause_code ?statistical_cause_code. FILTER (?name ="'+input'")}order by ?time'

         client_service.query(newq)
          .then((results)=>{
            console.log(results);
            query_result2 = results;
            //return query_result2;


        })
    }


    var reu = "http://127.0.0.1:3006/"+input+month+year;

    req = request({

      url:reu


    }, function(error, response, body) {

      if (error) { return console.log(error); }

      

      res.send(query_result2);

      console.log("ssss");
      console.log(body);


  });
    //res.write(data);
}




app.get('/disaster',function(req,res){
  forwardDisasterRequest(req,res);
})


app.get('/sentiment',function(req,res){
  forwardSentimentRequest(req,res);
})



app.get('/ex',function(req,res){
  forwardRequest(req, res);
 });

app.get('/', function(req, res) {
  res.sendfile('./public/index.html');
});

app.listen(3006);