const router = require('express').Router();  
const welcome = require('../helpers/welcome.js');
const pokemonsRoutes = require('./pokemons.js');
const typesRoutes = require('./types.js');



// Configurar los routers
router.get('/', (req, res) => {
    res.json(welcome)
});
router.use('/pokemons', pokemonsRoutes);
router.use('/types', typesRoutes);

module.exports = router;