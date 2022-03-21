const User = require("../models/User")
const router = require("express").Router() ;
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()


//Register

router.post("/register", async (req,res)=>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSW).toString(),
    })
    try{
        const savedUser = await newUser.save() ;
        console.log("varun Done" + savedUser);
        res.send(savedUser)
    }
    catch(err){
        console.log(err)
        res.send(err) ; 
    }
});

// Login Route

router.post("/login", async (req,res)=>{
    try{
        const user = await User.findOne({username: req.body.username}) ;
        !user && res.send("No user Found")
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSW)
        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)
        if(OriginalPassword != req.body.password)
        {
            res.send("Wrong Credentials")
        }
        const accessToken = jwt.sign({
            id:user._id,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC,
        {expiresIn: "3d"}
        )
        const {password, ...others} = user._doc ;
        res.status(200).json({...others,accessToken}) ;
    }
    catch(err)
    {
        res.status(500).json(err)
    }

})
module.exports = router ;