import User from "../models/user-model.js";
import Note from "../models/note-model.js";

export const createNote = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." })
        }

        if (!title || !description) {
            return res.status(400).json({ error: "All fields are required" })
        }

        const newNote = new Note({
            title,
            description,
            user: userId
        });
        await newNote.save();

        res.status(201).json({
            message: "Note created successfuly.",
            note: newNote
        });
    } catch (error) {
        console.error("Error in create note", error);
        res.status(500).json({ error: "Internal server error." })
    }
}

export const updateNote = async (req, res) => {
    try {
        const noteId = req.params.id; // Changed from postId to noteId for clarity
        const userId = req.userId;
        const { title, description } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ error: "Note not found." });
        }

        if (note.user.toString() !== userId.toString()) {
            return res.status(403).json({ error: "You are not authorized to update this note" });
        }

        // Check if at least one field is provided and not an empty string
        if (!title && !description) {
            return res.status(400).json({ error: "At least one field (title or description) is required" });
        }

        // Update only provided fields, ignoring empty strings
        if (title && title.trim() !== "") note.title = title;
        if (description && description.trim() !== "") note.description = description;

        await note.save();

        res.status(200).json({
            message: "Note updated successfully.",
            note
        });
    } catch (error) {
        console.error("Error in update note", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const deleteNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." })
        }

        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ error: "Note not found." })
        }

        if (note.user.toString() != userId.toString()) {
            return res.status(403).json({ error: "You are not authorized to delete this note" });
        }

        await Note.findByIdAndDelete(noteId);
        res.status(204).json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error("Error in delete note", error);
        res.status(500).json({ error: "Internal server error." })
    }
}

export const deleteAllNotes = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." })
        }

        await Note.deleteMany({ user: userId });
        res.status(204).json({ message: "Your notes deleted succesfuly" });
    } catch (error) {
        console.error("Error in delete all notes", error);
        res.status(500).json({ error: "Internal server error." })
    }
}

export const getAllNotes = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." })
        }

        const userNotes = await Note.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate({ path: "user", select: "username email" });

        if (userNotes.length === 0) {
            return res.status(200).json({ message: "No note found", notes: [] });
        }

        res.status(200).json({ message: "Notes fetched successfuly", notes: userNotes });
    } catch (error) {
        console.error("Error in get notes", error);
        res.status(500).json({ error: "Internal server error." })
    }
}

export const getNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const note = await Note.findById(noteId).populate({ path: "user", select: "username email" });
        if (!note) {
            return res.status(404).json({ error: "Note not found." });
        }

        if (note.user._id.toString() !== userId.toString()) {
            return res.status(403).json({ error: "You are not authorized to view this note" });
        }

        res.status(200).json({ message: "Note fetched successfully", note });
    } catch (error) {
        console.error("Error in fetching specific note:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const pinNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const note = await Note.findById(noteId).populate({ path: "user", select: "username email" });
        if (!note) {
            return res.status(404).json({ error: "Note not found." });
        }

        if (note.user._id.toString() !== userId.toString()) {
            return res.status(403).json({ error: "You are not authorized to pin this note" });
        }

        note.pinned = !note.pinned;
        await note.save();

        res.status(200).json({ message: "Note pinned/unpinned successfully" });
    } catch (error) {
        console.error("Error in pinning specific note:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}