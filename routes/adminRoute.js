const express=require("express");
const router=express.Router();
const upload=require("../imageFolder/imgageUploade");
const {createShoe,getShoes,getSingleShoe,updateShoe,deleteShoe}=require("../controllers/adminControllers");

router.post("/",upload.single("image"),createShoe);
router.get("/",getShoes);
router.get("/:id",getSingleShoe)
router.put("/:id",upload.single("image"),updateShoe)
router.delete("/:id",deleteShoe)



module.exports=router;
