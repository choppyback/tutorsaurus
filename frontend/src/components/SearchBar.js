import { useState } from "react";
import axios from "axios";
import BASE_URL from "../api";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/search?module=${query}`);
      setResults(res.data);
      setHasSearched(true);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by module code"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {hasSearched &&
        (results.length > 0 ? (
          <ul>
            {results.map((tutor) => (
              <li key={tutor.user_id}>
                {tutor.name} ({tutor.modules_taught?.join(", ")})
              </li>
            ))}
          </ul>
        ) : (
          <p>No tutor found</p>
        ))}
    </div>
  );
}

export default SearchBar;
