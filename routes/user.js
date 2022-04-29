const verification = require("../middleware/verifyToken");
const User  = require("../models/User");
const router = require("express").Router() ;
//const CryptoJS = require("crypto-js")

router.put("/:id", verification.verifyTokenAndAuthorization, async (req, res) => {
    
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASSW
      ).toString();
    }
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  });

router.delete(":/id", verification.verifyTokenAndAuthorization, async (req,res)=>{
    try{
      await User.findByIdAndDelete({_id : req.params._id})
      res.status(200).json("Deleted Successfully")
    }
    catch(err)
    {
      res.status(500).json("There is some error while deleting" + err)
    }
})

//Get Users
router.get("/find/:id", verification.verifyTokenAndAdmin, async (req,res)=>{
    try{
      const user = await User.findById( {_id:req.params.id})
      const {password, ...others} = user._doc
      console.log(user._doc)
      res.status(200).json(others)
    }
    catch(err)
    {
      console.log(err)
      res.status(500).json(err)
    }
})
// Get All Users
router.get("/", verification.verifyTokenAndAdmin, async (req,res)=>{
  const query = req.query.new
  try{
    const users = query ? await User.find().sort({_id: -1 }).limit(2) : await User.find() ;
    //const {password, ...others} = user._doc
    console.log(users)
    res.status(200).json(users)
  }
  catch(err)
  {
    console.log(err)
    res.status(500).json(err)
  }   
})


// Get user stats
router.get("/stats", verification.verifyTokenAndAdmin, async (req,res)=>{
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() -1 ));
  try{
    const data = await User.aggregate([
      {$match: {createdAt: { $gte: lastYear}}},
      {
        $project: {
          month:{$month:"$createdAt"},
        },
      },
      {
        $group:{
          _id:"$month",
          total:{$sum:1}
        }
      }
    ])
    res.status(200).json(data)
  }
  catch(err)
  {
    res.status(500).json(err)
  }
})
module.exports = router ;