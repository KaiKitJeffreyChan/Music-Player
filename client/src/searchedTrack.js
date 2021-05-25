import React from "react";

export default function SearchedTrack({ track, selectedSong }) {
  function playSong() {
    selectedSong(track);
  }
  return (
    <div
      className="d-flex m-2 align-items-center"
      style={{ cursor: "pointer" }}
      onClick={playSong}
    >
      <img src={track.albumUrl} style={{ height: "4rem", widthm: "4rem" }} />
      <div style={{ marginLeft: "1rem" }}>
        <div> {track.title} </div>
        <div className="text-muted"> {track.artist} </div>
      </div>
    </div>
  );
}
