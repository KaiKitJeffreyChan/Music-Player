import { useState, useEffect } from "react";
import SearchedTrack from "./searchedTrack";
import handleAuth from "./handleAuth";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import Player from "./Player";
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
  clientId: "cbbba8088608435ea8355a50a5b736cb",
});

export default function Dashboard({ code }) {
  const accessToken = handleAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentSong, setCurrentSong] = useState();
  const [lyrics, setLyrics] = useState("");

  function selectedSong(track) {
    setCurrentSong(track);
    setSearch("");
    setLyrics("");
  }
  useEffect(() => {
    if (!currentSong) return;
    axios
      .get("http://localhost:3001/lyrics", {
        params: {
          track: currentSong.title,
          artist: currentSong.artist,
        },
      })
      .then((res) => {
        setLyrics(res.data.lyrics);
      });
  }, [currentSong]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    //let cancel = false;

    spotifyApi.searchTracks(search).then((res) => {
      // if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          //find smallest image
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });

    // return () => (cancel = true); try without this
  }, [search, accessToken]);

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <Form.Control
        type="search"
        placeholder="Search Songs or Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {searchResults.map((track) => (
          <SearchedTrack
            track={track}
            key={track.uri}
            selectedSong={selectedSong}
          />
        ))}
        {searchResults.length === 0 && (
          <div className="text-center" style={{ whiteSpace: "pre" }}>
            {lyrics}
          </div>
        )}
      </div>
      <div>
        <Player accessToken={accessToken} trackUri={currentSong?.uri} />
      </div>
    </Container>
  );
}
