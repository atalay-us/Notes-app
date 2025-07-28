import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card.jsx";
import CreateBtn from "../components/CreateBtn.jsx";
import NoteForm from "../components/NoteForm.jsx";
import SearchBar from "../components/SearchBar.jsx";
import "../css/homepage.css";

const HomePage = ({ user }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const queryClient = useQueryClient();

  const { data: notes = [] } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/api/notes/get", {
        withCredentials: true,
      });
      return response.data.notes;
    },
  });

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter((note) => note.pinned);
  const unpinnedNotes = filteredNotes.filter((note) => !note.pinned);

  const deleteMutation = useMutation({
    mutationFn: async (noteId) => {
      await axios.delete(`http://localhost:3000/api/notes/delete/${noteId}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
    },
  });

  const pinMutation = useMutation({
    mutationFn: async (noteId) => {
      await axios.put(`http://localhost:3000/api/notes/pin-note/${noteId}`, {}, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
    },
  });

  const handleCardClick = (note) => {
    setSelectedNote(note);
    setShowForm(true);
  };

  return (
    <div className="homepage">
      {!user.isVerified ?
        <div className="nav-verify-overlay">
          <div className="nav-verify">
            <h2>User email is not verified. Please verify your e-mail.</h2>
            <p>To verify your email <Link to={"/verify-email"}> please click here.</Link></p>
          </div>
        </div>
        :
        <>
          <SearchBar searchvalue={searchValue} setSearchValue={setSearchValue} />
          <div className="notes-grid">
            <CreateBtn onClick={() => setShowForm(true)} />
            {unpinnedNotes.map((note) => (
              <Card
                key={note._id}
                note={note}
                onDelete={() => deleteMutation.mutate(note._id)}
                onPin={() => pinMutation.mutate(note._id)}
                onClick={() => handleCardClick(note)}
              />
            ))}
          </div>
          {pinnedNotes.length > 0 && (
            <>
              <h2>Pinned Notes</h2>
              <div className="notes-grid">
                {pinnedNotes.map((note) => (
                  <Card
                    key={note._id}
                    note={note}
                    onDelete={() => deleteMutation.mutate(note._id)}
                    onPin={() => pinMutation.mutate(note._id)}
                    onClick={() => handleCardClick(note)}
                  />
                ))}
              </div>
            </>
          )}
          {showForm && (
            <NoteForm
              note={selectedNote}
              onClose={() => {
                setShowForm(false);
                setSelectedNote(null);
              }}
            />
          )}</>}

    </div>
  );
};

export default HomePage;