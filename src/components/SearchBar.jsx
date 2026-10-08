import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import Item from "./Item";

const SearchBar = ({ pageSize = 5 }) => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);

  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    fetch(
      `https://dummyjson.com/products/search?q=${debouncedQuery}&limit=${pageSize}&skip=${offset}`,
      { signal },
    )
      .then((response) => response.json())
      .then((json) => setData(json.products || []))
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.log("Fetch Error: ", err);
        }
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery, offset]);

  return (
    <div style={{ marginTop: "20px" }}>
      <input
        className="search-input"
        type="text"
        value={query}
        placeholder="Search"
        onChange={(e) => {
          setOffset(0);
          setQuery(e.target.value);
        }}
      />

      <ul className="item-list">
        {data.map((item) => (
          <Item key={item.id} data={item} />
        ))}
        {data.length === 0 && <li>No results</li>}
      </ul>

      <div className="page-button-container">
        <button
          onClick={() => {
            setOffset(offset - pageSize);
          }}
          disabled={offset <= 0}
        >
          Prev
        </button>
        <button
          onClick={() => {
            setOffset(offset + pageSize);
          }}
          disabled={data.length < pageSize}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
