import React from "react";
import "./Character.css";

const Character = ({
  name,
  description,
  artist,
  hacker,
  hustler,
  mint,
  random,
}) => {
  function mintButton(handler) {
    let total = artist + hacker + hustler;
    let bool = total <= 15;
    if (bool === true) {
      return (
        <button
          className="card-footer-item button is-link mx-1"
          onClick={handler}
        >
          Mint
        </button>
      );
    } else {
      return (
        <button
          className="card-footer-item button is-link mx-1"
          onClick={handler}
          disabled
        >
          Mint
        </button>
      );
    }
  }

  return (
    <>
      <div className="columns">
        <div className="column character-design mx-3">
          <h3 className="title has-text-centered mb-2">{name}</h3>
          <canvas id="canvas" />
        </div>

        <div className="column is-one-third">
          <h3 className="title">Description</h3>
          <div className="card is-shady p-3">
            <p className="title is-4 is-italic has-text-centered">
              {description}
            </p>
          </div>
          <div className="buttons my-3">
            <button
              className="card-footer-item button is-danger mx-1"
              onClick={random}
            >
              Random
            </button>

            {mintButton(mint)}
          </div>
        </div>
      </div>
    </>
  );
};

export default Character;
