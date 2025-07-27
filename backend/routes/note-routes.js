import express from "express";
import { createNote, updateNote, deleteNote, deleteAllNotes, getAllNotes, getNote, pinNote } from "../controller/note-controller.js";
import { verifyToken } from "../middleware/verify-token.js";


const router = express.Router();

router.get("/get", verifyToken, getAllNotes);

router.get("/get/:id", verifyToken, getNote);

router.post("/create", verifyToken, createNote);

router.post("/update/:id", verifyToken, updateNote);

router.put("/pin-note/:id",verifyToken,pinNote);

router.delete("/delete-all", verifyToken, deleteAllNotes);

router.delete("/delete/:id", verifyToken, deleteNote);

export default router;