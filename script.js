import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCUZA1xssODAhz_2-zH3Lj0YLLdr962IJw",
  authDomain: "letterapp-b8be3.firebaseapp.com",
  projectId: "letterapp-b8be3",
  storageBucket: "letterapp-b8be3.appspot.com",
  messagingSenderId: "296010334728",
  appId: "1:296010334728:web:ea1e1e4014cafb4c0a87bd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Check which page we're on
if (window.location.pathname.includes('view.html')) {
  // View letter logic
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const letterBox = document.getElementById('letter');

  if (!id) {
    letterBox.textContent = "❌ No letter ID provided.";
  } else {
    try {
      const docRef = doc(db, "letters", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        letterBox.textContent = docSnap.data().content;
      } else {
        letterBox.textContent = "❌ Letter not found.";
      }
    } catch (error) {
      console.error("Error getting letter:", error);
      letterBox.textContent = "❌ Could not load the letter.";
    }
  }
} else {
  // Index page logic
  const submitBtn = document.getElementById('submitBtn');
  const letterInput = document.getElementById('letter');
  const linkDiv = document.getElementById('link');
  
  submitBtn.addEventListener('click', async () => {
    const content = letterInput.value.trim();
    
    if (!content) {
      linkDiv.innerHTML = `<p class="text-red-600">✏️ Please write something before sending.</p>`;
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "letters"), {
        content: content,
        createdAt: new Date()
      });
      
      linkDiv.innerHTML = `
        <p class="text-green-700">✅ Letter sent successfully!</p>
        <a href="view.html?id=${docRef.id}" class="text-blue-600 underline">📄 View your letter</a>
        <p class="mt-2 text-sm text-gray-600">Share this link with others to let them read your letter</p>
      `;
      
      letterInput.value = '';
    } catch (error) {
      console.error("Error adding letter:", error);
      linkDiv.innerHTML = `<p class="text-red-600">❌ Failed to send your letter. Try again later.</p>`;
    }
  });
}
