import { useState, useEffect } from "react";
import Item from "./Item";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`https://dummyjson.com/products/search?q=${query}`)
      .then((response) => response.json())
      .then((json) => setData(query.length ? json.products || [] : []));
  }, [query]);

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
