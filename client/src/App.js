import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Axios from "axios";
import parse from "html-react-parser";
import { fabric } from "fabric";
import StartupHeroCreator from "./contracts/StartupHeroCreator.json";
import getWeb3 from "./getWeb3";
import Config from "./config";

import { shuffle } from "./components/helpers/shuffle";
import { selectedPersona } from "./components/Character/selectedPersona";
import { Artist, Hacker, Hustler } from "./data/characters";

import Loading from "./components/Loading/Loading";
import Header from "./components/Layout/Header/Header";
import Hero from "./components/Layout/Hero";
import Footer from "./components/Layout/Footer";

// Startup Hero Components
import Creator from "./components/Creator";
import MergeMaster from "./components/MergeMaster";
import Marketplace from "./components/StartupHero/Shop/Marketplace";

const configuration = Config("development");

// for testing useEffect hook
let count = 0;

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [connected, setConnected] = useState("No account connected");

  const [nftCount, setNftCount] = useState(0);
  const [nftData, setNftData] = useState([]);
  const [nftCollection, setNftCollection] = useState([]);
  const [selectedNfts, setSelectedNfts] = useState([]);
  const [nftIds, setNftIds] = useState([]);

  const [burnSelection, setBurnSelection] = useState("none");
  const [burnBonus, setBurnBonus] = useState({
    artist: 0,
    hacker: 0,
    hustler: 0,
    success: 0,
  });

  const [message, setMessage] = useState("Let's get started!");
  const [artistLevel, setArtistLevel] = useState(5);
  const [hackerLevel, setHackerLevel] = useState(5);
  const [hustlerLevel, setHustlerLevel] = useState(5);
  const [successLevel, setSuccessLevel] = useState(0);
  const [characterName, setCharacterName] = useState("Bob");
  const [characterDescription, setCharacterDescription] = useState(
    "Description missing."
  );

  const [layer_1, setLayer_1] = useState("classical-artist_clothing.png");
  const [layer_2, setLayer_2] = useState("classical-artist_face.png");
  const [layer_3, setLayer_3] = useState("classical-artist_hair.png");

  const canvas = () => {
    return new fabric.Canvas("canvas", {
      height: 512,
      width: 512,
      backgroundColor: "#142C44",
    });
  };

  useEffect(() => {
    function addImage(canvas, char1, char2, char3) {
      fabric.Image.fromURL(
        configuration.IMAGES + "character-base.png",
        function (img) {
          let base = img.scale(1).set({ left: 0, top: 0 });

          fabric.Image.fromURL(configuration.IMAGES + char1, function (img) {
            let img1 = img.scale(1).set({ left: 0, top: 0 });

            fabric.Image.fromURL(configuration.IMAGES + char2, function (img) {
              let img2 = img.scale(1).set({ left: 0, top: 0 });

              fabric.Image.fromURL(
                configuration.IMAGES + char3,
                function (img) {
                  let img3 = img.scale(1).set({ left: 0, top: 0 });
                  canvas.add(
                    new fabric.Group([base, img1, img2, img3], {
                      left: 0,
                      top: 0,
                    })
                  );
                }
              );
            });
          });
        }
      );
    }

    let portrait = canvas();
    addImage(portrait, layer_1, layer_2, layer_3);

    console.log("useEffect called", count++); // testing useEffect hook
  }, [canvas, layer_1, layer_2, layer_3]);

  useEffect(() => {
    async function fetchData() {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = StartupHeroCreator.networks[networkId];
      const instance = new web3.eth.Contract(
        StartupHeroCreator.abi,
        deployedNetwork && deployedNetwork.address
      );

      const storedAttributes = await instance.methods?.getAttributes().call({
        from: accounts[0],
      });

      setWeb3(web3);
      setAccounts(accounts);
      setContract(instance);
      setConnected(accounts[0]);

      setBurnBonus({
        artist: storedAttributes.artist,
        hacker: storedAttributes.hacker,
        hustler: storedAttributes.hustler,
        success: storedAttributes.success,
      });

      Axios.get(configuration.NFT_SERVER + "/nft/collection").then(function (
        response
      ) {
        const tids = response.data?.tids;
        setNftIds(tids);
        setNftCount(tids.length);
      });
    }

    try {
      //
      fetchData();
      //
      setCharacterDescription(
        updateDescription(
          Artist[selectedPersona(artistLevel)].description,
          Hacker[selectedPersona(hackerLevel)].description,
          Hustler[selectedPersona(hustlerLevel)].description
        )
      );
    } catch (error) {
      setMessage(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  }, [artistLevel, hackerLevel, hustlerLevel, nftIds]);

  const updateDescription = (character_1, character_2, character_3) => {
    let options = [character_1, character_2, character_3];
    return shuffle(options).toString().replace(/,/g, " ");
  };

  /**
   * Sends Character Data to the NFT Storage Facility
   *
   * @param {number} tid
   * @param {string} imgName
   */
  const sendToStorage = (tid, imgName) => {
    let img = document.getElementById("canvas");
    let url = configuration.NFT_SERVER + "/nft/create";
    let bodyFormData = new FormData();
    let artwork = img.toDataURL();

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
      console.log(response.data);
      Axios.get(configuration.NFT_SERVER + "/nft/collection").then(function (
        response
      ) {
        const tids = response.data?.tids;
        setNftIds(tids);
        setNftCount(tids.length);
        updateNftData(tids);
      });
    });
  };

  /**
   * Mint Created Character as an NFT
   */
  const mintCanvas = async () => {
    const response = await contract.methods.mint(accounts[0]).send({
      from: accounts[0],
    });

    if (response.status === true) {
      let nftMinted = response.events.NftMinted;
      let values = nftMinted.returnValues;
      let img = "startuphero_" + nftMinted.transactionHash + ".png";

      sendToStorage(values[0], img);
      setMessage(
        `NFT Minted. TxHash: ${nftMinted.transactionHash} <br /> <a href="${values[1]}" target="_blank">View JSON</a>`
      );
    } else {
      setMessage("Something went wrong");
    }
  };

  /**
   * Randomly Create a Startup Hero
   */
  const randomClickHandler = () => {
    setArtistLevel(Math.round(Math.random() * 10));
    setHackerLevel(Math.round(Math.random() * 10));
    setHustlerLevel(Math.round(Math.random() * 10));

    let artist = Artist[selectedPersona(artistLevel)];
    let hacker = Hacker[selectedPersona(hackerLevel)];
    let hustler = Hustler[selectedPersona(hustlerLevel)];

    setCharacterDescription(
      updateDescription(
        artist.description,
        hacker.description,
        hustler.description
      )
    );

    let characters = shuffle([artist, hacker, hustler]);

    setLayer_1(characters[0].clothing); // clothing
    setLayer_2(characters[1].face); // face
    setLayer_3(characters[2].hair); // hair
  };

  /**
   * Needed to update the NFT data for the Collection view
   * Will need to rework. Shouldn't be necessary.
   */
  const connectClickHandler = async () => {
    updateNftData(nftIds);
  };

  /**
   * Update NFT Data
   */
  const updateNftData = async (ids) => {
    let count = ids.length;
    let collection = [];
    for (let index = 0; index < count; index++) {
      let nftUri = await contract.methods?.tokenURI(ids[index]).call({
        from: connected,
      });
      collection.push(nftUri);
    }
    if (count > 0) {
      setNftCollection(collection);
      getNftData(collection);
    }
  };

  /**
   * Request NFT Data from the NFT Storage Facility
   */
  const getNftData = (collection) => {
    const axiosRequest = collection.map((item) => {
      return Axios.get(item);
    });

    const data = Axios.all(axiosRequest)
      .then(
        Axios.spread((...responses) => {
          setNftData(responses);
        })
      )
      .catch((errors) => {
        // react on errors.
      });
    return data;
  };

  const cardClickHandler = (e) => {
    let item = e.target;
    let nft = item.getAttribute("data-index");
    if (selectedNfts.includes(nft)) {
      return;
    } else {
      removeExtraElements(selectedNfts, 1);
      setSelectedNfts([...selectedNfts, nft]);
    }
  };

  const removeExtraElements = (arr, max) => {
    while (arr.length > max) {
      arr.shift();
    }
  };

  const mergeCharacters = async () => {
    let random = Math.round(Math.random() * 1);
    let randomlyChosenDefault = selectedNfts[random];
    let attributes = selectedNfts.map((element) => {
      return nftData[element].data.attributes;
    });
    let newAttributes = combineAttributes(attributes);
    const response = await contract.methods?.mint(accounts[0]).send({
      from: accounts[0],
    });

    if (response.status === true) {
      let nftMinted = response.events.NftMinted;
      let values = nftMinted.returnValues;

      let url = configuration.NFT_SERVER + "/nft/merge";
      let bodyFormData = new FormData();

      bodyFormData.append("tid", values[0]);
      bodyFormData.append(
        "name",
        `${nftData[selectedNfts[0]].data.name} ${
          nftData[selectedNfts[1]].data.name
        }`
      );
      bodyFormData.append(
        "description",
        nftData[randomlyChosenDefault].data.description
      );
      bodyFormData.append("image", nftData[randomlyChosenDefault].data.image);
      bodyFormData.append("artist", newAttributes.artist);
      bodyFormData.append("hacker", newAttributes.hacker);
      bodyFormData.append("hustler", newAttributes.hustler);
      bodyFormData.append("success", newAttributes.success);
      bodyFormData.append("artwork", "No artwork");

      Axios({
        method: "post",
        url: url,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then((response) => {
        console.log(response.data);

        Axios.get(configuration.NFT_SERVER + "/nft/collection").then(function (
          response
        ) {
          const tids = response.data?.tids;
          setNftIds(tids);
          setNftCount(tids.length);
          updateNftData(tids);
        });
      });
      setMessage(
        `NFT Minted. TxHash: ${nftMinted.transactionHash} <br /> <a href="${values[1]}" target="_blank">View JSON</a>`
      );
    } else {
      setMessage("Something went wrong");
    }
  };

  const combineAttributes = (arr) => {
    let size = arr.length;
    let artistTotal = 0;
    let hackerTotal = 0;
    let hustlerTotal = 0;
    let successTotal = 1;

    arr.forEach((item) => {
      artistTotal += item.artist;
      hackerTotal += item.hacker;
      hustlerTotal += item.hustler;
      successTotal += item.success;
    });

    return {
      artist: Math.round(artistTotal / size),
      hacker: Math.round(hackerTotal / size),
      hustler: Math.round(hustlerTotal / size),
      success: successTotal,
    };
  };

  const burnHandler = async () => {
    if (burnSelection !== "none") {
      const data = nftData[burnSelection].data;
      const attributes = data.attributes;
      const tid = data.tid;
      const response = await contract.methods
        ?.burn(
          tid,
          attributes.artist,
          attributes.hacker,
          attributes.hustler,
          attributes.success
        )
        .send({
          from: accounts[0],
        });
      console.log(response);

      if (response.status === true) {
        let url = configuration.NFT_SERVER + "/nft/delete";
        let bodyFormData = new FormData();
        bodyFormData.append("tid", tid);
        Axios({
          method: "post",
          url: url,
          data: bodyFormData,
          headers: { "Content-Type": "multipart/form-data" },
        }).then((response) => {
          console.log(response.data);

          Axios.get(configuration.NFT_SERVER + "/nft/collection").then(
            function (response) {
              console.log(response);
              const tids = response.data?.tids;
              setNftIds(tids);
              setNftCount(tids.length);
              updateNftData(tids);
            }
          );
        });
      }
    }
  };

  if (!web3) {
    return (
      <div className="App">
        <Header
          connect={connectClickHandler}
          nftCount={nftCount}
          connected={connected}
        />
        <Hero
          title="Startup Hero Creator"
          subtitle="Generate a software developer NFT based on the traits of a startup."
        />
        <Loading />
        <Footer />
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Header
          connect={connectClickHandler}
          homeLink={<Link to="/">Create</Link>}
          mergeLink={<Link to="/collection">View Collection</Link>}
          shopLink={<Link to="/marketplace">Shop</Link>}
          nftCount={nftCount}
          connected={connected}
        />
        <Hero
          title="Startup Hero Creator"
          subtitle="Generate a software developer NFT based on the traits of a startup."
        />

        <div className="notification is-info is-size-4 py-2 has-text-centered">
          <div className="container">{parse(message)}</div>
        </div>

        <section className="container px-3 py-5">
          <Switch>
            <Route exact path="/">
              <Creator
                updateName={(e) => {
                  setCharacterName(e.target.value);
                }}
                characterName={characterName}
                artistLevel={artistLevel}
                setArtistLevel={setArtistLevel}
                hackerLevel={hackerLevel}
                setHackerLevel={setHackerLevel}
                hustlerLevel={hustlerLevel}
                setHustlerLevel={setHustlerLevel}
                characterDescription={characterDescription}
                setCharacterDescription={setCharacterDescription}
                updateDescription={updateDescription}
                setLayer_1={setLayer_1}
                setLayer_2={setLayer_2}
                setLayer_3={setLayer_3}
                randomClickHandler={randomClickHandler}
                mintCanvas={mintCanvas}
              />
            </Route>
            <Route path="/collection">
              <MergeMaster
                configuration={configuration}
                nftData={nftData}
                nftTids={nftIds}
                nftCollection={nftCollection}
                selectedNfts={selectedNfts}
                setSuccessLevel={setSuccessLevel}
                cardClickHandler={cardClickHandler}
                mergeCharacters={mergeCharacters}
                burnHandler={burnHandler}
                burnSelection={burnSelection}
                setBurnSelection={setBurnSelection}
              />
            </Route>
            <Route path="/marketplace">
              <Marketplace title="The Marketplace" />
            </Route>
          </Switch>
        </section>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
