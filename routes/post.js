const router = require('express').Router();
const verify = require('./verifyUser');

router.get('/', verify, (req, res) => {
	res.send('You passed JWT and are on Post.');
});

module.exports = router;
