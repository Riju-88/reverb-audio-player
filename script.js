
// Create an AudioContext


// Get the audio element and the reverb controls
let audioElement = document.getElementById('audio');
let playButton = document.getElementById('play-button');
let pauseButton = document.getElementById('pause-button');
let stopButton = document.getElementById('stop-button');
let loopButton = document.getElementById('loop-button');
let replayButton = document.getElementById('replay-button');
let prevButton = document.getElementById('prev-button');
let nextButton = document.getElementById('next-button');



// api

const user_id = '31bhzb3xhsss7dukrqn3p6u45ory';
const playlist_id = '1nGLCFwiSSGcSmGhKErke7';
const client_id = 'db73724c065b48e18a37fa178f573970';
const client_secret = '73d1e47eca2243889cd4d79d66e33ee2';
const limit = 100;
let offset = 0;
let allTracks = [];

const authOptions = {
method: 'POST',
headers: {
'Content-Type': 'application/x-www-form-urlencoded',
'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
},
body: new URLSearchParams({
grant_type: 'client_credentials'
})
};

fetch('https://accounts.spotify.com/api/token', authOptions)
.then(response => response.json())
.then(data =>{ 
// console.log(data.access_token);

const accessToken=data.access_token;

// function 
const getTracks = () => {
fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
headers: {
'Authorization': `Bearer ${accessToken}`
}
})
.then(response => response.json())
.then(data =>{ 
// console.log(data);
const tracks = data.items;

allTracks = allTracks.concat(data.items);

// if the next property of response is not null
if (data.next) {

// incrementing the offset with the limit value
offset += limit;
// calling getTracks() after updating the offset
getTracks();
} else {
// all code here
// array of preview urls
let arr = [];	
const previewUrls = allTracks.filter(item =>{
if (item.track.preview_url!= null) {
arr.push(`${item.track.preview_url}`);
}

}).filter(index=>index!=undefined);

// only index in array
const arrIndex=allTracks.map((item,index) =>{
if (item.track.preview_url!= null) {
return index;
}

}).filter(index=>index!=undefined);

// track image/thumbnail in array
let arrImage=allTracks.map((item) =>{
if (item.track.preview_url!= null) {
return item.track.album.images[1].url;
}

}).filter(index=>index!=undefined);
// console.log(arrImage);

// array of track name
let arrTracks=allTracks.map((item) =>{
if (item.track.preview_url!= null) {
return item.track.name;
}
}).filter(index=>index!=undefined);


// all code

let context = new (window.AudioContext || window.webkitAudioContext)();



//progress-bar
var progressBar = document.getElementById("progress-bar");

audioElement.addEventListener("timeupdate", function () {
var progress = (audioElement.currentTime / audioElement.duration) * 100;
progressBar.innerHTML = "<div class='progress' style='width:" + progress + "%;'></div>";
});
//

// Any
let arrRNG = document.querySelector("#arrRNG");
arrRNG.addEventListener("click", () => {
let rng = Math.floor(Math.random() * arr.length);
audioElement.src = arr[rng];

// Any logic re-sets the options in select tag(to update the display)
// if rng val== select val then add selected attr
let list = document.querySelector("#list");
let mapped = arrTracks.map(i => {
if (i == arrTracks[rng]) {
    return `<option selected="true">${i}</option>`
} else {
    `<option>${i}</option>`
}

}).join("");
let mappedAll = arrTracks.map(i => `<option>${i}</option>`).join("");
list.innerHTML = `${mapped}${mappedAll}`;
// console.log(arr);

let reflectTop = document.querySelector("#reflectTop");
let reflectBottom = document.querySelector("#reflectBottom");


//adding img to reflect src(Any button/rng action)

reflectTop.src = arrImage[arrTracks.indexOf(list.value)];
reflectBottom.src = arrImage[arrTracks.indexOf(list.value)];
//  console.log(jpg);
//  console.log(audioElement.src);

//adding audio duration on list item change
audioElement.addEventListener("loadedmetadata", function () {
document.querySelector("#audio-duration").innerHTML =
    `${Math.floor(audioElement.duration/60)}:${Math.floor(audioElement.duration%60)}`;
});
});

// set the array of tracks in list.innerHTML
let list = document.querySelector("#list");
let mapped = arrTracks.map(i => `<option>${i}</option>`).join("");
list.innerHTML = `<option>---</option>${mapped}`;

// code for select
let select = document.querySelector("#list");


select.addEventListener("change", () => {
  let list = document.querySelector("#list");
let reflectTop = document.querySelector("#reflectTop");
let reflectBottom = document.querySelector("#reflectBottom");
// console.log("select value: " + select.value);
audioElement.src = arr[arrTracks.indexOf(list.value)];

//adding img to reflect src(select action onclick)

reflectTop.src = arrImage[arrTracks.indexOf(list.value)];
reflectBottom.src = arrImage[arrTracks.indexOf(list.value)];
//  console.log(jpg);

//adding audio duration on list item change
audioElement.addEventListener("loadedmetadata", function () {
document.querySelector("#audio-duration").innerHTML =
    `${Math.floor(audioElement.duration/60)}:${Math.floor(audioElement.duration%60)}`;
});

});

 // add to playlist button
    const addFav = document.querySelector("#addFav");
    addFav.addEventListener("click", () => {

      let list = document.querySelector("#list");
    
      let notificationDialog = document.querySelector("#notification-dialog");
      let notificationText = "";
      // Retrieve the array from localStorage
      // if the playList array doesn't exist in localStorage, it defaults to an empty array using the || [] operator
      const playList = JSON.parse(localStorage.getItem('playList')) || [];

      if (Array.isArray(playList)) {
        // The array exists in localStorage
        // console.log('Playlist exists:', playList);

        const str = String.raw`${list.value}`;

        if (!playList.includes(str)) {
          // The string is not found in the array, push it
          playList.push(str);
          console.log('Track added:', str);
          notificationText = `${str} added to playlist`;
          console.log('Playlist updated:', playList);

          // Store the updated array back to localStorage
          localStorage.setItem('playList', JSON.stringify(playList));
        } else {
          console.log('Track already exists:', str);
          notificationText = `${str} already exists in playlist`;
        }
      } else {
        // The array does not exist in localStorage
        console.log('Playlist does not exist');
      }

      notificationDialog.innerHTML = notificationText;
      notificationDialog.show();
      // add settimeout to auto close dialog
      setTimeout(() => {
        notificationDialog.close();
      },2000);


    })

    // load playlist
    const loadPlaylist = document.querySelector("#loadPlaylist");
    loadPlaylist.addEventListener("click", () => {
      // Retrieve the array from localStorage
      // if the playList array doesn't exist in localStorage, it defaults to an empty array using the || [] operator
      const playList = JSON.parse(localStorage.getItem('playList')) || [];
    //   console.log(playList);
      // list
      const list = document.querySelector("#list");
      const mapList = playList.map(i => `<option>${i}</option>`).join('');
      list.innerHTML = mapList;

      // try the code here
      // getting the values of <option> and adding them to currentList
      let currentList = [];
      //  console.log(list.children.value);
      list.childNodes.forEach(i => {
        // console.log(i.value);
        currentList.push(i.value);
      });

      //  since other buttons rely on arr and arrTracks, setting arr to newArr and arrTracks to currentList
  

    //   create new object with all tracks as keys and arr as values(urls)
    const obj = arrTracks.reduce((acc, key, index) => {
        acc[key] = arr[index];
        return acc;
      }, {});

    //   create new object with all tracks as keys and arr as values(urls)
    const imgObj = arrTracks.reduce((acc, key, index) => {
        acc[key] = arrImage[index];
        return acc;
      }, {});

    //   using map to create new array(newArr) which will have the obj values as keys
      const newArr = currentList.map(key => obj[key]).filter(value => value !== undefined);

    //   using map to create new array(newImgArr) which will have the imgObj values as keys
      const newImgArr = currentList.map(key => imgObj[key]).filter(value => value !== undefined);

    //   setting track names to playlist track names
    // arrTracks contains global track names
    // currentList contains track names of user playlist
      arrTracks = currentList;

    //   setting playlist track image urls to arrImg
    // arrImg contains global track image urls
    // newImgArr contains track image urls of user playlist
      arrImage = newImgArr;

    //   setting track urls to newArr
    // arr contains global track urls
    // newArr contains track urls of user playlist
      arr = newArr;

      // setting audio src to arr[0]
      audioElement.src = arr[0];

      // setting reflect src
let reflectTop = document.querySelector("#reflectTop");
let reflectBottom = document.querySelector("#reflectBottom");


//adding img to reflect src(Any button/rng action)

reflectTop.src = arrImage[arrTracks.indexOf(list.value)];
reflectBottom.src = arrImage[arrTracks.indexOf(list.value)];
console.log("list value: "+list.value);
console.log("arr image: "+arrImage[arrTracks.indexOf(list.value)]);
console.log("index of track: "+arrTracks.indexOf(list.value));
console.log(arrTracks);
console.log(arrImage);

    // notification
      let notificationDialog = document.querySelector("#notification-dialog");
      let notificationText = "";
      notificationText = `Custom Playlist Loaded`;
      notificationDialog.innerHTML = notificationText;
      notificationDialog.show();

      // add settimeout to auto close dialog
      setTimeout(() => {
        notificationDialog.close();
      },2000);

    })

    // delete playlist
    const deletePlaylist = document.querySelector("#deletePlaylist");
    deletePlaylist.addEventListener("click", () => {
      // Retrieve the array from localStorage
      // if the playList array doesn't exist in localStorage, it defaults to an empty array using the || [] operator
      const playList = JSON.parse(localStorage.getItem('playList')) || [];
    //   console.log(playList);
      //  if the array exists in localStorage, remove it
      if (Array.isArray(playList)) {
        playList.splice(0, playList.length);
        localStorage.setItem('playList', JSON.stringify(playList));
      }
      // reload to update the playlist
      window.location.reload();

    })

//dialog code
const showImg = document.getElementById("showImg");
showImg.addEventListener("click", () => {
document.querySelector("#myDialog").showModal();

// add body id onclick
document.querySelector("#body").classList.add("bodyHeight");
// 
})
// dialog close
document.querySelector("#myDialog").addEventListener("click", () => {

// remove body id onclick
document.querySelector("#body").classList.remove("bodyHeight");
document.querySelector("#myDialog").close();
});

// toggle action
let reverbToggle = document.querySelector("#reverb-toggle");
let equalizerToggle = document.querySelector("#equalizer-toggle");
let surroundToggle = document.querySelector("#surround-toggle");


reverbToggle.addEventListener("click", () => {
let reverbdialog = document.querySelector('#reverbDialog');
    reverbdialog.showModal();

    reverbdialog.addEventListener('touchstart', (event) => {
// Check if the target of the touch event is inside the dialog
if (event.target.closest('dialog')) {
// Check if the touch event occurred outside of any input elements inside the dialog
const isTouchOnInput = Array.from(dialog.querySelectorAll('input')).some(input => input.contains(event.target));
if (!isTouchOnInput) {
// Prevent default scrolling behavior on touch devices
event.preventDefault();
}
}
}, { passive: false });

    // close dialog
    window.addEventListener("click", (event) => {
        if (
            event.target.tagName == "HTML") {
            reverbdialog.close();

        }
    });
    // 
})


equalizerToggle.addEventListener("click", () => {
let equalizerdialog = document.querySelector('#equalizerDialog');
    equalizerdialog.showModal();

    equalizerdialog.addEventListener('touchstart', (event) => {
// Check if the target of the touch event is inside the dialog
if (event.target.closest('dialog')) {
// Check if the touch event occurred outside of any input elements inside the dialog
const isTouchOnInput = Array.from(dialog.querySelectorAll('input')).some(input => input.contains(event.target));
if (!isTouchOnInput) {
// Prevent default scrolling behavior on touch devices
event.preventDefault();
}
}
}, { passive: false });

    // close dialog
    window.addEventListener("click", (event) => {
        if (
            event.target.tagName == "HTML") {
            equalizerdialog.close();

        }
    });
})

surroundToggle.addEventListener("click", () => {
let surrounddialog = document.querySelector('#surroundDialog');
    surrounddialog.showModal();

    surrounddialog.addEventListener('touchstart', (event) => {
// Check if the target of the touch event is inside the dialog
if (event.target.closest('dialog')) {
// Check if the touch event occurred outside of any input elements inside the dialog
const isTouchOnInput = Array.from(dialog.querySelectorAll('input')).some(input => input.contains(event.target));
if (!isTouchOnInput) {
// Prevent default scrolling behavior on touch devices
event.preventDefault();
}
}
}, { passive: false });

    // close dialog
    window.addEventListener("click", (event) => {
        if (
            event.target.tagName == "HTML") {
            surrounddialog.close();

        }
    });
})
//


var roomSizeControl = document.getElementById('room-size');
var dryGainControl = document.getElementById('dry-gain');
var wetGainControl = document.getElementById('wet-gain');

// Create an audio source using the audio element
var source = context.createMediaElementSource(audioElement);

// Create a reverb effect
var reverb = context.createConvolver();
reverb.buffer = createReverbBuffer(context, roomSizeControl.value);

// Set the dry and wet gains
var dryGain = context.createGain();
dryGain.gain.value = dryGainControl.value;
var wetGain = context.createGain();
wetGain.gain.value = wetGainControl.value;



// 
context.listener.spatialization = 'HRTF';
// Create a panner node
var panner = context.createPanner();
let x = document.querySelector("#x");
let y = document.querySelector("#y");
let z = document.querySelector("#z");

x.addEventListener("input", () => {
// Set the panner's position in 3D space
// panner.setPosition(document.querySelector("#x").value, document.querySelector("#y").value, document
// .querySelector("#z").value);

panner.positionX.value = parseFloat(document.querySelector("#x").value);
panner.positionY.value = parseFloat(document.querySelector("#y").value);
panner.positionZ.value = parseFloat(document.querySelector("#z").value);
//  console.log(x.value);
});
y.addEventListener("input", () => {
// Set the panner's position in 3D space
// panner.setPosition(document.querySelector("#x").value, document.querySelector("#y").value, document
// .querySelector("#z").value);


panner.positionX.value = parseFloat(document.querySelector("#x").value);
panner.positionY.value = parseFloat(document.querySelector("#y").value);
panner.positionZ.value = parseFloat(document.querySelector("#z").value);


//  console.log(y.value);
});
z.addEventListener("input", () => {
// Set the panner's position in 3D space
// panner.setPosition(document.querySelector("#x").value, document.querySelector("#y").value, document
// .querySelector("#z").value);

panner.positionX.value = parseFloat(document.querySelector("#x").value);
panner.positionY.value = parseFloat(document.querySelector("#y").value);
panner.positionZ.value = parseFloat(document.querySelector("#z").value);

//  console.log(z.value);
});

// commented out this line
// Set the panner's position in 3D space
// panner.setPosition(document.querySelector("#x").value, document.querySelector("#y").value, document
// .querySelector(
// "#z").value);

// Connect the audio source to the panner node
source.connect(panner);

// Connect the panner node to the destination
panner.connect(context.destination);
// 

// stereo width
const buffersource = context.createBufferSource();
buffersource.connect(context.destination);

const stereopanner = context.createStereoPanner();


// stereopanner.pan.value = -1; // hard left
// stereopanner.pan.value = 0; // center
// stereopanner.pan.value = 1; // hard right

document.querySelector("#stereo").addEventListener("input", () => {
stereopanner.pan.value = document.querySelector("#stereo").value;
//  console.log(stereopanner.pan.value);
})
buffersource.connect(stereopanner).connect(context.destination);
// 

// Connect the audio source, reverb effect, and gain nodes
source.connect(reverb);
reverb.connect(wetGain);
wetGain.connect(context.destination);
source.connect(dryGain);
dryGain.connect(context.destination);

// Play the audio
// audioElement.play();

// Update the reverb settings when the controls are changed
roomSizeControl.addEventListener('input', function () {
reverb.buffer = createReverbBuffer(context, roomSizeControl.value);
});

dryGainControl.addEventListener('input', function () {
dryGain.gain.value = dryGainControl.value;
});

wetGainControl.addEventListener('input', function () {
wetGain.gain.value = wetGainControl.value;
});

// play button
playButton.addEventListener('click', function () {
audioElement.play();

    // notification
      let list = document.querySelector("#list");
      let notificationDialog = document.querySelector("#notification-dialog");
      let notificationText = "";
      notificationText = `Now Playing: ${list.value}`;
      notificationDialog.innerHTML = notificationText;
      notificationDialog.show();
// add settimeout to auto close dialog
setTimeout(() => {
  notificationDialog.close();
},2000);

setInterval(() => {
let minutes = Math.floor(audioElement.currentTime / 60);
let seconds = Math.floor(audioElement.currentTime % 60);

// Display the current time in the format MM:SS

document.querySelector("#current-time").innerHTML = minutes + ":" + seconds;
}, 300);

});

// pause button
pauseButton.addEventListener('click', function () {
audioElement.pause();
});

// stop button
stopButton.addEventListener('click', function () {
audioElement.pause();
audioElement.currentTime = 0;
});

// loop button
loopButton.addEventListener('click', () => {
audioElement.loop = !audioElement.loop;
const loopImg = document.querySelector("#loop-img");

const imgDefault =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABUUlEQVR4nO2ZQWrDQAxF/3l8gqYnaEJ2TRfpRbp0Al3kTk16p7pdtYVfDBowgwOORjP1JHqgRYIZ6UViAjLgOM5caXAFPAL4BnDAFUhQokqZDYCfgQTlc1NzJwjgF8C2VAFrACcAX1ERUyLwNNKJKfEpuVepEq+K5LHIVinBKPYpneCMRAhgqRF5NxJJGS1GcdSIdNEhd8hzY/Xfn2MRPf+hSXzu1y19/TK1jhwiY9dwm7sOZhIZyrQl6mBGEVzwb865ixSrgy5iC70jgo+WMfTREny0jKGPluCjZQx9tISbHq1GkyhDHUkH7GTh9oyKRXaD56xlWEqkUWxHctQxeR3Ur2YsVz1TuLdYB50UCzSOyPTLuUDqeW8akZVB4iATNu6pZz1AyX5GIi0SWcrOtfuH0epknNSdqO4ljgW5r9+ivNTciTGZ6iUCVb2ddZxb4g9JJAsMeWFuUwAAAABJRU5ErkJggg==";

const imgActive =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABbUlEQVR4nO2awU7CQBCG//A2Bh5AOXkU4lGjiZ54CY+FxINv4wMoPgMP4sXiDZMxhCUhm0LLzOx2dzNfsgeaZna+zm4pQwHDMFJliAK4B7AB8IYCJMiNLGUePAlyn0fIuBIE4A/AU6wEbgEsAfx6SbSNtkp0GWs391Qq8cqY3BfhSpA3FpJKUEIiBGDCEflSEtGU+eSI1F6QS06QFpmNO36MK+/8H87Ep65wzNsvSfMIIbLlzpOpQudBgUQOZaoYeVBAkXMeGikVkQGAlSAGpSByAeBdGIP6FHkE8K10MahPkVmHL8kYeajukWsT2WEV2WNLy8P2iMP2yB7bI6XuESnUh8iwBJG5a7g9cyZTzEMUYH5wnrYMxRIZMbojIfLo3A7atmY0Wz1dGGu0g5ZHflOcM5pkJPE+OCJTBZEmGUmsGzBZJCRSQcjE9VzrHpZW7ZYTuxLZ/YmjQejbb1Recq5Ek0z2EkW9BGAYJfIPc54mxv7YigcAAAAASUVORK5CYII=";


loopImg.src = (loopImg.src === imgDefault) ? imgActive : imgDefault;

});

// replay button
replayButton.addEventListener('click', function () {
audioElement.currentTime = 0;
audioElement.play();
});

// prev button
prevButton.addEventListener('click', function () {

let list = document.querySelector("#list");

let mappedAll = arrTracks.map(i => `<option>${i}</option>`).join("");

// arr[arrTracks.indexOf(list.value)]
if (arrTracks.indexOf(list.value) == 0 || list.value == "---") {
// console.log("if");
list.innerHTML = `<option>${arrTracks[arrTracks.length-1]}</option>${mappedAll}`;

//setting the value in the audio src
audioElement.src = arr[arr.length - 1];
//
let reflectTop = document.querySelector("#reflectTop");
let reflectBottom = document.querySelector("#reflectBottom");


//adding img to reflect src(Any button/rng action)

reflectTop.src = arrImage[arrTracks.indexOf(list.value)];
reflectBottom.src = arrImage[arrTracks.indexOf(list.value)];


} else {
//  console.log("else");
let newVal = arrTracks.indexOf(list.value);
//  console.log(arr[newVal],arr[newVal+1]);
list.innerHTML = `<option>${arrTracks[newVal-1]}</option>${mappedAll}`;

//setting the value in audio src
audioElement.src = arr[newVal - 1];
//
let reflectTop = document.querySelector("#reflectTop");
let reflectBottom = document.querySelector("#reflectBottom");


//adding img to reflect src(Any button/rng action)

reflectTop.src = arrImage[arrTracks.indexOf(list.value)];
reflectBottom.src = arrImage[arrTracks.indexOf(list.value)];


}
//outside if else
//adding audio duration on list item change
audioElement.addEventListener("loadedmetadata", () => {
document.querySelector("#audio-duration").innerHTML =
    `${Math.floor(audioElement.duration/60)}:${Math.floor(audioElement.duration%60)}`;
});

});

// next button
nextButton.addEventListener('click', function () {

let list = document.querySelector("#list");

let mappedAll = arrTracks.map(i => `<option>${i}</option>`).join("");


if (arrTracks.indexOf(list.value) == -1 || list.value == "---" || arrTracks.indexOf(list.value) == arrTracks.length - 1) {

list.innerHTML = `<option>${arrTracks[0]}</option>${mappedAll}`;

//setting the value in the audio src
audioElement.src = arr[0];
//
let reflectTop = document.querySelector("#reflectTop");
let reflectBottom = document.querySelector("#reflectBottom");


//adding img to reflect src(Any button/rng action)

reflectTop.src = arrImage[arrTracks.indexOf(list.value)];
reflectBottom.src = arrImage[arrTracks.indexOf(list.value)];


} else {

//  console.log("else");
let newVal = arrTracks.indexOf(list.value);
 
newVal++;
list.innerHTML = `<option>${arrTracks[newVal]}</option>${mappedAll}`;
// console.log(newVal,arrTracks[newVal],arr[newVal]);
//setting the value in audio src
audioElement.src = arr[newVal];
//
let reflectTop = document.querySelector("#reflectTop");
let reflectBottom = document.querySelector("#reflectBottom");


//adding img to reflect src(Any button/rng action)

reflectTop.src = arrImage[arrTracks.indexOf(list.value)];
reflectBottom.src = arrImage[arrTracks.indexOf(list.value)];


}
//outside if else
//adding audio duration on list item change
audioElement.addEventListener("loadedmetadata", () => {
document.querySelector("#audio-duration").innerHTML =
    `${Math.floor(audioElement.duration/60)}:${Math.floor(audioElement.duration%60)}`;
});

});

//autoplay
let eventAdded = false;
let autoNext = function () {
let list = document.querySelector("#list");

let mappedAll = arrTracks.map(i => `<option>${i}</option>`).join("");

if (arrTracks.indexOf(list.value) == arrTracks.length - 1) {
// console.log("if");
list.innerHTML = `<option>${arrTracks[0]}</option>${mappedAll}`;

//setting the value in the audio src
audioElement.src = arr[0];
//
let reflectTop = document.querySelector("#reflectTop");
let reflectBottom = document.querySelector("#reflectBottom");


//adding img to reflect src(Any button/rng action)

reflectTop.src = arrImage[arrTracks.indexOf(list.value)];
reflectBottom.src = arrImage[arrTracks.indexOf(list.value)];


} else {
//  console.log("else");
let newVal = arrTracks.indexOf(list.value);
//  console.log(arr[newVal],arr[newVal+1]);
list.innerHTML = `<option>${arrTracks[newVal+1]}</option>${mappedAll}`;

//setting the value in audio src
audioElement.src = arr[newVal + 1];
//
let reflectTop = document.querySelector("#reflectTop");
let reflectBottom = document.querySelector("#reflectBottom");


//adding img to reflect src(Any button/rng action)

reflectTop.src = arrImage[arrTracks.indexOf(list.value)];
reflectBottom.src = arrImage[arrTracks.indexOf(list.value)];


}
//outside if else
//adding audio duration on list item change
audioElement.addEventListener("loadedmetadata", () => {
document.querySelector("#audio-duration").innerHTML =
    `${Math.floor(audioElement.duration/60)}:${Math.floor(audioElement.duration%60)}`;
});

// playing audio
audioElement.play();

    // notification
    
   
    let notificationDialog = document.querySelector("#notification-dialog");
    let notificationText = "";
    notificationText = `Now Playing: ${list.value}`;
    notificationDialog.innerHTML = notificationText;
    notificationDialog.show();
    // add settimeout to auto close dialog
    setTimeout(() => {
    notificationDialog.close();
    },2000);

setInterval(() => {
let minutes = Math.floor(audioElement.currentTime / 60);
let seconds = Math.floor(audioElement.currentTime % 60);

// Display the current time in the format MM:SS

document.querySelector("#current-time").innerHTML = minutes + ":" + seconds;
}, 300);

};

let autoplayBtn = document.getElementById("auto-play");
autoplayBtn.addEventListener("click", function () {
if (eventAdded) {
audioElement.removeEventListener("ended", autoNext);
eventAdded = false;
autoplayBtn.classList.toggle("rot");
document.querySelector("#autoplayImg").src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEfUlEQVR4nO2aW4hVVRjHf3Nx5tRIOkcno7sIgUxULxJUz+Vg5QUitZFeKn0ok6nXaugpLHoIJB97qIh6CAoRiy7S1SzLl3K8gN1EwnwImnGabMdH/wUfds4+e+2z9jkZ/mHDmVlrfWutvb7v/13Whgv4/6IOrAGeBXYBh4DTwKwe+/2d2qzPamCY/whqwCbgHeAskEU+fwJ7gHFgsBsbuAh4DDjhFnUGeB94QiezXG98np5h/c/angQ+0Jgw/mdgQi+nI1gFHHML2A88ACwoIWsh8CDwpZN3FBijQtib2ukm/Aq4PaH8lcDXTv6OKk7nMi3cJvgdeAToSz0J/8h8FJh2p70klfClOu5MrHM91eMGYEpzHtEa2sKIE/gFsJjOYRj4WHMfk1aUQs2p06fAEJ3HEPC5U7NSNrPTqZM5u25hkdMKI4Boig2G3QmbKGIz01qTsVthZxf8hLFTK/QAHwGfALdSHbY54y+kYo87P9FXUI8D9/8FvAZcTXr0A99oHttULmou7Cjq7C5W/7NSxUxq8HQFBDEm+T+1is3GHUPEqKKNmQGuAl7VyYQJx6V+KdDjmHRjXsd31clip6KouaAxYIVsxsdjt5EGmyVzd7MOdYXVZyIDwEEJtpzDoxe4X1FtsJ+XgStp31HOAnPN1rlWE74XKXhA4/7IsaFJR59mR88A8ymPvZJ1V6PG59Ro+UQM5mmcvaE8XAu87tTtB2B9SfuZlIztjRp3qfHuErQYsr0iuBn4zG3IYrhbIudcq7FvNWo8rEbL4mLQ5+i3KHpFKCfd2JeAywuOH9U4qwv8C7+qMTau6i2xkYAhqcmMs59JUXoeFqv/L40aZ9VoxhuDHsdKZbEMePMcui7ClJ7y294IbgFlMep8WFaAOXM3Ula12tnIQlFxeImnleoagbRK+JqqVlljx9W0zF6KwPo9pIUExrNco57C2AP9WgWwyo2scFmfPR8q34jBujz6DQ7RimexmNPYPJW4AnjFBZTfA/dQDpN5DnGNGq1amHIjA9L731yInypEubNZMBaCRjPCGDRjvNXnVCXfAK6hPdRd0HhJs057NKGVMdvZyHXO5kIB4w7SYItkmvymuE+drBYbg+CZrfb0vCLhTJT+cAE6jXG+ByR7Q6skKeQPMW8whOinHJ2+qFJOSqyS/B+LXENMqPOBiPpuyNUzGeKNpEc/cFBzbC0yoOZqvcY2RWAhxXHgXqrDhNY0FXMpFKoV0yWcVRW4ydlh9FXGDvcGUut6DEZUlLO1vFBGQE3hdKaQohtF7PnAPq1hXzv3jCMKzEJKan93CnVXUjqa4sJnqTvaqYoYqZFNHNGch1W4SIIlTs2mVXtN5eQ8+sVOM06dLk09Sc0RQKaC8lhCj23OLviJYNiV3r2vdMceqvabS37FUFfsFMKOTKqU8ra45elsU5E6LGBWXv0p1Z1GRdsDehbp0mid+ux1wWYIO7Z26wuIQVXFdyu+yiKfOUWxG7q1gUZYoFqsZW1vK3Q/5T6qsd/fKj3drr5N84kL4DzH32wpk0BQkIhYAAAAAElFTkSuQmCC";
} else {
audioElement.addEventListener("ended", autoNext);
eventAdded = true;
autoplayBtn.classList.toggle("rot");
document.querySelector("#autoplayImg").src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADHElEQVR4nO2aTUtUYRTHf6FRajqRZtAqy10foHXQ2yKkUpQy2qrTlyizEL9CoBTETCOttLYqlFlU0MJI3FouwpeCaDFNNy6cgcvDufnce597x2r+cGAYPS//5+Wc8xwG6qijjixxGOgDxoBpYB54I+J/LsnfeoEOdhlywE1gCfgFeJZSARaBvNioGQ4Cd4GvEYIPk23ZqVzWJK4C6w4ImPIZGMiCQAvwwGJ1Z4BxYAS4JjIi381a7OIU0JzmRX4d4rgMPALOAA0Wtvz/OQcURFez+SqNhOCT+BDi0A/mWALbxyWbabaXXZJpCdmJL8BFV06AHmBD8bPk6phpd+Jjwl0IQxewovibdJGdNBKdpIfOEDL9SerEunKc0tgJbWc2lNTcFsfYPWVVXN4JmzvjGTIaZze2leyUNUpGDFtRq39eqRO2R2qfZS2xTc1lI5bhKAaWDGW/2NniJPAeOI0bFIxYXtgqtktnGlT2K3YUIlW9GVnVJDhvxFKxLZJ9Su/UEJOILz8kcRyISaRR6c2u2CiOGUr+qpKASFU+ATeAPTHIPIuTvaYNpXFHRIItx6mINicMG49tlBaSZAkLIp68JB8CR2Nm0XkbpXeG0mAKRKryHbgF7N/B5nVD7+1/RWThXzlapb/gshdtlO4YSrO7MP3etlHqVQpiYw0L4l7gm2HzctwW5WwNW5QLRiwVidEKiwlaeNdNY9GI5XkU5RFDuRxhZV228d3ATyOWoSgGcsrDys9mWeOJEcNmnOeu2Tx68vzMCpcU/37xjIycPPiDhjZkMJA2TsjqB32vAa1xDQ4oq7KS8jjoCLCq+PXfSYkwFUKmK6WdWFX83XdhvFkGyp5yzHoc34lNxc9LoMmVkw4ZKGutRylh0etWspMnshyl+EUhY05XgnWmIIMCm3amUSp2UakTXmAnnJMIHrPJHbpbvy96Kh1rXt4zg/J5QhpAs3fS7kQTGaBfSc0uZM1FdoqKNplmbDkgsCnFrjVrEiahYZkAml3zn6QiDeBQ3Cl7mmiXt8KojGzmAj8YmJPvRiXVHko1kjrqqIMgfgPzgEBI9NRixQAAAABJRU5ErkJggg==";
}
});


// Helper function to create a reverb buffer with the specified room size
function createReverbBuffer(context, roomSize) {
// Create an impulse response buffer with the specified room size
var impulseResponse = context.createBuffer(2, context.sampleRate * roomSize, context.sampleRate);
var leftChannel = impulseResponse.getChannelData(0);
var rightChannel = impulseResponse.getChannelData(1);

// Generate white noise
for (var i = 0; i < impulseResponse.length; i++) {
leftChannel[i] = (Math.random() * 2) - 1;
rightChannel[i] = (Math.random() * 2) - 1;
}

return impulseResponse;
}


//
//
// Create the filters
var lowFilter = context.createBiquadFilter();
lowFilter.type = "lowshelf";
lowFilter.frequency.value = 250;

var lowMidFilter = context.createBiquadFilter();
lowMidFilter.type = "peaking";
lowMidFilter.frequency.value = 500;

var highMidFilter = context.createBiquadFilter();
highMidFilter.type = "peaking";
highMidFilter.frequency.value = 1500;

var highFilter = context.createBiquadFilter();
highFilter.type = "highshelf";
highFilter.frequency.value = 3000;

var veryHighFilter = context.createBiquadFilter();
veryHighFilter.type = "highshelf";
veryHighFilter.frequency.value = 6000;

//
//
// Create the filter controls

// EQ controls
let low = document.querySelector("#low");

low.addEventListener("input", () => {
lowFilter.gain.value = low.value;
});
let lowmid = document.querySelector("#lowmid");

lowmid.addEventListener("input", () => {
lowMidFilter.gain.value = lowmid.value;
});
let highmid = document.querySelector("#highmid");

highmid.addEventListener("input", () => {
highMidFilter.gain.value = highmid.value;
});
let high = document.querySelector("#high");

high.addEventListener("input", () => {
highFilter.gain.value = high.value;
});
let veryhigh = document.querySelector("#veryhigh");

veryhigh.addEventListener("input", () => {
veryHighFilter.gain.value = veryhigh.value;
});
// 

//
// Connect the filters in series
source.connect(lowFilter);
lowFilter.connect(lowMidFilter);
lowMidFilter.connect(highMidFilter);
highMidFilter.connect(highFilter);
highFilter.connect(veryHighFilter);
veryHighFilter.connect(context.destination);
// 

window.addEventListener("click",()=>{
context.resume(); 
})
}


});
}
// call here
getTracks();
});
// 



