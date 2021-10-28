import React, { useState, useEffect, useCallback } from "react";
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
import Header from "./components/Layout/Header";
import Hero from "./components/Layout/Hero";
import Footer from "./components/Layout/Footer";
import Creator from "./components/Creator";
import MergeMaster from "./components/MergeMaster";

const configuration = Config("development");

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [message, setMessage] = useState("Let's get started!");
  const [artistLevel, setArtistLevel] = useState(5);
  const [hackerLevel, setHackerLevel] = useState(5);
  const [hustlerLevel, setHustlerLevel] = useState(5);
  const [successLevel, setSuccessLevel] = useState(0);
  const [characterName, setCharacterName] = useState("Bob");
  const [characterDescription, setCharacterDescription] = useState(
    "Description missing."
  );

  const [layer_1, setLayer_1] = useState("");
  const [layer_2, setLayer_2] = useState("");
  const [layer_3, setLayer_3] = useState("");

  const canvas = useCallback(() => {
    return new fabric.Canvas("canvas", {
      height: 512,
      width: 512,
      backgroundColor: "pink",
    });
  }, []);

  let portrait = canvas();

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

    addImage(portrait, layer_1, layer_2, layer_3);
  }, [portrait, layer_1, layer_2, layer_3]);

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

      setWeb3(web3);
      setAccounts(accounts);
      setContract(instance);
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
  }, [artistLevel, hackerLevel, hustlerLevel]);

  const updateName = (e) => {
    setCharacterName(e.target.value);
  };

  const updateDescription = (character_1, character_2, character_3) => {
    let options = [character_1, character_2, character_3];

    return shuffle(options).toString().replace(/,/g, " ");
  };

  const sendToStorage = (tid, imgUrl) => {
    let img = document.getElementById("canvas");
    let url = configuration.NFT_SERVER + "/nft/create";
    let bodyFormData = new FormData();

    bodyFormData.append("tid", tid);
    bodyFormData.append("name", characterName);
    bodyFormData.append("description", characterDescription);
    bodyFormData.append("image", imgUrl);
    bodyFormData.append("artist", artistLevel);
    bodyFormData.append("hacker", hackerLevel);
    bodyFormData.append("hustler", hustlerLevel);
    bodyFormData.append("success", successLevel);
    bodyFormData.append("artwork", img.toDataURL());

    Axios({
      method: "post",
      url: url,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    }).then((response) => console.log(response.data));
  };

  const mintCanvas = async () => {
    const response = await contract.methods?.mint(accounts[0]).send({
      from: accounts[0],
    });

    if (response.status === true) {
      let nftMinted = response.events.NftMinted;
      let values = nftMinted.returnValues;
      sendToStorage(values[0], values[1]);
      setMessage(
        `NFT Minted. TxHash: ${nftMinted.transactionHash} <br /> <a href="${values[1]}" target="_blank">View JSON</a>`
      );
    } else {
      setMessage("Something went wrong");
    }
  };

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

  const connectClickHandler = async () => {
    const response = await contract.methods?.admin().call({
      from: accounts[0],
    });
    console.log(response);
  };

  const mergeNfts = () => {
    let requestOne = Axios.get(configuration.NFT_SERVER + "/nft/4");
    let requestTwo = Axios.get(configuration.NFT_SERVER + "/nft/2");
    let requestThree = Axios.get(configuration.NFT_SERVER + "/nft/12");

    Axios.all([requestOne, requestTwo, requestThree])
      .then(
        Axios.spread((...responses) => {
          let attrTotal = combineAttributes(responses);
          setSuccessLevel(attrTotal.success);

          console.log(attrTotal);
        })
      )
      .catch((errors) => {
        // react on errors.
      });
  };

  const combineAttributes = (arr) => {
    let size = arr.length;
    let artistTotal = 0;
    let hackerTotal = 0;
    let hustlerTotal = 0;
    let successTotal = size;

    arr.forEach((item, index) => {
      let data = item.data.attributes;
      artistTotal += data.artist;
      hackerTotal += data.hacker;
      hustlerTotal += data.hustler;
      successTotal += data.success;
    });

    return {
      artist: Math.round(artistTotal / size),
      hacker: Math.round(hackerTotal / size),
      hustler: Math.round(hustlerTotal / size),
      success: successTotal,
    };
  };

  if (!web3) {
    return (
      <>
        <Header connect={connectClickHandler} />
        <Hero
          title="Startup Hero Creator"
          subtitle="Generate a software developer NFT based on the traits of a startup."
        />
        <Loading />
        <Footer />
      </>
    );
  }
  return (
    <Router>
      <div className="App">
        <Header connect={connectClickHandler} merge={mergeNfts} />
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
                updateName={updateName}
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
            <Route path="/merge">
              <MergeMaster />
            </Route>
          </Switch>
        </section>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
