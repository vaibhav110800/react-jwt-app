const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	phone: { type: String },
	dob: { type: String },
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{ _id: this._id }, 
		process.env.JWTPRIVATEKEY, {
			expiresIn: "7d",
	});
	return token;
};

const User = mongoose.model("user", userSchema);
////////////////////////////////////////////////////////

// validate function
const validate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity({
			min: 8,
			max: 25,
			lowerCase: 1,
			upperCase: 1,
			numeric: 1,
			symbol: 1,
			requirementCount: 4
		}).required().label("Password"),
	});
	return schema.validate(data); // it validates the const schema from line 27 
};
//Joi module is a popular module for data validation. This module validates the data based on schemas
//There are various functions like optional(), required(), min(), max(), etc which make it easy to use and a user-friendly module for validating the data.

// we use joi-password-complexity for password bcuz JOI new version doesn't support password validation
// joi-pas... Creates a Joi object that validates password complexity.
module.exports = { User, validate };
