// app.js

const db = firebase.firestore();

// Function to update the leaderboard
function updateLeaderboard() {
  db.collection("users")
    .orderBy("points", "desc")
    .limit(10)
    .get()
    .then((querySnapshot) => {
      const leaderboard = document.getElementById("leaderboard");
      leaderboard.innerHTML = ""; // Clear previous leaderboard
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const listItem = document.createElement("li");
        listItem.textContent = `${data.name} - Points: ${data.points}`;
        leaderboard.appendChild(listItem);
      });
    });
}

// Sign Up Logic
document.getElementById("signupForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("User signed up:", userCredential.user);
      // Save user data in Firestore with initial points
      const user = userCredential.user;
      db.collection("users").doc(user.uid).set({
        name: user.email.split("@")[0], // Use email prefix as user name
        points: 0, // Initial points
        rank: "Newbie"
      });
      alert("Sign Up Successful!");
      toggleAuthUI();
    })
    .catch((error) => {
      console.error("Error signing up:", error.message);
      alert("Error signing up");
    });
});

// Sign In Logic
document.getElementById("signinForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("signinEmail").value;
  const password = document.getElementById("signinPassword").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("User signed in:", userCredential.user);
      alert("Sign In Successful!");
      toggleAuthUI();
    })
    .catch((error) => {
      console.error("Error signing in:", error.message);
      alert("Error signing in");
    });
});

// Sign Out Logic
document.getElementById("signOutBtn").addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
    console.log("User signed out");
    toggleAuthUI();
  }).catch((error) => {
    console.error("Error signing out:", error.message);
  });
});

// Toggle UI based on user authentication state
function toggleAuthUI() {
  const signUpContainer = document.getElementById("signup-container");
  const signInContainer = document.getElementById("signin-container");
  const signOutButton = document.getElementById("signOutBtn");
  const dashboardContainer = document.getElementById("dashboard-container");
  const userNameSpan = document.getElementById("user-name");
  const userPointsSpan = document.getElementById("user-points");
  const userRankSpan = document.getElementById("user-rank");

  if (firebase.auth().currentUser) {
    // User is logged in
    signUpContainer.style.display = "none";
    signInContainer.style.display = "none";
    signOutButton.style.display = "block";
    dashboardContainer.style.display = "block";

    const user = firebase.auth().currentUser;
    userNameSpan.textContent = user.email.split("@")[0]; // Show user name (email prefix)
    
    // Fetch user data (points and rank)
    db.collection("users").doc(user.uid).get().then((doc) => {
      const data = doc.data();
      userPointsSpan.textContent = data.points;
      userRankSpan.textContent = data.rank;
    });

    updateLeaderboard();
  } else {
    // User is logged out
    signUpContainer.style.display = "block";
    signInContainer.style.display = "block";
    signOutButton.style.display = "none";
    dashboardContainer.style.display = "none";
  }
}

// Check auth state and update UI
firebase.auth().onAuthStateChanged((user) => {
  toggleAuthUI();
});