// theme dialog

const themeButton = document.getElementById("theme-button");
themeButton.addEventListener("click", () => {
  const themeDialog = document.getElementById("theme-dialog");
  themeDialog.showModal();

  // theme controls
  let colorPicker1 = document.getElementById('colorPicker1');
let colorPicker2 = document.getElementById('colorPicker2');
let colorPicker3 = document.getElementById('colorPicker3');
let borderColor = document.getElementById('borderColor');
let rootElement = document.querySelector(':root');

function updateBackground() {
  let bg1 = colorPicker1.value;
  let bg2 = colorPicker2.value;
  let bg3 = colorPicker3.value;
  let borderCol = borderColor.value;

  rootElement.style.cssText = `
  --gradient-start: ${bg1};
  --gradient-middle: ${bg2};
  --gradient-end: ${bg3};
  --border: ${borderCol};
`;
console.log(rootElement.style.cssText);
}

colorPicker1.addEventListener('change', updateBackground);
colorPicker2.addEventListener('change', updateBackground);
colorPicker3.addEventListener('change', updateBackground);
borderColor.addEventListener('change', updateBackground);

})
const closeButton = document.getElementById("close-button");

closeButton.addEventListener("click", () => {
  const themeDialog = document.getElementById("theme-dialog");
  themeDialog.close();
})
//

//
//
