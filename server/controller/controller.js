const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const crypto=require('crypto');

const validate = (data) => {
	const schema = Joi.object({
		oldPassword: Joi.string().required().label("Old Password"),
    password: Joi.string().required().label("New Password"),
	});
	return schema.validate(data);
};

exports.findUser=async (req, res) => {
    const id = req.params.id;
    let user;
    try {
      user = await User.findById(id);
    } catch (err) {
      console.log(err);
    }
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }
    return res.status(200).json({ user });
}

exports.updateUser= async (req, res) => {
  const id = req.params.id;
  const {  phone,dob } = req.body;
  let user;
  try {
    user = await User.findByIdAndUpdate(id, {
      phone,
      dob
    });
    user = await user.save();
    // res.redirect('/');
  } catch (err) {
    console.log(err);
  }

  if (!user) {
    return res.status(404).json({ message: "Unable To Update By this ID" });
  }
  return res.status(200).json({ user });
}

exports.updatePageUser= async (req, res) => {
  const id = req.params.id;
  const { firstName,lastName,email,phone,dob } = req.body;
  let user;
  try {
    user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
      email,
      phone,
      dob
    });
    user = await user.save();
    // res.redirect('/');
  } catch (err) {
    console.log(err);
  }

  if (!user) {
    return res.status(404).json({ message: "Unable To Update By this ID" });
  }
  return res.status(200).json({ user });
}

exports.changePassword=async (req, res) => {
  
  const { oldPassword, password } = req.body;
	try {
		const { error } = validate(req.body); 
		if (error)
			return res.status(400).send({ message: error.details[0].message });

    // get user
		const user = await User.findById( req.params.id );
		if (!user)
			return res.status(401).send({ message: "User not exist" });

    // validate old password
		const validPassword = await bcrypt.compare(oldPassword,user.password);
		
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Password" });

    // hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // update user's password
    user.password = hashedPassword;
    const updatedUser = await user.save();

    return res.json({ user: updatedUser });

	} catch (error) {
		res.status(500).send({ message: "Something went wrong. Try again" });
	}
}

exports.resetPassword=async  (req,res)=>{
  crypto.randomBytes(32,(err,buffer)=>{
      if(err){
          console.log(err)
      }
      const token = buffer.toString("hex")
      User.findOne({email:req.body.email})
      .then(user=>{
          if(!user){
              return res.status(422).json({error:"User dont exists with that email"})
          }
          user.resetToken = token
          user.expireToken = Date.now() + 3600000
          user.save().then((result)=>{
              transporter.sendMail({
                  to:user.email,
                  from:"no-reply@profile.com",
                  subject:"password reset",
                  html:`
                  <p>You requested for password reset</p>
                  <h5>click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
                  `
              })
              res.json({message:"check your email"})
          })

      })
  })
}

exports.newPassword=async (req,res)=>{
  const newPassword = req.body.password
  const sentToken = req.body.token
  User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
  .then(user=>{
      if(!user){
          return res.status(422).json({error:"Try again session expired"})
      }
      bcrypt.hash(newPassword,12).then(hashedpassword=>{
         user.password = hashedpassword
         user.resetToken = undefined
         user.expireToken = undefined
         user.save().then((saveduser)=>{
             res.json({message:"password updated success"})
         })
      })
  }).catch(err=>{
      console.log(err)
  })
}