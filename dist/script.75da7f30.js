// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"dashboard.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tracks = exports.setupTrackList = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import tracks from "./tracks.json";
// import { v4 as uuidv4 } from "https://jspm.dev/uuid";
// const tracksList = JSON.parse(tracks);
// let tracksList = [];
// (async function fetchData() {
//   const response = await fetch("./tracks.json");
//   const json = await response.json();
//   tracksList = json;
//   console.log(
//     "🚀 ~ file: dashboard.js ~ line 9 ~ fetchData ~ tracksList",
//     tracksList
//   );
// })();
var generateTracks = function generateTracks(tracks) {
  return tracks.map(function (track) {
    return _objectSpread(_objectSpread({}, track), {}, {
      id: uuidv4(),
      liked: false
    });
  });
};

var fetchTracks = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var response, tracksList, _tracks, _tracks2;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (localStorage.getItem("tracks")) {
              _context.next = 13;
              break;
            }

            _context.next = 3;
            return fetch("./tracks.json");

          case 3:
            response = _context.sent;
            _context.next = 6;
            return response.json();

          case 6:
            tracksList = _context.sent;
            console.log("🚀 ~ file: dashboard.js ~ line 16 ~ tracksList", tracksList);
            _tracks = generateTracks(tracksList);
            localStorage.setItem("tracks", JSON.stringify(_tracks));
            return _context.abrupt("return", _tracks);

          case 13:
            _tracks2 = JSON.parse(localStorage.getItem("tracks"));
            console.log("🚀 ~ file: dashboard.js ~ line 33 ~ fetchTracks ~ tracks", _tracks2);
            return _context.abrupt("return", _tracks2);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchTracks() {
    return _ref.apply(this, arguments);
  };
}();

var tracks = await fetchTracks();
exports.tracks = tracks;
var trackContainerTemplate = document.querySelector("#track__container__template");
var trackListContainer = document.querySelector("[data-tracks-container]");
var IMAGE_URL = "./tracks/thumbnails";
var MP3_URL = "./tracks/"; // IF localstorage.length > 0 run

var setupTrackList = function setupTrackList() {
  console.log("i am here");
  tracks.forEach(renderTracks);
};

exports.setupTrackList = setupTrackList;

var renderTracks = function renderTracks(track) {
  console.log(track);
  var trackContainer = trackContainerTemplate.content.cloneNode(true);
  var container = trackContainer.querySelector("[data-track-container]");
  container.dataset.trackId = track.id;
  var title = trackContainer.querySelector("[data-track-title]");
  title.innerText = "".concat(track.title, " - ").concat(track.artist);
  var image = trackContainer.querySelector("[data-track-img]");
  image.src = "".concat(IMAGE_URL, "/").concat(track.thumbnail);
  console.log("🚀 ~ file: dashboard.js ~ line 37 ~ trackContainer", trackContainer);
  trackListContainer.appendChild(trackContainer);
};
},{}],"player.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.audio = void 0;
var audio = new Audio();
exports.audio = audio;
},{}],"script.js":[function(require,module,exports) {
"use strict";

var _dashboard = require("./dashboard.js");

var _player = require("./player.js");

(0, _dashboard.setupTrackList)();
var AUDIO_URL = "./tracks/";
var trackContainer = Array.from(document.querySelectorAll("[data-track-container]"));
var testButton = document.querySelector("[data-eventListener-test]");
var audioPlayer = document.querySelector("#audio__player"); // const audioSource = document.querySelector("[data-audio-source]");
// console.log("🚀 ~ file: script.js ~ line 12 ~ audioPlayer", audioSource.src);

trackContainer.forEach(function (track) {
  track.addEventListener("click", function (e) {
    console.log("click", e);
    var trackContainer = e.target.parentElement;
    var trackId = trackContainer.dataset.trackId; // console.log("🚀 ~ file: script.js ~ line 22 ~ trackId", trackId);
  });
}); // Add event listener to 'play' button

trackContainer.forEach(function (track) {
  track.addEventListener("click", function (e) {
    if (!e.target.classList.contains("bi-play-circle")) return;
    console.log("i have been clicked");
    var trackId = e.target.parentElement.dataset.trackId;
    console.log("🚀 ~ file: script.js ~ line 33 ~ container", trackId);

    var selectedTrack = _dashboard.tracks.find(function (track) {
      return track.id === trackId;
    });

    console.log("🚀 ~ file: script.js ~ line 34 ~ selectedTrack", selectedTrack); // debugger;
    // const audio = new Audio();

    console.log("🚀 ~ file: script.js ~ line 42 ~ audio", _player.audio.src);

    if (_player.audio.src) {
      _player.audio.pause(); // return;

    }

    if (_player.audio.src === "".concat(selectedTrack.filename)) {
      _player.audio.pause(); // return;

    } // if (
    //   audio.src === `${AUDIO_URL}${selectedTrack.filename}` &&
    //   !audio.paused
    // ) {
    //   audio.pause();
    //   return;
    // }


    _player.audio.src = "".concat(AUDIO_URL).concat(selectedTrack.filename);

    _player.audio.play();

    console.log("🚀 ~ file: script.js ~ line 41 ~ audio", _player.audio); // function play() {
    //    audio = new Audio('https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3');
    //   audio.play();
    // }
    // // audioPlayer.src = `./tracks/${selectedTrack.filename}`;
    // // audioPlayer.childElement.src = `./tracks/${selectedTrack.filename}`;
    // console.log(audioPlayer.src);
    // // audioPlayer.load();
    // console.log(
    //   "🚀 ~ file: script.js ~ line 40 ~ audioPlayer",
    //   audioPlayer,
    //   audioSource
    // );
    //   audio
    //     .play()
    //     .then()
    //     .catch(e => console.log(e));
  });
});
},{"./dashboard.js":"dashboard.js","./player.js":"player.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {

},{}]