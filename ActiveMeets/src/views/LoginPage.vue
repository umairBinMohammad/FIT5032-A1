// src/LoginPage.vue (Updated)
<template>
  <div class="container mt-5" style="max-width: 400px;">
    <h2 class="mb-4 text-center">Login</h2>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label class="form-label">Email</label> 
        <input v-model="email" type="email" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input v-model="password" type="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary w-100">Login</button>
    </form>
    <p class="text-center mt-3">
      Don't have an account? <router-link to="/register">Register here</router-link>
    </p>
  </div>
</template>

<script>
import { ref } from "vue";
import { login } from "../auth"; // Use the new async login function
import { useRouter } from "vue-router";

export default {
  setup() {
    const email = ref(""); // Changed from username
    const password = ref("");
    const error = ref("");
    const router = useRouter();

    const handleLogin = async () => {
      error.value = ""; // Clear previous errors
      try {
        // Firebase login is asynchronous
        await login(email.value, password.value); 
        router.push("/"); // redirect to home on success
      } catch (err) {
        // Firebase errors are often detailed; display a simple message
        error.value = "Login failed. Check your email and password.";
        console.error("Firebase Login Error:", err);
      }
    };

    // Return email instead of username
    return { email, password, error, handleLogin }; 
  }
};
</script>