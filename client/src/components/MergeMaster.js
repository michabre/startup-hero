import React, { useEffect } from "react";
import Axios from "axios";

import BuildNftList from "./Merge/BuildNftList";
import NftCollection from "./Layout/NftCollection";

const MergeMaster = ({
  nftData,
  setNftData,
  nftTids,
  nftCollection,
  selectedNfts,
  cardClickHandler,
  mergeCharacters,
  burnHandler,
  burnSelection,
  setBurnSelection,
}) => {
  const mergeButton = (handler, nfts) => {
    if (nfts.length > 0) {
      return (
        <button
          className="button is-info is-large is-fullwidth"
          onClick={handler}
        >
          Merge Characters
        </button>
      );
    }
    return;
  };

  return (
    <div className="columns mt-0">
      <div className="column is-one-quarter">
        <h3 className="title">Merge Heroes</h3>

        <div className="traits is-shady">
          <div className="field">
            <label className="label">Select 2 NFTs to Merge</label>
            <BuildNftList data={nftData} selected={selectedNfts} />
            {mergeButton(mergeCharacters, selectedNfts)}
          </div>
          <div className="field">
            <label className="label">Burn Test</label>
            <div className="select mb-3 is-fullwidth">
              <select onChange={(e) => setBurnSelection(e.target.value)}>
                <option value="none">Select Character to Burn</option>
                {nftData.map((item, index) => (
                  <option key={index} value={index}>
                    {item.data.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="button is-danger is-fullwidth"
              onClick={burnHandler}
            >
              Burn
            </button>
          </div>
        </div>
      </div>
      <div id="merge-characters" className="column">
        <NftCollection data={nftData} cardClickHandler={cardClickHandler} />
      </div>
    </div>
  );
};

export default MergeMaster;
