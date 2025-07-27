import { TiPinOutline, TiPin } from "react-icons/ti";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import "../css/card.css";

const Card = ({ note, onPin, onDelete, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="card-header">
        <h3 className="title">{note.title}</h3>
        <button
          className={`pin-btn  ${note.pinned ? "pinned" : ""}`}
          disabled={!isHovered && !note.pinned}
          onClick={(e) => {
            e.stopPropagation();
            onPin();
          }}
        >
          {note.pinned ? <TiPin /> : <TiPinOutline />}
        </button>
      </div>
      <p className="date">{new Date(note.createdAt).toLocaleDateString()}</p>
      <p className="description">{note.description}</p>
      <button
        className={`dlt-btn`}
        disabled={!isHovered}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default Card;