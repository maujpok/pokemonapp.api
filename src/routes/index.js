const router = require('express').Router();  
const pokemonsRoutes = require('./pokemons.js');
const typesRoutes = require('./types.js');



// Configurar los routers
router.use('/pokemons', pokemonsRoutes);
router.use('/types', typesRoutes);

module.exports = router;