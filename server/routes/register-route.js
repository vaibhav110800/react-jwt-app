//register router
const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt"); //Bcrypt is a popular and trusted method for salt and hashing passwords.

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body); // we use validate funtion from models to validate the input from user
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email }); // we find new input user in our User database
		if (user) // if user exist with same email
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		// a salt is random data that is used as an additional input to a one-way function that hashes data, a password or passphrase. Salts are used to safeguard passwords in storage.
		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt); // first we create salt and then hash for more strong encrpted password

		await new User({ ...req.body, password: hashPassword }).save(); // user comes from user schema from models and we add new encrypted password in body by destructuring
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;
