var router = require('express').Router();
module.exports = router;
const { Type } = require('../db.js');

router.get('', async function (req, res) {
const types = await Type.findAll();
res.send(types);
});