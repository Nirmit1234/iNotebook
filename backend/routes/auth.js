const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const JWT_SECRET = 'Nirmitisagoodboy';
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

// ROUTE1: Create a User using: POST "/api/auth/createUser". No require Login
router.post('/createUser', [
    body('name','Enter a valid name').isLength({ min: 5 }),
    body('email','Enter a valid email-id').isEmail(),
    body('password','Password must be 5 characters a').isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    // If there are errors,return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success,errors: errors.array() });
    }
    try{
    // Check whether the user  with this emial exists already 
    let user = await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({success,errors:"Sorry a user with email already exists"})
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt);
    // Create a new User
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass
    });
    const data={
        user:{
            id:user.id
        }
    }
    const authToken = jwt.sign(data,JWT_SECRET);
    success = true;
    // res.json(user)
    res.json({success,authToken});
    } 
    // catch errors
    catch(errors){
        console.error(errors.message);
        res.status(500).send("Internal Server Error Occured");
    }
});

// ROUTE2: Authenticate a User using:POST"/api/auth/login. No login require
router.post('/login',[
    body('email','Enter a valid email-id').isEmail(),
    body('password','Password cannot be blank').exists(),
], async (req, res) => {
    let success = false;
    // If there are errors,return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() });
    }
    const {email,password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"Please try to login with correct credintials "});
        }
        const passCompare = await bcrypt.compare(password,user.password);
        if(!passCompare){
            success = false
            return res.status(400).json({success,error:"Please try to login with correct credintials "});
        }
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data,JWT_SECRET);
        success = true;
        res.json({success,authToken})
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error Occured");
    }
})
// ROUTE 3: Get loggedin user details usinf: POST "/api/auth/getuser".  Login required 
router.post('/getuser',fetchuser,async (req, res) => {

    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error Occured");
}
})
module.exports = router;
