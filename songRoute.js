import {
  addSong,
  listSong,
  removeSong,
} from "../controllers/songController.js";
import e from "express";
import upload from "../middleware/multer.js";

const songRouter = e.Router();

songRouter.post(
  "/add",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  addSong
);
songRouter.get("/list", listSong);
songRouter.post("/remove", removeSong);

export default songRouter;
