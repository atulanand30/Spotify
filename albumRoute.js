import e from "express";
import {
  addAlbum,
  listAlbum,
  removeAlbum,
} from "../controllers/albumController.js";
import upload from "../middleware/multer.js";

const albumRouter = e.Router();

albumRouter.post("/add", upload.single("image"), addAlbum);
albumRouter.get("/list", listAlbum);
albumRouter.post("/remove", removeAlbum);

export default albumRouter;
