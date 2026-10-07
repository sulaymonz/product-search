const Item = ({ data }) => {
  return (
    <li className="item">
      <span style={{ fontSize: ".75rem", minWidth: "50px" }}>Id: {data.id}</span>
      <img src={data.images[0]} width="90px" height="90px" />
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "start",
          textAlign: "left",
        }}
      >
        <span>
          <strong>{data.title}</strong>
        </span>
        <span>{data.description}</span>
      </span>
    </li>
  );
};

export default Item;
