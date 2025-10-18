import { reactive } from "vue";
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { doc, getDoc, setDoc, getFirestore } from "firebase/firestore"; // <--- ADD setDoc
import { auth, app } from "./firebase"; // Import Auth AND App instance

const db = getFirestore(app); // Ensure db is initialized

export const authState = reactive({
  isAuthenticated: false,
  user: null, // Will hold { uid, email, role }
  isLoading: true,
});

// Role Fetching Function
async function fetchUserRole(uid) {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    
    // Default to 'client' if document doesn't exist (until Cloud Function runs)
    if (userDoc.exists()) {
      return userDoc.data().role || 'client'; 
    }
    return 'client'; 
  } catch (error) {
    console.error("Error fetching user role:", error);
    return 'client'; // Fallback to safe role
  }
}

// Firebase Registration function
export async function register(email, password) {
  try {
    // 1. Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Client-Side: Write the default role to Firestore immediately
    const defaultUserData = {
        email: user.email,
        role: 'client', // Default role assigned directly by the client
        createdAt: new Date().toISOString()
    };
    
    // Write the new user document to Firestore using the user's UID
    await setDoc(doc(db, "users", user.uid), defaultUserData);
    
    // The onAuthStateChanged listener will automatically fetch this new role

  } catch (error) {
    throw new Error(error.code); // Throw the Firebase error code
  }
}

onAuthStateChanged(auth, async (user) => {
  authState.isLoading = true;
  if (user) {
    const role = await fetchUserRole(user.uid); // Fetch the role
    
    authState.isAuthenticated = true;
    authState.user = {
      uid: user.uid,
      email: user.email,
      role: role // Attach the fetched role
    }; 
  } else {
    authState.isAuthenticated = false;
    authState.user = null;
  }
  authState.isLoading = false;
});

// 3. Firebase Login
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Successful login handled by onAuthStateChanged listener
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}

// 4. Firebase Logout
export async function logout() {
  try {
    await signOut(auth);
    // Successful logout handled by onAuthStateChanged listener
  } catch (error) {
    console.error("Logout failed:", error);
  }
}