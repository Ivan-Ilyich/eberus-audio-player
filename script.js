import { setupTrackList } from "./utils/dashboard.js";
import { renderLikedSongs } from "./utils/likedSongs.js";
const elements = await import("./utils/selectElements.js");

const audio = new Audio();
setupTrackList();
audio.volume = 0.5;

const AUDIO_URL = "./tracks/";
const IMAGE_URL = "./tracks/thumbnails";

let likedSongs = [];
let selectedTrack = [];

const {
  homepageButton,
  likedSongsButton,
  homePageContainer,
  likedSongsContainer,
  likedTracksContainer,
  likedSongContainer,
  currentPlayingTrackDetails,
  playerImageContainer,
  currentTimePointer,
  currentTimeDisplay,
  trackDurationDisplay,
  skipToNextButton,
  skipToPrevButton,
  playPauseMainButton,
  repeatButton,
  shuffleButton,
  playPauseLikedContainer,
  seekControlContainer,
  volumePointer,
  volumeControlContainer,
  muteButton,
} = elements;

let tracks = JSON.parse(localStorage.getItem("tracks"));

const trackContainer = Array.from(
  document.querySelectorAll("[data-track-container]")
);
let likedTrackContainer = Array.from(
  document.querySelectorAll("[data-liked-song-id]")
);

// If likedSongs array isn't empty, render liked songs
if (!JSON.parse(localStorage.getItem("likedSongs"))) {
  localStorage.setItem("likedSongs", JSON.stringify([]));
} else {
  const existingLikedSongs = JSON.parse(localStorage.getItem("likedSongs"));
  likedSongs = existingLikedSongs;
  likedSongs.forEach(song => {
    renderLikedSongs(song);
  });
}

const togglePlayPauseMainButton = isPlaying => {
  if (!isPlaying) {
    playPauseMainButton.classList.remove("bi-play-circle-fill");
    playPauseMainButton.classList.add("bi-pause-circle-fill");
  }
  if (isPlaying) {
    playPauseMainButton.classList.add("bi-play-circle-fill");
    playPauseMainButton.classList.remove("bi-pause-circle-fill");
  }
};

const togglePlayPauseTrackContainerBtn = (isPlaying, targetElement) => {
  if (isPlaying) {
    targetElement.classList.remove("bi-pause-circle");
    targetElement.classList.add("bi-play-circle");
  }
  if (!isPlaying) {
    targetElement.classList.remove("bi-play-circle");
    targetElement.classList.add("bi-pause-circle");
  }
};

const updateLocalStorage = updatedTrackList => {
  localStorage.setItem("tracks", JSON.stringify(updatedTrackList));
  tracks = JSON.parse(localStorage.getItem("tracks"));

  const updatedLikedTracks = updatedTrackList.filter(tr => tr.liked);
  localStorage.setItem("likedSongs", JSON.stringify(updatedLikedTracks));
  likedSongs = JSON.parse(localStorage.getItem("likedSongs"));
};

const play = song => {
  audio
    .play()
    .then(() => {
      const updatedTracks = tracks.map(track => {
        if (track.id === song.id) {
          return {
            ...track,
            isPlaying: true,
            paused: false,
            duration: audio?.duration,
          };
        } else {
          return {
            ...track,
            isPlaying: false,
          };
        }
      });

      updateLocalStorage(updatedTracks);

      togglePlayPauseMainButton(song.isPlaying);
    })
    .catch(err => {
      throw new Error(err);
    });
};

const pause = song => {
  const updatedTracks = tracks.map(track => {
    if (track.id === song.id) {
      return {
        ...track,
        isPlaying: false,
        paused: true,
      };
    } else {
      return {
        ...track,
        isPlaying: false,
        paused: false,
      };
    }
  });

  audio.pause();

  updateLocalStorage(updatedTracks);
  togglePlayPauseMainButton(song.isPlaying);
};

const playTrack = song => {
  if (!song.isPlaying && song.paused) {
    play(song);
    return;
  }
  // sample audio.src: "./tracks/acousticbreeze.mp3"
  audio.src = `${AUDIO_URL}${song.filename}`;
  play(song);
};

