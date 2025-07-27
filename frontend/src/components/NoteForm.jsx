import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import "../css/noteform.css";

const NoteForm = ({ note, onClose }) => {
  const noteTitle = note ? note.title : "";
  const noteDescription = note ? note.description : "";
  const [noteInfo, setNoteInfo] = useState({ title: noteTitle, description: noteDescription });
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (noteData) => {
      await axios.post(`http://localhost:3000/api/notes/update/${note._id}`, noteData, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
      onClose();
    },
    onError: (err) => {
      alert(err.response?.data?.error || "Update failed. Server error.");
    },
  });

  const createMutation = useMutation({
    mutationFn: async (noteData) => {
      await axios.post("http://localhost:3000/api/notes/create", noteData, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
      onClose();
    },
    onError: (err) => {
      alert(err.response?.data?.error || "Update failed. Server error.");
    },
  });

  const handleChange = (e) => {
    setNoteInfo({ ...noteInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (note) {
      updateMutation.mutate(noteInfo);
    } else {
      createMutation.mutate(noteInfo);
    }
  };

  return (
    <div className="note-form-overlay">
      <form className="note-form" onSubmit={handleSubmit}>
        <h3>Note Form</h3>
        <div className="note-form-group">
          <label>Title</label>
          <input type="text" name="title" value={noteInfo.title} onChange={handleChange} />
        </div>
        <div className="note-form-group">
          <label>Description</label>
          <input type="text" name="description" value={noteInfo.description} onChange={handleChange} />
        </div>
        <div className="note-form-actions">
          <button type="submit">{note ? "Update" : "Create"}</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;