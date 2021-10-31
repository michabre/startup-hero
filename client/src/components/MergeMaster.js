import React, { useEffect, useCallback } from "react";
import Axios from "axios";

import BuildNftList from "./Merge/BuildNftList";
import NftCollection from "./Layout/NftCollection";

const MergeMaster = ({
  configuration,
  nftData,
  setNftData,
  nftCollection,
  selectedNfts,
  setSuccessLevel,
  cardClickHandler,
  mergeCharacters,
}) => {
  const getNftData = (collection) => {
    const axiosRequest = collection.map((item) => {
      return Axios.get(item);
    });

    Axios.all(axiosRequest)
      .then(
        Axios.spread((...responses) => {
          setNftData(responses);
        })
      )
      .catch((errors) => {
        // react on errors.
      });
  };

  getNftData(nftCollection);

  return (
    <div className="columns mt-0">
      <div className="column is-one-quarter">
        <h3 className="title">Merge Heroes</h3>

        <div className="traits is-shady">
          <div className="field">
            <label className="label">Name</label>
          </div>

          <div className="field">
            <label className="label">List of NFTs</label>
            <BuildNftList data={nftData} selected={selectedNfts} />
            <button className="button" onClick={mergeCharacters}>
              Merge Characters
            </button>
          </div>

          {/* <button className="button" onClick={nftsCollected}>Get Collection</button> */}
        </div>
      </div>
      <div id="merge-characters" className="column">
        <NftCollection data={nftData} cardClickHandler={cardClickHandler} />
      </div>
    </div>
  );
};

export default MergeMaster;
