'use strict';

var http = require('http');
var express = require('express');
var mongoose = require('mongoose');

//DADOS 'DEFAULT' DO SERVIDOR
// var ENDEREÇO = '127.0.0.1';
// var PORTA = 3000;
var URI_DO_BD = 'mongodb://localhost/MovieDBCrawler';
//
// //INICIALIZANDO A APLICAÇÃO DO EXPRESS
// var APP = express();

//INICIALIZANDO A CONEXÃO COM O MONGODB
mongoose.connect(URI_DO_BD);
mongoose.connection.on('error', function() {
  console.log('Nao foi possivel se conectar com o BD');
  process.exit(-1);
});

// var SERVIDOR = require('http').createServer(APP);
// require('./configuracoes/express')(APP);
//
// require('./configuracoes/rotas')(APP);
//
// SERVIDOR.listen(PORTA, ENDEREÇO, () => {
//
// });

var cinemainterativo = require('./crawlers/cinemainterativo.com');
cinemainterativo.importaFilmes(412);
