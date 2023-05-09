import React from "react";

/**
 * Build a list of selected NFTs to be merged
 *
 * @param {object} data
 * @param {object} selected
 * @returns {string} HTMLElementDiv of Selected items
 */
const BuildNftList = ({ data, selected }) => {
  return (
    <div className="mb-3">
      {selected.map((element, index) => (
        <p key={index} className="my-3 is-size-4 is-flex is-align-items-center">
          <span className="tag is-dark is-normal mr-3">{index + 1}</span>{" "}
          <span className="has-text-weight-bold">
            {data[element]?.data.name}
          </span>
        </p>
      ))}
    </div>
  );
};

export default BuildNftList;
