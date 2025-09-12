// src/auth.js
import { reactive } from "vue";

const savedUser = JSON.parse(localStorage.getItem("activeUser"));

export const authState = reactive({
  isAuthenticated: !!savedUser,
  user: savedUser || null
});

export function login(username, password, users) {
  const foundUser = users.find(
    (u) => u.username === username && u.password === password
  );

  if (foundUser) {
    authState.isAuthenticated = true;
    authState.user = foundUser;
    localStorage.setItem("activeUser", JSON.stringify(foundUser));
    return true;
  }

  return false;
}

export function logout() {
  authState.isAuthenticated = false;
  authState.user = null;
  localStorage.removeItem("activeUser");
}
