const express=require("express");
const mongoose=require("mongoose");
const path=require("path")
const cors=require("cors");
require("dotenv").config();
const adminRoute=require("./routes/adminRoute");
const app=express();

const PORT= process.env.PORT;

mongoose.connect(process.env.MONGODB_URL)
        .then(()=>{console.log("Mongofb COnnected");
        })
        .catch((error)=>{
         console.log("not connected");
         
        })
   
    //  server static upload directory
        app.use("/uploads" , express.static(path.join(__dirname,"uploads")));


        // middlware
    app.use(cors());
    app.use(express.json());
 
app.use("/api/admin/shoes",adminRoute)



app.get("/",(req,res)=>{
    res.send("hello backendD")
})

app.listen(PORT ,(req,res)=>{
    console.log(`server running PORT ${PORT}`);
    
})