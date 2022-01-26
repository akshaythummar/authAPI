const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { registrationValidation, loginValidation } = require('../validation');

//registering user
router.post('/register', async (req, res) => {
	//validate the data before crate user
	const { error } = registrationValidation(req.body);
	if (error) return res.status(400).send(error);

	//checking if the user is already in database
	const emailExist = await User.findOne({ email: req.body.email });
	if (emailExist) return res.status(400).send('email already exists !');

	//hash the passwords
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	//create a new user
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword,
	});
	try {
		const savedUser = await user.save();
		res.json(savedUser);
	} catch (err) {
		res.status(400).send(err);
	}
});

//logging in user
router.post('/login', async (req, res) => {
	const { error } = loginValidation(req.body);
	if (error) return res.status(400).send(error);

	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).send('email not found !');

	//checking password
	const validPass = await bcrypt.compare(req.body.password, user.password);
	if (!validPass) return res.status(400).send('invalid passsword');

	//creating and assigning token
	const token = jwt.sign({ _id: user._id }, process.env.TOKEN);
	res.header('auth-token', token).send(token);
});

router.get('/register', async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (error) {
		res.json(error);
	}
});

router.delete('/register/:userID', async (req, res) => {
	try {
		const deletedUser = await User.deleteOne({ _id: req.params.userID });
		res.json(deletedUser);
	} catch (error) {
		res.json({ message: error });
	}
});
module.exports = router;
