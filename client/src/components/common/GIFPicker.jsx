import React from "react";
import GifPicker from "gif-picker-react";

const tenorApiKey = import.meta.env.VITE_TENOR_API_KEY;

function GIFPicker({ handleOnGifClick }) {
  const onGifClick = (gif) => {
    handleOnGifClick(gif);
  };

  return (
    <>
      <GifPicker
        tenorApiKey={tenorApiKey}
        width={342}
        height={400}
        onGifClick={onGifClick}
      />
    </>
  );
}

export default GIFPicker;
