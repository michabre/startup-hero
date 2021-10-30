import React, { useEffect, useCallback } from "react";
import Axios from "axios";

import BuildNftList from "./Merge/BuildNftList";

const MergeMaster = ({
  configuration,
  setSuccessLevel,
  nftData,
  setNftData,
  nftCollection,
}) => {
  //console.log("nftData", nftData);

  // const getNftData = (collection) => {
  //   const axiosRequest = collection.map((item) => {
  //     return Axios.get(item);
  //   });

  //   Axios.all(axiosRequest)
  //     .then(
  //       Axios.spread((...responses) => {
  //         setNftData(responses);
  //       })
  //     )
  //     .catch((errors) => {
  //       // react on errors.
  //     });
  // };

  // getNftData(nftCollection);

  // const combineAttributes = (arr) => {
  //   let size = arr.length;
  //   let artistTotal = 0;
  //   let hackerTotal = 0;
  //   let hustlerTotal = 0;
  //   let successTotal = size;

  //   arr.forEach((item, index) => {
  //     let data = item.data.attributes;
  //     artistTotal += data.artist;
  //     hackerTotal += data.hacker;
  //     hustlerTotal += data.hustler;
  //     successTotal += data.success;
  //   });

  //   return {
  //     artist: Math.round(artistTotal / size),
  //     hacker: Math.round(hackerTotal / size),
  //     hustler: Math.round(hustlerTotal / size),
  //     success: successTotal,
  //   };
  // };

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
            <ul>
              {/* {[nftData].map((item, index) => {
                return <li key={index}>{item}</li>;
              })} */}
              <BuildNftList data={nftData} />
            </ul>
          </div>

          {/* <button className="button" onClick={nftsCollected}>Get Collection</button> */}
        </div>
      </div>
      <div id="merge-characters" className="column"></div>
    </div>
  );
};

export default MergeMaster;
