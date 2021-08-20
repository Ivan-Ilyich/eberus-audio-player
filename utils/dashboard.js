const generateTracks = tracks =>
  tracks.map(track => {
    return {
      ...track,
      id: uuidv4(),
      selected: false,
      isPlaying: false,
      paused: false,
      liked: false,
    };
  });

const fetchTracks = async () => {
  if (!localStorage.getItem("tracks")) {
    const response = await fetch("./tracks.json");
    const tracksList = await response.json();
    const tracks = generateTracks(tracksList);
    localStorage.setItem("tracks", JSON.stringify(tracks));
    return tracks;
  } else {
    const tracks = JSON.parse(localStorage.getItem("tracks"));
    return tracks;
  }
};

const tracks = await fetchTracks();

const trackContainerTemplate = document.querySelector(
  "#track__container__template"
);
const trackListContainer = document.querySelector("[data-tracks-container]");

const IMAGE_URL = "./tracks/thumbnails";

const renderTracks = track => {
  const trackContainer = trackContainerTemplate.content.cloneNode(true);

  const container = trackContainer.querySelector("[data-track-container]");
  container.dataset.trackId = track.id;

  const title = trackContainer.querySelector("[data-track-title]");
  title.innerText = `${track.title} - ${track.artist}`;

  const image = trackContainer.querySelector("[data-track-img]");
  image.src = `${IMAGE_URL}/${track.thumbnail}`;

  trackListContainer.appendChild(trackContainer);
};

export const setupTrackList = () => {
  tracks.forEach(renderTracks);
};
