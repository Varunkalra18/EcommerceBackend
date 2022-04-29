const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/products")
app.use(express.json())
dotenv.config()
mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("successfully connected"))
.catch((err)=>{
    //console.log("err")
    console.log(err)
}) ;

app.get("/", (req,res)=>{
    console.log("Varun was here")
    res.send("varun")
})
app.get("/api/test",(req,res)=>{
    console.log("Varun") ;
    res.send("all Ok")
})
app.use("/api/auth",authRoute) ;
app.use("/api/users/", userRoute);
app.use("/api/product", productRoute);

app.listen(3000, ()=> {
    console.log("Backend Server is running")
})