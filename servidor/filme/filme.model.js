'use strict';

var mongoose = require('mongoose');

var filmeSchema = new mongoose.Schema({
  nome : {
    type:String,
    unique:true
  },
  qualidade : String,
  audio : String,
  ano : String,
  url : String,
  imdb : String,
  imagem : String,
  dataDoCadastro : {
    type : Date,
    default : Date.now
  }
});

module.exports = mongoose.model('filme',filmeSchema);
