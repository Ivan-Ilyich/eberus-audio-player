import { audio } from "./player.js";

const likedSongsContainer = document.querySelector(
  "[data-liked-song-container]"
);
const likedSongTemplate = document.querySelector("#liked__songs__template");
const unlikeSongButton = document.querySelector("[unlike__songs__button]");

const IMAGE_URL = "./tracks/thumbnails";
const AUDIO_URL = "./tracks/";

export const renderLikedSongs = (track, eventHandler) => {
  const date = new Date();
  const likedSongContainer = likedSongTemplate.content.cloneNode(true);

  const container = likedSongContainer.querySelector("[data-liked-song-id]");
  container.dataset.trackId = track.id;

  const trackNumber = likedSongContainer.querySelector(
    "[data-liked-song-number]"
  );
  const trackList = JSON.parse(localStorage.getItem("likedSongs"));
  const index = trackList.findIndex(tr => tr.id === track.id);
  trackNumber.innerText = index + 1;

  const image = likedSongContainer.querySelector("[data-liked-song-image]");
  image.src = `${IMAGE_URL}/${track.thumbnail}`;

  const trackName = likedSongContainer.querySelector(
    "[data-liked-song-track-name]"
  );
  trackName.innerText = `${track.title}`;

  const artistName = likedSongContainer.querySelector(
    "[data-liked-song-artist-name]"
  );
  artistName.innerText = `${track.artist}`;

  const albumName = likedSongContainer.querySelector(
    "[data-liked-song-album-name]"
  );
  albumName.innerText = `${track.artist}`;

  const dateAdded = likedSongContainer.querySelector(
    "[data-liked-song-date-added]"
  );
  dateAdded.innerText = `${date.getDay()} - ${date.getMonth()} - ${date.getFullYear()}`;

  const songDuration = likedSongContainer.querySelector(
    "[data-liked-song-duration]"
  );
  const duration = new Date(track?.duration * 1000).toISOString().substr(14, 5);
  songDuration.innerText = `${duration}`;

  likedSongContainer.addEventListener("click", eventHandler);
  likedSongsContainer.appendChild(likedSongContainer);
};
