import { reactive } from "vue";
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { auth } from "./firebase";

export const authState = reactive({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  role: null,
});

// 1. Listen for auth state changes and update reactive state
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in.
    authState.isAuthenticated = true;
    authState.user = {
      uid: user.uid,
      email: user.email,
     
    }; 
  } else {
    // User is signed out.
    authState.isAuthenticated = false;
    authState.user = null;
  }
  authState.isLoading = false;
});

// 2. Firebase Registration
export async function register(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Successful registration handled by onAuthStateChanged listener
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}

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