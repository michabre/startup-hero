import React from "react";

const BuildNftList = ({ data, selected }) => {
  console.log(data);
  return (
    <ol>
      {selected.map((element, index) => (
        <li key={index}>{data[element].data.name}</li>
      ))}
    </ol>
  );
};

export default BuildNftList;
