const { Type } = require('../db');
const fetch = require('cross-fetch');

module.exports = async () => {
    const pokemonTypes = await fetch(`https://pokeapi.co/api/v2/type/`)
    .then(response => response.json())
    .then(data => data.results.map(e => {
      return Type.create({
        name: e.name
      })
    }))
  Promise.all(pokemonTypes)
    .then(res => console.log("Pokemon's types loaded!"));
}