import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import Item from "./Item";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);

  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    fetch(`https://dummyjson.com/products/search?q=${debouncedQuery}`)
      .then((response) => response.json())
      .then((json) => setData(debouncedQuery.length ? json.products || [] : []));
  }, [debouncedQuery]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div>
      <input
        type="text"
        value={query}
        placeholder="Search"
        onChange={(e) => setQuery(e.target.value)}
      />

      <ul className="item-list">
        {data.map((item) => (
          <Item key={item.id} data={item} />
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
