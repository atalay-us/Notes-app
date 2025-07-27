import { LuSquarePlus } from "react-icons/lu";

import "../css/createbtn.css"

const CreateBtn = ({ onClick }) => {
  return (
    <div className='create-btn' onClick={onClick}>
      <h3>Create</h3>
      <LuSquarePlus />
    </div>
  )
}

export default CreateBtn