const pauseTrack = song => {
  pause(song);
};

const mute = () => {
  const volume = audio.volume;
  audio.muted = !audio.muted;

  if (audio.muted) {
    muteButton.classList.add("bi-volume-mute");
    muteButton.classList.remove("bi-volume-up");
    volumePointer.style.width = 0 + "%";
  }

  if (!audio.muted) {
    muteButton.classList.remove("bi-volume-mute");
    muteButton.classList.add("bi-volume-up");
    volumePointer.style.width = volume * 100 + "%";
  }
};

const updateHomepagePauseButtons = () => {
  trackContainer.forEach(tr => {
    if (tr.id !== selectedTrack.id) {
      const playPauseTarget = tr.querySelector("[data-track-btn]");
      togglePlayPauseTrackContainerBtn(
        !selectedTrack.isPlaying,
        playPauseTarget
      );
    }
  });
};

const showHideElements = target => {
  if (
    (target.innerText === "Home" &&
      homePageContainer.classList.contains("hide")) ||
    (target.innerText === "Liked Songs" &&
      likedSongsContainer.classList.contains("hide"))
  ) {
    homePageContainer.classList.toggle("hide");
    likedSongsContainer.classList.toggle("hide");
  }
};

// Event listener for play/pause track
trackContainer.forEach(track => {
  track.addEventListener("click", e => {
    if (
      e.target.classList.contains("bi-play-circle") ||
      e.target.classList.contains("bi-pause-circle")
    ) {
      removeRenderedPlayerDetails();

      let trackId = e.target.parentElement.dataset.trackId;
      let selectedTrack = tracks.find(track => track.id === trackId);

      updateHomepagePauseButtons();

      if (selectedTrack.isPlaying) {
        togglePlayPauseTrackContainerBtn(selectedTrack.isPlaying, e.target);
        pauseTrack(selectedTrack);
      } else {
        togglePlayPauseTrackContainerBtn(selectedTrack.isPlaying, e.target);
        playTrack(selectedTrack);
      }

      renderPlayerDetails(selectedTrack);
    }
  });
});

const renderPlayerDetails = track => {
  const detailsContainer = currentPlayingTrackDetails.content.cloneNode(true);

  playerImageContainer.dataset.trackId = track.id;

  const trackTitle = detailsContainer.querySelector("[data-track-title]");
  trackTitle.innerText = `${track.title}`;

  const artistTitle = detailsContainer.querySelector("[data-artist-title]");
  artistTitle.innerText = ` ${track.artist}`;

  const image = detailsContainer.querySelector("[data-player-image]");
  image.src = `${IMAGE_URL}/${track.thumbnail}`;

  const likeImage = detailsContainer.querySelector("[data-add-to-liked-songs]");
  track.liked && likeImage.classList.add("bi-heart-fill");
  track.liked && likeImage.classList.remove("bi-heart");

  playerImageContainer.appendChild(detailsContainer);
};

const removeRenderedPlayerDetails = () => {
  Array.from(playerImageContainer.children) &&
    Array.from(playerImageContainer.children).forEach(child => {
      playerImageContainer.removeChild(child);
    });
};

const removeRenderedLikedSong = () => {
  Array.from(likedTracksContainer.children) &&
    Array.from(likedTracksContainer.children).forEach(child => {
      likedTracksContainer.removeChild(child);
    });
};

const unlikeSelectedTrack = track => {
  const updatedTracks = tracks.map(tr => {
    if (tr.id === track.id) {
      return {
        ...tr,
        liked: false,
      };
    } else {
      return {
        ...tr,
      };
    }
  });

  updateLocalStorage(updatedTracks);
};

const likeSelectedTrack = track => {
  const updatedTracks = tracks.map(tr => {
    if (tr.id === track.id) {
      return {
        ...tr,
        liked: true,
      };
    } else {
      return {
        ...tr,
      };
    }
  });

  updateLocalStorage(updatedTracks);
};

const volumePointerPosition = () => {
  if (audio.muted) return;
  const position = audio.volume * 100;
  volumePointer.style.width = position + "%";
};

