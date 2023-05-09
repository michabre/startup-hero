import React from "react";

const Loading = () => {
  return (
    <section className="container my-5">
      <div className="columns">
        <div className="column">
          <h4 className="title is-4 has-text-centered">
            Loading Web3, accounts, and contract...
          </h4>
          <progress className="progress is-small is-primary" max="100">
            15%
          </progress>
        </div>
      </div>
    </section>
  );
};

export default Loading;
