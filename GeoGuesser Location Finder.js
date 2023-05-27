// ==UserScript==
// @name         Google Maps Location Finder - GeoGuesser
// @namespace    http://tampermonkey.net/
// @description  Code helps user to find and copy the exact location appearing on the screen in GeoGuesser game
// @author       Radek
// @version      1.0
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// ==/UserScript==


/* Documentation:

 https://nominatim.org/release-docs/develop/api/Reverse/
 https://github.com/facebook/react

*/

async function generateAdress(x, y) // By marking the function as async, you can use the await keyword to pause the execution of the function until the fetch request to the Nominatim API is completed
{
  let w = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${x}&lon=${y}&format=json`);
  return await w.json();
}

function findCords()
{
  let firstElement = document.getElementsByClassName("styles_root__3xbKq")[0]; // Retrieves first element of the class with the current panorama view position coordinates in the Geoguesser game
  let r = Object.keys(firstElement); // Returns an array of keys
  let l = r.find(key => key.startsWith("__reactFiber$")); // Locate a key from React Fiber
  let store = firstElement[l];
  let position = store.return.memoizedProps.panorama.position; // Retrieve the panorama position from Geoguesser code structure

  return ([position.lat(), position.lng()]); // Cords of latitude and longitude
}

function openLocation() // This function opens a new window or tab with the Google Maps link showing the current location from Geoguesser
{
  let [x, y] = findCords();
  if (!x || !y)
  {
     return;
  }

  window.open(`https://www.google.com/maps/place/${x},${y}`);
}

function copyToClipboard(text)
{
  const z = document.createElement("textarea");
  document.body.appendChild(z);
  z.value = text;
  z.select();
  document.execCommand("copy");
  document.body.removeChild(z);
}

function copyGoogleMapsLink()
{
  let [x, y] = findCords();
  if (!x || !y)
  {
     return;
  }
  const link = `https://www.google.com/maps/place/${x},${y}`;
  copyToClipboard(link);
}

let opener = (x) => // Adding a key shortcut to openLocation(); function
{
  if (x.keyCode == 90) // 90 = "z"
  {
     openLocation()
  }
}
document.addEventListener("keydown", opener);

let opener2 = (x) => // Adding a key shortcut to copyGoogleMapsLink(); function
{
  if (x.keyCode == 86) // 86 = "c"
  {
     copyGoogleMapsLink();
  }
}
document.addEventListener("keydown", opener2);
