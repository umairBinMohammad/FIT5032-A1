<template>
  <div class="container mt-5" style="max-width: 400px;">
    <h2 class="mb-4 text-center">Login</h2>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label class="form-label">Username</label>
        <input v-model="username" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input v-model="password" type="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary w-100">Login</button>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { login } from "../auth";
import { users } from "../users";
import { useRouter } from "vue-router";

export default {
  setup() {
    const username = ref("");
    const password = ref("");
    const error = ref("");
    const router = useRouter();

    const handleLogin = () => {
      if (login(username.value, password.value, users)) {
        router.push("/"); // redirect to home
      } else {
        error.value = "Invalid credentials. Try again!";
      }
    };

    return { username, password, error, handleLogin };
  }
};
</script>
