import { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

export default function Player({ accessToken, trackUri }) {
  const [play, setPlay] = useState(false);
  useEffect(() => setPlay(true), [trackUri]);

  if (!accessToken) return null;
  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      //if there are songs, pass to array or empty
      uris={trackUri ? [trackUri] : []}
      play={play}
      callback={(state) => {
        if (!state.isPLaying) setPlay(false);
      }}
    />
  );
}
