import React, { useEffect } from "react";
import Axios from "axios";

import BuildNftList from "./Merge/BuildNftList";
import NftCollection from "./Layout/NftCollection";

const MergeMaster = ({
  nftData,
  setNftData,
  nftCollection,
  selectedNfts,
  cardClickHandler,
  mergeCharacters,
  burnHandler,
}) => {
  useEffect(() => {
    console.log("merge master updated");
  }, []);

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

  getNftData(nftCollection);

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
