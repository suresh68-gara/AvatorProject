import React from 'react';

const VideoPlayer = () => {
  return (
    <div>
      <video width="300" controls>
        <source src="/ramayanam.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoPlayer;
