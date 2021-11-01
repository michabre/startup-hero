import React from "react";
import "./NftCollection.css";

const NftCollection = ({ data, cardClickHandler }) => {
  return (
    <div className="columns is-multiline">
      {data.map((element, index) => (
        <div key={element.data.id} className="column is-one-third">
          <div className="card">
            <div
              className="selector"
              data-tid={element.data.tid}
              data-index={index}
              onClick={cardClickHandler}
            ></div>
            <div className="card-image">
              <figure className="image is-1by1">
                <img src={element.data.image} alt={element.data.name} />
              </figure>
            </div>
            <div className="card-content pb-0">
              <div className="content ">
                <h3>{element.data.name}</h3>
              </div>
            </div>
            <footer className="px-3 pb-3">
              <div className="columns mb-0">
                <div className="column has-text-centered">
                  <p className="label">Creative</p>
                  <span className="tag is-large is-info">
                    {element.data.attributes.artist}
                  </span>
                </div>
                <div className="column has-text-centered">
                  <p className="label">Technical</p>
                  <span className="tag is-large is-success">
                    {element.data.attributes.hacker}
                  </span>
                </div>
                <div className="column has-text-centered">
                  <p className="label">Marketing</p>
                  <span className="tag is-large is-warning">
                    {element.data.attributes.hustler}
                  </span>
                </div>
              </div>
              <label>Success</label>
              <progress
                className="progress"
                value={element.data.attributes.success}
                max="100"
              >
                15%
              </progress>
            </footer>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NftCollection;
