import React from "react";
import { fabric } from "fabric";
import "./Character.css";

const Character = ({
  name,
  description,
  artist,
  hacker,
  hustler,
  mint,
  random,
  configuration,
  canvas,
  layer_1,
  layer_2,
  layer_3
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

    function addImage(char1, char2, char3) {

      // reset canvas
      canvas.clear();

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

    if(layer_1 && layer_2 && layer_3) {
      addImage(layer_1, layer_2, layer_3);
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
