'use strict';
var request = require('request');
var cheerio = require('cheerio');
var urlparse = require('url-parse');
var base64Img = require('base64-img');
var Filme = require('../filme/filme.model')

var LINK = "http://www.cinemainterativo.com/page/";


exports.importaFilmes = function(quantidadePaginas) {
  _importaFilmes(quantidadePaginas,263);
};

function _importaFilmes(quantidadePaginas,paginaAtual) {
  if (paginaAtual <= quantidadePaginas) {
    console.log("Iniciando Captura Página: "+paginaAtual);
    var link = LINK+paginaAtual;
    _getMovies(link,function(res,err) {
      if (err) {
        console.log(err.message);
      } else {
        console.log("Concluído a Captura Página: "+paginaAtual);
      }
    });
    setTimeout(function () {
      _importaFilmes(quantidadePaginas,paginaAtual+1);
    }, 5000);
  }
};

function _getMovies(link,cb) {
  _getBody(link,function(res,err) {
    if (err) {
      cb(res,err);
    } else {
      var $ = cheerio.load(res);
      $('div.box-filme').each(function(i, element){
        _parseMovie($(this),function(movie) {
          Filme.create(movie, function(err, filme) {
            if (err) {
              console.log(err.message);
            } else {
              console.log("Filme "+filme.nome+" cadastrado com sucesso!");
            }
          });
        });
      });
    }
  })
};

function _parseMovie(data,cb){
  var imgUrl = data.find('img').attr('src');
  _getImage(imgUrl,function(body,err) {
    var movie = {};
    if (err) {
      console.log(err.message);
      movie.imagem = "";
    } else {
      movie.imagem = body;
      movie.nome = data.find('h3.nome-filme').text();
      movie.qualidade = data.find('span.qualidade').text();
      movie.audio = data.find('span.audio').text();
      movie.ano = data.find('span.ano').text();
      movie.url = data.find('a.imagem').attr('href');
      var imdb = data.find('span.imdb');
      movie.imdb = imdb.text().split(" ")[1];
    }
    cb(movie);
  });
}

function _getImage(url,cb){
  try {
    base64Img.requestBase64(url, function(err, res, body) {
      if (err) {
        console.log(err.message);
        cb(body,err)
      } else {
        cb(body)
      }
    });
  } catch (err) {
    console.log(err.message);
  } finally {

  }
}

function _getBody(link,cb) {
  request(link, function(error, response, body) {
     if(error) {
       console.log(error.message);
       cb(response,error);
     }else {
       cb(body);
     }
  });
};
