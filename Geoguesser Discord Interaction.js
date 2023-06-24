// ==UserScript==
// @name         Geoguesser Discord Interaction
// @namespace    http://tampermonkey.net/
// @description  Code helps user to find and copy the exact location appearing on the screen in GeoGuesser game
// @author       Radek
// @version      1.0
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js
// ==/UserScript==

/* Documentation:
  https://nominatim.org/release-docs/develop/api/Reverse/
  https://github.com/facebook/react

  This script automatically send you a message with a current location to your chosen discord channel
  All you need to do is put path to the Discord webhook in declaration of let on line 40
*/

async function generate_adress(x, y)
  {
    let z = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${x}&lon=${y}&format=json`);
    return await z.json();
  }

  function find_cords()
  {
    let x = document.getElementsByClassName("styles_root__3xbKq")[0]; // Retrieves first element of the class with the current panorama view position coordinates in the Geoguesser game
    let y = Object.keys(x); // Returns an array of keys
    let z = y.find((key) => key.startsWith("__reactFiber$")); // Locate a key from React Fiber
    let store = x[z];
    let p = store.return.memoizedProps.panorama.position; // Retrieve the panorama position from Geoguesser code structure

    return [p.lat(), p.lng()]; // Coordinates of latitude and longitude
  }

  async function send_cords(coordinates) // function which is sending cords to your discord channel
  {
    const webhook = ''; // here you should put your discord webhook
    const link = `https://www.google.com/maps/place/${coordinates[0]},${coordinates[1]}`;
    const message = `Current location: [Google Maps Link](${link})`;

    try
    {
      await axios.post(webhook, { content: message });
      console.log('Coordinates sent to Discord successfully!');
    }
    catch (error)
    {
      console.error('Error sending coordinates to Discord:', error);
    }
  }

  function copy_clipboard(text) // function that copies the path to the clipboard
  {
    const z = document.createElement("textarea");
    document.body.appendChild(z);
    z.value = text;
    z.select();
    document.execCommand("copy");
    document.body.removeChild(z);
  }

  function copy_link() // function that copies the Google Maps Link
  {
    let [x, y] = find_cords();
    if (!x || !y) {
      return;
    }
    const link = `https://www.google.com/maps/place/${coordinates[0]},${coordinates[1]}`;
    const message = `<${link}>`; // wrap the link in angle brackets to create a clickable link in Discord
    copy_clipboard(link);
  }

  async function getDirection()
  {
    // add your code here to retrieve the current direction from the game
    // replace the following line with your logic to extract the direction
    const currentDirection = "Sample Direction";
    return currentDirection;
  }

  // function to send the coordinates to Discord when "Q" is pressed
  function send_cords_onClick()
  {
    document.addEventListener("keydown", (event) =>
    {
      if (event.keyCode === 81)
      {
        let [x, y] = find_cords();
        if (!x || !y) {
          return;
        }

        send_cords([x, y]); // Send the coordinates to Discord
      }
    });
  }

  // Call the function to send coordinates on "Q" key press
  send_cords_onClick();
