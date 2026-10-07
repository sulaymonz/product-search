import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import Item from "./Item";

const SearchBar = ({ size = 5 }) => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [skip, setSkip] = useState(0);

  const debouncedQuery = useDebounce(query);

  const handleSearch = (skipCount = 0) => {
    fetch(
      `https://dummyjson.com/products/search?q=${debouncedQuery}&limit=${size}&skip=${skipCount}`,
    )
      .then((response) => response.json())
      .then((json) => setData(json.products || []));
  };

  useEffect(() => {
    handleSearch();
  }, [debouncedQuery]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div style={{ marginTop: "20px" }}>
      <input
        className="search-input"
        type="text"
        value={query}
        placeholder="Search"
        onChange={(e) => {
          setSkip(0);
          setQuery(e.target.value);
        }}
      />

      <ul className="item-list">
        {data.map((item) => (
          <Item key={item.id} data={item} />
        ))}
      </ul>

      <div className="page-button-container">
        <button
          onClick={() => {
            const newSkip = skip - size;
            setSkip(newSkip);
            handleSearch(newSkip);
          }}
          disabled={skip <= 0}
        >
          Prev
        </button>
        <button
          onClick={() => {
            const newSkip = skip + size;
            setSkip(newSkip);
            handleSearch(newSkip);
          }}
          disabled={data.length < size}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
