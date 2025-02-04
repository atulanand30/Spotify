import { v2 as cloudinary } from "cloudinary";
import albumModel from "../models/albumModel.js";

const addAlbum = async (req, res) => {
  try {
    const name = req.body.name;
    const desc = req.body.desc;
    const bgcolor = req.body.bgcolor;
    const imageFile = req.file;

    if (!imageFile) {
      throw new Error("Image file is required");
    }

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image", // Corrected typo here
    });

    const albumData = {
      name,
      desc,
      bgcolor,
      image: imageUpload.secure_url,
    };

    const album = new albumModel(albumData); // Ensure proper instantiation with `new`
    await album.save();

    res.json({ success: true, message: "Album added" });
  } catch (error) {
    console.error("Error adding album:", error); // Log the error for debugging
    res.json({ success: false, message: error.message });
  }
};

const listAlbum = async (req, res) => {
  try {
    const allAlbums = await albumModel.find({});
    res.json({ success: true, albums: allAlbums });
  } catch (error) {
    res.json({ success: false });
  }
};

const removeAlbum = async (req, res) => {
  try {
    await albumModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Album removed" });
  } catch (error) {
    res.json({ success: false });
  }
};

export { addAlbum, listAlbum, removeAlbum };
