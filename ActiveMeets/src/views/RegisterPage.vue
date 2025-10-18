<template>
  <div class="container mt-5" style="max-width: 400px;">
    <h2 class="mb-4 text-center">Register New Account</h2>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <form @submit.prevent="handleRegister">
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="email" type="email" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input v-model="password" type="password" class="form-control" required />
        <div class="form-text">Minimum 6 characters.</div>
      </div>
      <button type="submit" class="btn btn-success w-100">Register</button>
    </form>
    <p class="text-center mt-3">
      Already have an account? <router-link to="/login">Login here</router-link>
    </p>
  </div>
</template>

<script>
import { ref } from "vue";
import { register } from "../auth";
import { useRouter } from "vue-router";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const error = ref("");
    const router = useRouter();

    const handleRegister = async () => {
      error.value = "";
      if (password.value.length < 6) {
          error.value = "Password must be at least 6 characters long.";
          return;
      }
      try {
        await register(email.value, password.value);
        // Firebase automatically logs in the user after registration.
        // The router will push to home, and the Cloud Function will assign the role.
        router.push("/");
      } catch (err) {
        // Display user-friendly error messages from Firebase
        if (err.message.includes('auth/email-already-in-use')) {
             error.value = 'That email address is already in use.';
        } else if (err.message.includes('auth/weak-password')) {
             error.value = 'Password is too weak. Choose a stronger one.';
        } else {
             error.value = 'Registration failed. Please try again.';
        }
        console.error("Firebase Registration Error:", err);
      }
    };

    return { email, password, error, handleRegister };
  }
};
</script>