import React from "react";
import loadingGif from "../../images/loading.gif";

function Loading() {
  return (
    <div id="loading-div">
      <img id="loading-image" src={loadingGif} alt="Loading..." />
    </div>
  );
}

export default Loading;
