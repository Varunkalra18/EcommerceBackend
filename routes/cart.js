const router = require("express").Router() ;
const Cart = require("../models/Cart")
const verification = require("../middleware/verifyToken")

router.post("/", verification.verifyToken, async (req,res)=>{
    const newCart = new Cart(req.body)
    try{
        const savedCart = await newCart.save()
        res.status(200).json(savedCart)
    }
    catch(err)
    {
        res.status(200).json(err)
    }
})
router.put("/:id", verification.verifyTokenAndAuthorization, async (req,res)=>{
    try{
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set:req.body
            },
            {new : true}
        )
        res.status(200).json(updatedCart)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
})
router.delete("/:id", verification.verifyTokenAndAuthorization, async(req,res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Product successfully deleted from the cart")
    }
    catch(err)
    {
        res.status(500).json(err)
    }
})
router.get("/find/:userId", verification.verifyTokenAndAuthorization, async(req,res)=>{
    try{
        const cart = await Cart.findOne({userID: req.params.userId})
        res.status(200).json(cart)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
})
router.get("/", verification.verifyTokenAndAdmin, async(req,res)=>{
    try{
        const allCarts = await Cart.find()
        res.status(200).json(allCarts)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
})
module.exports = router ;