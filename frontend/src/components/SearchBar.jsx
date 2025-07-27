import "../css/searchbar.css"

const SearchBar = ({searchvalue,setSearchValue}) => {
  return (
    <div className="search-bar">
      <input type="text" value={searchvalue} onChange={(e)=>setSearchValue(e.target.value)} placeholder="Search." />
    </div>
  )
}

export default SearchBar