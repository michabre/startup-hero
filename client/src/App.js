import React, { useState, useEffect } from "react";
import Axios from "axios";
import { fabric } from "fabric";

import StartupHeroCreator from "./contracts/StartupHeroCreator.json";

import getWeb3 from "./getWeb3";
import Config from "./config";
import { shuffle } from "./components/Character/shuffle";

import Loading from "./components/Loading/Loading";
import Header from "./components/Layout/Header";
import Hero from "./components/Layout/Hero";
import Trait from "./components/Traits/Trait";
import Character from "./components/Character/Character";
import Footer from "./components/Layout/Footer";

const configuration = Config("development");

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [message, setMessage] = useState("Let's get started!");
  const [artistLevel, setArtistLevel] = useState(5);
  const [hackerLevel, setHackerLevel] = useState(5);
  const [hustlerLevel, setHustlerLevel] = useState(5);
  const [characterName, setCharacterName] = useState("Bob");
  const [characterDescription, setCharacterDescription] = useState("");

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
      addImage(
        new fabric.Canvas("canvas", {
          height: 512,
          width: 512,
          backgroundColor: "pink",
        })
      );
    } catch (error) {
      setMessage(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  }, [setMessage, accounts, contract]);

  const addImage = (canvas) => {
    let face = "http://localhost:3000/img/face.png";
    let base = "http://localhost:3000/img/base.png";
    let hair = "http://localhost:3000/img/hair.png";

    fabric.Image.fromURL(base, function (img) {
      var img1 = img.scale(1).set({ left: 0, top: 0 });

      fabric.Image.fromURL(face, function (img) {
        var img2 = img.scale(1).set({ left: 0, top: 0 });

        fabric.Image.fromURL(hair, function (img) {
          var img3 = img.scale(1).set({ left: 0, top: 0 });

          canvas.add(new fabric.Group([img1, img2, img3], { left: 0, top: 0 }));
        });
      });
    });
  };

  const updateName = (e) => {
    setCharacterName(e.target.value);
  };

  const testingAxios = () => {
    let img = document.getElementById("canvas");
    let url = configuration.NFT_SERVER + "/nft/create";
    let bodyFormData = new FormData();

    bodyFormData.append("tid", Math.round(Math.random() * 10000));
    bodyFormData.append("name", characterName);
    bodyFormData.append("description", "Need to add a description");
    bodyFormData.append("image", "http://localhost:3000/img/temp/test.jpg");
    bodyFormData.append("artist", artistLevel);
    bodyFormData.append("hacker", hackerLevel);
    bodyFormData.append("hustler", hustlerLevel);
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

    //console.log(response);

    if (response.status === true) {
      testingAxios();
      setMessage("NFT Created. Transaction:");
    } else {
      setMessage("Something went wrong");
    }
  };

  const randomClickHandler = () => {
    setArtistLevel(Math.round(Math.random() * 10));
    setHackerLevel(Math.round(Math.random() * 10));
    setHustlerLevel(Math.round(Math.random() * 10));
  };

  const connectClickHandler = async () => {
    const response = await contract.methods?.admin().call({
      from: accounts[0],
    });
    console.log(response);
  };

  if (!web3) {
    return (
      <>
        <Hero />
        <Loading />
      </>
    );
  }
  return (
    <div className="App">
      <Header connect={connectClickHandler} />
      <Hero
        title="Startup Hero Creator"
        subtitle="Generate a software developer NFT based on the traits of a startup."
      />

      <div className="notification is-info is-size-4 py-2 has-text-centered">
        <div className="container">{message}</div>
      </div>

      <section className="container px-3 py-5">
        <div className="columns mt-0">
          <div className="column is-one-quarter">
            <h3 className="title">Create Your Hero</h3>

            <div className="traits is-shady">
              <div className="field">
                <label className="label">Name</label>
                <input
                  className="input"
                  type="text"
                  placeholder={characterName}
                  onChange={updateName.bind(this)}
                />
              </div>

              <div className="field">
                <label className="label">Define Characteristics</label>
              </div>

              <Trait
                title="Creative"
                subtitle=""
                level={artistLevel}
                update={({ x }) => setArtistLevel(x)}
              />

              <Trait
                title="Technical"
                subtitle=""
                level={hackerLevel}
                update={({ x }) => setHackerLevel(x)}
              />

              <Trait
                title="Marketing"
                subtitle=""
                level={hustlerLevel}
                update={({ x }) => setHustlerLevel(x)}
              />

              <div className="has-text-centered mb-4">
                Current Total
                <span className="tag is-dark is-large ml-3">
                  {artistLevel + hackerLevel + hustlerLevel}
                </span>
              </div>
              <p className="is-size-6 has-text-centered is-italic">
                <b>Note</b>: needs to be <b>15</b> or less to Mint.
              </p>
            </div>
          </div>
          <div id="character" className="column">
            <Character
              name={characterName}
              description={characterDescription}
              descriptionHandler={({ x }) => setCharacterDescription(x)}
              artist={artistLevel}
              hacker={hackerLevel}
              hustler={hustlerLevel}
              random={randomClickHandler}
              mint={mintCanvas}
            />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default App;
