import React from "react";
import { shuffle } from "./helpers/shuffle";
import { selectedPersona } from "./Character/selectedPersona";
import { Artist, Hacker, Hustler } from "../data/characters";
import Trait from "./Traits/Trait";
import Character from "./Character/Character";


const Creator = ({
  updateName, 
  characterName, 
  artistLevel, 
  setArtistLevel,
  hackerLevel,
  setHackerLevel,
  hustlerLevel,
  setHustlerLevel,
  characterDescription,
  setCharacterDescription,
  updateDescription,
  setLayer_1,
  setLayer_2,
  setLayer_3,
  randomClickHandler,
  mintCanvas
}) => {
  return (
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
                update={({ x }) => {
                  setArtistLevel(x);

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
                }}
              />

              <Trait
                title="Technical"
                subtitle=""
                level={hackerLevel}
                update={({ x }) => {
                  setHackerLevel(x);

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
                }}
              />

              <Trait
                title="Marketing"
                subtitle=""
                level={hustlerLevel}
                update={({ x }) => {
                  setHustlerLevel(x);

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
                }}
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
              artist={artistLevel}
              hacker={hackerLevel}
              hustler={hustlerLevel}
              random={randomClickHandler}
              mint={mintCanvas}
            />
          </div>
        </div>
  );

};

export default Creator;