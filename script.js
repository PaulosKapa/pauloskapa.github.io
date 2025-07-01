const AVAILABLE_POSTS = 3;
const AVAILABLE_LIKES = 10;
const EXPIRE_TIME = 10;
if (isNaN(getCookie("hello")) || getCookie("hello") == null || !getCookie("hello")) {
  notification(`
  <div style="font-family: 'Arial', sans-serif;">
    <h3 style="color: #2c3e50;">
      Hello! Welcome to the MessageBoard
    </h3>
      <span style="display: inline-block;  font-weight: bold;">Likes:</span>
      You get <span style="color: #e74c3c; font-weight: bold;">${AVAILABLE_LIKES}</span> likes. 
      After that you'll wait <span style="color: #e74c3c;">${EXPIRE_TIME} minutes</span>.
    </p>
    <p style="color: #34495e;">
      <span style="display: inline-block;  font-weight: bold;">Posts:</span>
      You get <span style="color: #2ecc71; font-weight: bold;">${AVAILABLE_POSTS}</span> posts. 
      After that you'll wait <span style="color: #2ecc71;">${EXPIRE_TIME} minutes</span>.
    </p>
  </div>
`);
  setCookie("hello", 1, 1315490);
}


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4T51PORKsk1YRLKf1agOENMW5w80NQko",
  authDomain: "text-project-6c3e3.firebaseapp.com",
  databaseURL: "https://text-project-6c3e3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "text-project-6c3e3",
  storageBucket: "text-project-6c3e3.firebasestorage.app",
  messagingSenderId: "854172509038",
  appId: "1:854172509038:web:935a11278251e6614dd77f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const form = document.getElementById("myForm");
const input = document.getElementById("textInput");
const messagesContainer = document.getElementById("messagesContainer");
var lastPost = 0;
var date;

form.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent page reload
  let sanitized;
  let value = input.value.trim();
  let original = value;

  // Step 1: English cleaning
  value = filterEng.clean(value);
  if (value === original) {
    // Step 2: Greek filtering
    value = filterGr.filter(original);

    if (value === original) {
      // Step 3: Convert to Greek and sanitize
      const greekConverted = greekUtils.toGreek(original);
      const sanitized = filterGr.filter(greekConverted);

      if (sanitized !== greekConverted) {
        // If something changed, reapply Greek filter
        value = filterGr.filter(greekUtils.toGreek(original));
      }
    }
  }


  console.log(sanitized);

  if (value) {
    let readableTime;
    date = Date.now();
    if (getCookie("message") == AVAILABLE_POSTS) {

      notification(`Your next post will be available at: ${getCookie("postExpires")}`, "warning");
      return;
    }
    else {
      let numOfPosts = getCookie("message")
      console.log(parseInt(numOfPosts))
      if (isNaN(numOfPosts)) {
        numOfPosts = 0;
      }
      setCookie("message", parseInt(numOfPosts) + 1, EXPIRE_TIME);
      if (getCookie("message") == AVAILABLE_POSTS) {
        let d = new Date
        let time = d.setTime(d.getTime() + (EXPIRE_TIME * 60 * 1000));
        setCookie("postExpires", new Date(time).toLocaleTimeString(), EXPIRE_TIME);
      }
    }
    // Write to Firebase Realtime Database under "messages/"
    set(ref(db, 'messages/' + date), {
      text: value,
      likes: 0
    })
      .then(() => {
        notification("Data written successfully!", "success");
        input.value = ""; // clear input
      })
      .catch((error) => {
        console.error("Write failed:", error);
      });

    lastPost = date;
  }
});

// Listen for real-time updates
const messagesRef = ref(db, 'messages/');
onValue(messagesRef, (snapshot) => {
  const data = snapshot.val();
  displayMessages(data);
});
let allMessages = null;
let currentSort = "newest";

// Firebase real-time update handler
onValue(messagesRef, (snapshot) => {
  allMessages = snapshot.val();
  displayMessages(allMessages, currentSort);
});

// Custom dropdown logic
const selector = document.getElementById("sortSelector");
const dropdown = selector.querySelector(".dropdown-options");

selector.addEventListener("click", () => {
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
});

