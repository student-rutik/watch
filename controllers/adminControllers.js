const fs=require("fs")
const path=require("path");
const Shoe=require("../models/ShoeSchema")


//---------------Create a new product------------------
// const createShoe = async (req, res) => {
//     try {
//       const { name, brand, price } = req.body;
  
//       const baseUrl = `${req.protocol}://${req.get("host")}`; // Construct base URL
//       const imageUrl = req.file ? `${baseUrl}/uploads/${req.file.filename}` : "";
  
//       // Create and save new product
//       const newShoe = new Shoe({ name, brand, price, imageUrl });
    
//       await newShoe.save();
//       res.status(201).json(newShoe);
//     } catch (error) {
//       res.status(500).json({
//         error: "Error Creating Shoe Server-Side",
//         success:false,
//         message: error.message,
//       });
//     }
//   };


const createShoe = async (req, res) => {
  try {
    const { name, brand, price } = req.body;

    // Validate the input fields
    if (!name || !brand || !price) {
      if (req.file) {
        // If validation fails and a file was uploaded, delete the file
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Name, brand, and price are required fields.",
      });
    }

    // Create the image URL if a file was uploaded
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = req.file ? `${baseUrl}/uploads/${req.file.filename}` : "";

    // Create and save new product
    const newShoe = new Shoe({ name, brand, price, imageUrl });
    await newShoe.save();
    
    res.status(201).json(newShoe);
  } catch (error) {
    // If there's an error during save, delete the uploaded file if it exists
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      error: "Error Creating Shoe Server-Side",
      success: false,
      message: error.message,
    });
  }
};


  //---------------Get all products from database------------------

const getShoes = async (req, res) => {
    try {
      const shoes = await Shoe.find();
      res.status(200).json(shoes);
    } catch (error) {
      res
        .status(500)
        .json({
          error: "Error fetching Shoes Server-Side",
          message: error.message,
        });
    }
  };


  //---------------Get a single shoe by ID------------------
const getSingleShoe = async (req, res) => {
    try {
      const { id } = req.params;
      const shoe = await Shoe.findById(id); // Find shoe by ID
  
      if (!shoe) {
        return res.status(404).json({
          error: "Shoe not found",
        });
      }
  
      res.status(200).json(shoe);
    } catch (error) {
      res.status(500).json({
        error: "Error fetching Shoe Server-Side",
        message: error.message,
      });
    }
  };

  //---------------Update shoe by ID------------------
  const updateShoe = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const file = req.file;
  
      console.log("Uploaded file info:", file);
  
        // // Handle file upload
      if (file) {
        // Fetch the existing shoe to remove its image
        const existingShoe = await Shoe.findById(id);
        if (existingShoe && existingShoe.imageUrl) {
          const oldImagePath = path.join(
            __dirname,
            "..",
            "uploads",
            existingShoe.imageUrl.split("/").pop()
          );
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Failed to delete old image file:", err);
          });
        }
  
        // Construct the base URL and image URL
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const imageUrl = `${baseUrl}/uploads/${file.filename}`;
        // Update the image URL
        updates.imageUrl = imageUrl;
      }
  
      // Perform the update
      const updatedShoe = await Shoe.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });
  
      // Check if the shoe was found and updated
      if (!updatedShoe) {
        return res.status(404).json({ message: "Shoe not found" });
      }
  
      res.status(200).json(updatedShoe);
    } catch (error) {
      // If there's an error during update, delete the uploaded file if it exists
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).json({
        error: "Error updating Shoe Server-Side",
        message: error.message,
      });
    }
  };








   //---------------delete shoe by ID------------------
   const deleteShoe = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedShoe = await Shoe.findByIdAndDelete(id);
  
      // Check if the shoe was found and deleted
      if (!deletedShoe) return res.status(404).json({ error: "Shoe not found" });
  
      // Delete the associated image file if it exists
      if (deletedShoe.imageUrl) {
        const imagePath = path.join(
          __dirname,
          "..",
          "uploads",
          deletedShoe.imageUrl.split("/").pop()
        );
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Failed to delete image file:", err);
          }
        });
      }
  
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  
  module.exports={
    createShoe,
    getShoes,
    getSingleShoe,
    updateShoe,
    deleteShoe
  }