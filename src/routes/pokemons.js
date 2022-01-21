var router = require('express').Router();
const { Pokemon, Type } = require('../db.js');
const fetch = require('cross-fetch');
const {url_image, url_40Items} = require('../helpers/listUrl');


router.get('/', async (req, res) => {
    const {name} = req.query
    const condition = name ? {where: {name}, include: Type} : {}
    
    if(name) {
        try{
            let result = [];
            var pokeApi = {};
            var pokeDb = {};
    
            try{
                pokeApi = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
                .then(res => res.json())
                .then(data => {
                    var poke = {
                        id: data.id,
                        name: data.name,
                        hp: data.stats[0].base_stat,
                        attack: data.stats[1].base_stat,
                        defense: data.stats[2].base_stat,
                        speed: data.stats[5].base_stat,
                        height: data.height,
                        weight: data.weight,
                        img: data.sprites.other.dream_world.front_default,
                        types: data.types.map(e => {
                            return e.type.name
                        })
                    }
                    return poke;
                })
                pokeApi ? result.push(pokeApi) : null;
    
            }catch(e){
                console.log(e)
            }
            
            try{
                pokeDb = await Pokemon.findOne(condition)
                .then(data => {
                    var poke = {
                        id: data.id,
                        name: data.name,
                        hp: data.hp,
                        attack: data.attack,
                        defense: data.defense,
                        speed: data.speed,
                        height: data.height,
                        weight: data.weight,
                        img: data.img,
                        types: data.types.map(e => {
                            return e.name
                        })
                    }
                    return poke;
                })
                pokeDb ? result.push(pokeDb) : null;
        
                }catch(e){
                    console.log(e)
                }
    
            if(result.length === 0) {
                res.send(alert("The name doesn't exist"))
            } else if (result.length === 1) {
                res.json(result[0])
            } else res.json(result);
    
        }catch(e){
            res.status(500).send('Server error')
        }
    } else {
        
        try {
            const dataApi = await fetch(url_40Items)
            .then(response => response.json())
            .then(data => data.results.map(async(e)=> {
                var data1 = await fetch(e.url)
                var data2 = await data1.json()
                return data2
            }));

            
            let dataDb =
            await Pokemon.findAll({include: Type})
            .then((data) => data.map(e => {
                return {
                    id: e.id,
                    name: e.name,
                    attack: e.attack,
                    img: e.img,
                    types: e.types.map(e => e.name)
                }
            }))

            Promise.all(dataApi)
            .then(data => {
                data.map(e => {
                    let item =  {
                        id: e.id,
                        name: e.name,
                        attack: e.stats[1].base_stat,
                        img: e.sprites.other.dream_world.front_default,
                        types: e.types.map(e => {
                            return e.type.name
                        })
                    }
                    dataDb.push(item)
                });
                res.send(dataDb)
            })

        }catch(e){
            res.status(500).send('Error en API')
        }
    }});

router.get('/:idPokemon', async (req, res) => {

    const {idPokemon} = req.params;

    try{
        if(idPokemon.length > 4) {
            await Pokemon.findByPk(idPokemon, {include: Type})
            .then(data => {
                res.send({
                    id: data.id,
                    name: data.name,
                    hp: data.hp,
                    attack: data.attack,
                    defense: data.defense,
                    speed: data.speed,
                    height: data.height,
                    weight: data.weight,
                    img: data.img,
                    types: data.types.map(e => {
                        return e.name
                    })
                });
            })

        } else {
            await fetch(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`)
            .then(response => response.json())
            .then(data => {
                res.send({
                    id: data.id,
                    name: data.name,
                    hp: data.stats[0].base_stat,
                    attack: data.stats[1].base_stat,
                    defense: data.stats[2].base_stat,
                    speed: data.stats[5].base_stat,
                    height: data.height,
                    weight: data.weight,
                    img: data.sprites.other.dream_world.front_default,
                    types: data.types.map(e => {
                        return e.type.name
                    })
                });
            })
        }
    }catch(e){
        res.status(500).send("That Pokemon doesn't exists");
    }
});

router.post('', async (req, res) => {

        const {name, hp, attack, defense, speed, height, weight, img, types} = req.body;
        
        try{        
            const newPokemon = await Pokemon.create({
                    name,
                    hp,
                    attack,
                    defense,
                    speed,
                    height,
                    weight,
                    img: img ? img : url_image
            });
    
            await newPokemon.addTypes(types);

            res.send(newPokemon);

        }catch(e){
            res.send(e)
        }
    });

module.exports = router;