const findEndedTrackInfo = path => {
  const endedTrackPath = path.attributes[1].value;
  const endedTrackName = endedTrackPath.split("/")[2];
  const endedTrackIndex = tracks.findIndex(
    track => track.filename === endedTrackName
  );
  const endedTrack = tracks[endedTrackIndex];
  const endedTrackContainer = trackContainer.find(
    container => container.dataset.trackId === endedTrack.id
  );

  const endedTrackTargetButton =
    endedTrackContainer.querySelector("[data-track-btn]");

  return {
    endedTrackIndex,
    endedTrackTargetButton,
    endedTrack,
  };
};

const toggleLikeSongButton = (isLiked, target) => {
  if (isLiked) {
    target.classList.remove("bi-heart-fill");
    target.classList.add("bi-heart");
  }

  if (!isLiked) {
    target.classList.remove("bi-heart");
    target.classList.add("bi-heart-fill");
  }
};

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

function setVolume(e) {
  if (audio.muted) return;
  const width = this.clientWidth;
  const clickX = e.offsetX;

  audio.volume = clickX / width;
}

function selectLikedTrackEventHandler(e) {
  likedTrackContainer = Array.from(
    document.querySelectorAll("[data-liked-song-id]")
  );
  likedTrackContainer.forEach(track => track.classList.remove("selected"));

  const trackToSelect =
    (e?.target?.parentElement?.parentElement?.parentElement &&
      likedSongs.find(
        s =>
          s.id ===
          e.target?.parentElement?.parentElement?.parentElement?.dataset.trackId
      )) ||
    (e?.target?.parentElement?.parentElement &&
      likedSongs.find(
        s => s.id === e?.target?.parentElement?.parentElement?.dataset.trackId
      )) ||
    (e?.target?.parentElement &&
      likedSongs.find(
        s => s.id === e?.target?.parentElement?.dataset.trackId
      )) ||
    likedSongs.find(s => s.id === e.target.dataset.trackId);
  if (!trackToSelect) return;

  const track = likedTrackContainer.find(
    tr => tr.dataset.trackId === trackToSelect.id
  );

  if (!trackToSelect.selected) {
    track.classList.add("selected");

    const updatedLikedTracks = likedSongs.map(s => {
      if (s.id === trackToSelect.id) {
        return {
          ...s,
          selected: true,
        };
      } else {
        return { ...s, selected: false };
      }
    });

    localStorage.setItem("likedSongs", JSON.stringify(updatedLikedTracks));
  }

  if (trackToSelect.selected) {
    track.classList.remove("selected");

    const updatedLikedTracks = likedSongs.map(s => {
      return {
        ...s,
        selected: false,
      };
    });

    localStorage.setItem("likedSongs", JSON.stringify(updatedLikedTracks));
  }
}

homepageButton.addEventListener("click", e => {
  showHideElements(e.target);
});

likedSongsButton.addEventListener("click", e => {
  showHideElements(e.target);
});

// Event listener on add-to-liked-songs button
document.addEventListener("click", e => {
  if (!e.target.classList.contains("add-to-liked-songs")) return;

  const selectedTrackId = e.target.parentElement.dataset.trackId;
  const selectedTrack = tracks.find(track => track.id === selectedTrackId);

  const likedSongExists = selectedTrack.liked;

  if (likedSongExists) {
    removeRenderedLikedSong();
    toggleLikeSongButton(likedSongExists, e.target);
    unlikeSelectedTrack(selectedTrack);
  }

  if (!likedSongExists) {
    removeRenderedLikedSong();
    toggleLikeSongButton(likedSongExists, e.target);
    likeSelectedTrack(selectedTrack);
  }

  tracks = JSON.parse(localStorage.getItem("tracks"));
  tracks.forEach(track => {
    if (track.liked) {
      renderLikedSongs(track);
    }
  });
});

