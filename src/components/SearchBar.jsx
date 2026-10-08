import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import Item from "./Item";

const SearchBar = ({ pageSize = 5 }) => {
  const [query, setQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    setLoading(true);
    setError(null);

    fetch(
      `https://dummyjson.com/products/search?q=${debouncedQuery}&limit=${pageSize}&skip=${offset}&select=title,description,thumbnail`,
      { signal },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        } else {
          return response.json();
        }
      })
      .then((json) => {
        setLoading(false);
        setData(json.products || []);
        setTotal(json.total);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.log("Fetch Error: ", err);
          setLoading(false);
          setError(err.message);
        }
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery, pageSize, offset]);

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

      <div style={{ minHeight: "30px" }}>
        <div>{loading && "Loading..."}</div>
        <div>{error && "Something went wrong."}</div>
      </div>

      <div style={{ fontSize: ".75rem" }}>Total: {total}</div>

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
          disabled={total - offset <= pageSize}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
