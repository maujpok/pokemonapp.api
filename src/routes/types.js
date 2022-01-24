var router = require('express').Router();
module.exports = router;
const { Type } = require('../db.js');

router.get('', async function (req, res) {
    const types = await Type.findAll();
    res.send(types);
});

router.post('', async (req, res) => {
    const {name} = req.body;
    await Type.create({
        name
    });
    res.send("Type added correctly")
});

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const {name} = req.body;

    await Type.update(
        {name: name},
        {where: {id:id}}
    );
    res.send("ok")
});