import Axios from "axios";
/**
   * Sends Character Data to the NFT Storage Facility
   *
   * @param {number} tid
   * @param {string} imgName
   */
 const sendToStorage = (
   url,
   id, 
   tid, 
   characterName,
   characterDescription,
   imgName,
   artistLevel,
   hackerLevel,
   hustlerLevel,
   successLevel,
   burnBonus
  ) => {
  let img = document.getElementById("canvas");
  let bodyFormData = new FormData();
  let artwork = img.toDataURL();

  bodyFormData.append("id", id);
  bodyFormData.append("tid", tid);
  bodyFormData.append("name", characterName);
  bodyFormData.append("description", characterDescription);
  bodyFormData.append("image", imgName);
  bodyFormData.append("artist", artistLevel + parseInt(burnBonus.artist));
  bodyFormData.append("hacker", hackerLevel + parseInt(burnBonus.hacker));
  bodyFormData.append("hustler", hustlerLevel + parseInt(burnBonus.hustler));
  bodyFormData.append("success", successLevel + parseInt(burnBonus.success));
  bodyFormData.append("artwork", artwork);

  Axios({
    method: "post",
    url: url,
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  }).then((response) => {
    console.log(response);
    // Axios.get(configuration.NFT_SERVER + "/nft/collection").then(function (
    //   response
    // ) {
      // const tids = response.data?.tids;
      // setNftIds(tids);
      // setNftCount(tids.length);
      // updateNftData(tids);
    //   console.log(response);
    // });
  });
};

export {sendToStorage};