// Event listener on unlike-track button
document.addEventListener("click", e => {
  if (!e.target.classList.contains("liked-song-unlike-button")) return;

  const trackIdToRemove =
    e?.target?.parentElement?.parentElement?.dataset.trackId;

  const selectedTrack = tracks.find(track => track.id === trackIdToRemove);

  removeRenderedLikedSong();
  unlikeSelectedTrack(selectedTrack);

  tracks = JSON.parse(localStorage.getItem("tracks"));
  tracks.forEach(track => {
    if (track.liked) {
      renderLikedSongs(track);
    }
  });
});

// Event listener for current-time-pointer update
audio.addEventListener("timeupdate", () => {
  const position = audio.currentTime / audio.duration;
  if (position === NaN) {
    currentTimePointer.style.width = 0 + "%";
  }

  currentTimePointer.style.width = position * 100 + "%";
  // debugger;
  currentTimeDisplay.innerText = new Date(audio.currentTime * 1000)
    .toISOString()
    .substr(14, 5);

  trackDurationDisplay.innerText = new Date(
    ((typeof audio?.duration === "number" && audio?.duration) || 0) * 1000
  )
    .toISOString()
    .substr(14, 5);
});

skipToNextButton.addEventListener("click", e => {
  const currentTrackId = playerImageContainer.dataset.trackId;
  const currentTrackIndex = tracks.findIndex(
    track => track.id === currentTrackId
  );
  if (currentTrackIndex === tracks.length - 1) return;

  const currentTrackContainer = trackContainer.find(
    container => container.dataset.trackId === currentTrackId
  );
  const currentPlayPauseTarget =
    currentTrackContainer.querySelector("[data-track-btn]");
  togglePlayPauseTrackContainerBtn(
    tracks[currentTrackIndex],
    currentPlayPauseTarget
  );

  const nextTrack = tracks[currentTrackIndex + 1];
  const nextTrackContainer = trackContainer.find(
    container => container.dataset.trackId === nextTrack.id
  );
  const nextPlayPauseTarget =
    nextTrackContainer.querySelector("[data-track-btn]");

  togglePlayPauseTrackContainerBtn(nextTrack.isPlaying, nextPlayPauseTarget);
  removeRenderedPlayerDetails();
  playTrack(nextTrack);
  renderPlayerDetails(nextTrack);
});

skipToPrevButton.addEventListener("click", e => {
  const currentTrackId = playerImageContainer.dataset.trackId;
  const currentTrackIndex = tracks.findIndex(
    track => track.id === currentTrackId
  );
  if (currentTrackIndex === 0) return;

  const currentTrackContainer = trackContainer.find(
    container => container.dataset.trackId === currentTrackId
  );
  const currentPlayPauseTarget =
    currentTrackContainer.querySelector("[data-track-btn]");

  togglePlayPauseTrackContainerBtn(
    tracks[currentTrackIndex],
    currentPlayPauseTarget
  );

  const prevTrack = tracks[currentTrackIndex - 1];
  const prevTrackContainer = trackContainer.find(
    container => container.dataset.trackId === prevTrack.id
  );
  const prevPlayPauseTarget =
    prevTrackContainer.querySelector("[data-track-btn]");

  removeRenderedPlayerDetails();
  playTrack(prevTrack);
  renderPlayerDetails(prevTrack);
  togglePlayPauseTrackContainerBtn(prevTrack.isPlaying, prevPlayPauseTarget);
});

playPauseMainButton.addEventListener("click", e => {
  const currentTrackId = playerImageContainer.dataset.trackId;
  const currentTrack = tracks.find(track => track.id === currentTrackId);
  const targetContainer = trackContainer.find(
    track => track?.dataset?.trackId === currentTrackId
  );
  const targetElement = Array.from(
    targetContainer.getElementsByTagName("i")
  )[0];

  if (currentTrack.isPlaying) {
    togglePlayPauseTrackContainerBtn(currentTrack.isPlaying, targetElement);
    pauseTrack(currentTrack);
  }

  if (!currentTrack.isPlaying) {
    togglePlayPauseTrackContainerBtn(currentTrack.isPlaying, targetElement);
    playTrack(currentTrack);
  }
});

