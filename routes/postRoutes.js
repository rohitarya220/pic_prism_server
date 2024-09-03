const router = require('express').Router()

router.get('/new', (req, res) => {
    res.json({message: 'new message'})
})

module.exports = router