dropdown.querySelectorAll("div").forEach(option => {
  option.addEventListener("click", () => {
    const newSort = option.getAttribute("data-sort");

    currentSort = newSort;
    displayMessages(allMessages, currentSort);

    dropdown.style.display = "none";
  });
});

// Optional: close dropdown if clicked outside
document.addEventListener("click", (e) => {
  if (!selector.contains(e.target)) {
    dropdown.style.display = "none";
  }
});
function displayMessages(messages, sortType = "newest") {
  messagesContainer.innerHTML = ''; // Clear previous messages

  if (!messages) {
    messagesContainer.innerHTML = '<p>No messages yet</p>';
    return;
  }

  // Convert messages object to array
  let messagesArray = Object.entries(messages).map(([key, value]) => ({
    id: key,
    ...value
  }));

  // Sorting logic
  switch (sortType) {
    case "oldest":
      messagesArray.sort((a, b) => parseInt(a.id) - parseInt(b.id));
      break;
    case "newest":
      messagesArray.sort((a, b) => parseInt(b.id) - parseInt(a.id));
      break;
    case "mostLiked":
      messagesArray.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      break;
    case "leastLiked":
      messagesArray.sort((a, b) => (a.likes || 0) - (b.likes || 0));
      break;
  }

  // Display each message
  messagesArray.forEach(message => {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `
<div class="card" style="width: 18rem; height: 100%; margin: 15px;">
  <div class="card-body">
    <p class="card-text message-content" style="font-family: _Chillax_Variable; font-size:x-large;">${message.text}</p>
    <div class="d-flex align-items-center">
      <button class="btn" id="${message.id}">
        <svg class="icon" xmlns="heart.svg" width="20.503" height="20.625" viewBox="0 0 17.503 15.625">
          <path id="Fill"
            d="M8.752,15.625h0L1.383,8.162a4.824,4.824,0,0,1,0-6.762,4.679,4.679,0,0,1,6.674,0l.694.7.694-.7a4.678,4.678,0,0,1,6.675,0,4.825,4.825,0,0,1,0,6.762L8.752,15.624ZM4.72,1.25A3.442,3.442,0,0,0,2.277,2.275a3.562,3.562,0,0,0,0,5l6.475,6.556,6.475-6.556a3.563,3.563,0,0,0,0-5A3.443,3.443,0,0,0,12.786,1.25h-.01a3.415,3.415,0,0,0-2.443,1.038L8.752,3.9,7.164,2.275A3.442,3.442,0,0,0,4.72,1.25Z"
            transform="translate(0 0)"></path>
        </svg>
      </button>
      <span class="like-count" style="font-family: monospace, monospace;">${message.likes}</span>
    </div>
  </div>
</div>`;
    messagesContainer.appendChild(messageElement);
    const button = document.getElementById(message.id);
    button.addEventListener('click', () => {
      incrementLike(message.id, message.likes || 0);
    });
  });
}


function incrementLike(id, likes) {
  if (getCookie("likes") === "") {
    setCookie("likes", AVAILABLE_LIKES, EXPIRE_TIME); // 10-minute expiry

  }

  if (getCookie("likes") > 0) {
    const updates = {};
    updates['/messages/' + id + '/likes'] = likes += 1;
    update(ref(db), updates);
    setCookie("likes", getCookie("likes") - 1, EXPIRE_TIME);
    if (getCookie("likes") == 0) {
      let d = new Date
      let time = d.setTime(d.getTime() + (EXPIRE_TIME * 60 * 1000));
      setCookie("likesExpires", new Date(time).toLocaleTimeString(), 10);
    }
    return;
  }

  notification(`Next likes will be available at: ${getCookie("likesExpires")}`, "warning")
}

function setCookie(cname, cvalue, expMins) {
  const d = new Date();
  d.setTime(d.getTime() + (expMins * 60 * 1000));

  let expires = "expires=" + d.toUTCString();

  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function notification(titleName, iconName) {
  return Swal.fire({
    title: titleName,
    icon: iconName,
    toast: true,
    position: "top-end",
    timer: 5000,
    timerProgressBar: true,

  });
}