audio.addEventListener("ended", e => {
  // HANDLE SHUFFLE FEATURE
  if (shuffleButton.classList.contains("rotate")) {
    removeRenderedPlayerDetails();

    const { endedTrackIndex, endedTrackTargetButton } = findEndedTrackInfo(
      e.path[0]
    );
    togglePlayPauseTrackContainerBtn(
      tracks[endedTrackIndex].isPlaying,
      endedTrackTargetButton
    );

    const trackList = tracks.filter(tr => tr.id !== tracks[endedTrackIndex].id);
    const randomTrack = trackList[Math.floor(Math.random() * trackList.length)];
    playTrack(randomTrack);
    const nextTrackContainer = trackContainer.find(
      container => container.dataset.trackId === randomTrack.id
    );
    const nextTrackTargetButton =
      nextTrackContainer.querySelector("[data-track-btn]");

    renderPlayerDetails(randomTrack);
    togglePlayPauseTrackContainerBtn(
      randomTrack.isPlaying,
      nextTrackTargetButton
    );

    return;
  }

  const { endedTrackIndex, endedTrackTargetButton, endedTrack } =
    findEndedTrackInfo(e.path[0]);

  pauseTrack(endedTrack);
  togglePlayPauseTrackContainerBtn(
    endedTrack.isPlaying,
    endedTrackTargetButton
  );
  removeRenderedPlayerDetails();

  if (endedTrackIndex === tracks.length - 1) return;

  const nextTrack = tracks[endedTrackIndex + 1];
  const nextTrackContainer = trackContainer.find(
    track => track.dataset.trackId === nextTrack.id
  );
  const nextTrackTargetButton =
    nextTrackContainer.querySelector("[data-track-btn]");

  play(nextTrack);
  togglePlayPauseTrackContainerBtn(nextTrack.isPlaying, nextTrackTargetButton);
  renderPlayerDetails(nextTrack);
});

repeatButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("rotate")) {
    shuffleButton.classList.remove("rotate");
  }
  audio.loop = !audio.loop;
  audio.loop
    ? repeatButton.classList.add("rotate")
    : repeatButton.classList.remove("rotate");
});

shuffleButton.addEventListener("click", e => {
  if (audio.loop) {
    audio.loop = !audio.loop;
    repeatButton.classList.remove("rotate");
  }
  shuffleButton.classList.toggle("rotate");
});

muteButton.addEventListener("click", e => {
  mute();
});

playPauseLikedContainer.addEventListener("click", e => {
  const likedSongs = JSON.parse(localStorage.getItem("likedSongs"));

  const selectedTrack = likedSongs.find(s => s.selected);
  if (!selectedTrack) return;

  const homepageContainer = trackContainer.find(
    track => track?.dataset?.trackId === selectedTrack.id
  );
  const homepagePlayPauseTarget = Array.from(
    homepageContainer.getElementsByTagName("i")
  )[0];

  updateHomepagePauseButtons();

  if (!selectedTrack.isPlaying && selectedTrack.paused) {
    togglePlayPauseTrackContainerBtn(
      selectedTrack.isPlaying,
      homepagePlayPauseTarget
    );
    audio.src = `${AUDIO_URL}${selectedTrack.filename}`;
    play(selectedTrack);
  }
  if (!selectedTrack.isPlaying && !selectedTrack.paused) {
    togglePlayPauseTrackContainerBtn(
      selectedTrack.isPlaying,
      homepagePlayPauseTarget
    );

    playTrack(selectedTrack);
  }
  removeRenderedPlayerDetails();

  renderPlayerDetails(selectedTrack);

  likedTrackContainer.forEach(track => {
    track.classList.remove("selected");

    const updatedLikedTracks = likedSongs.map(s => {
      return {
        ...s,
        selected: false,
      };
    });

    localStorage.setItem("likedSongs", JSON.stringify(updatedLikedTracks));
  });
});

document
  .querySelector("body")
  .addEventListener("click", selectLikedTrackEventHandler);

volumeControlContainer.addEventListener("click", setVolume);

volumeControlContainer.addEventListener("click", volumePointerPosition);

seekControlContainer.addEventListener("click", setProgress);
