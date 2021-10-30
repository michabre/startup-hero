import React from "react";

const BuildNftList = ({ data }) => {
  console.log(data);
  return (
    <ol>
      {data.map((element) => (
        <li key={element.data.id}>
          <div data-tid={element.data.tid}>
            <img src={element.data.image} alt={element.data.name} />
            {element.data.name}
          </div>
        </li>
      ))}
    </ol>
  );
};

export default BuildNftList;
