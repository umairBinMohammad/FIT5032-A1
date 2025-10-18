<template>
  <div class="min-vh-100 d-flex flex-column">
    <nav class="navbar navbar-expand-lg navbar-dark" style="background:#ff7a00;">
      <div class="container">
        <RouterLink class="navbar-brand fw-bold" to="/">ActiveMeets</RouterLink>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div id="mainNav" class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/">Home</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/client/activities">Find an Activity</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/manager/activities">Host an Activity</RouterLink>
            </li>
            <li class="nav-item"><span class="nav-link disabled">For Clubs</span></li>
            <li class="nav-item"><span class="nav-link disabled">About Us</span></li>
            <li class="nav-item"><span class="nav-link disabled">Contact</span></li>
            <li v-if="userEmail" class="nav-item">
              <span class="nav-link fw-bold">{{ userEmail }}</span>
            </li>
            <li v-if="!userEmail" class="nav-item">
              <RouterLink class="nav-link" to="/login">Login</RouterLink>
            </li>
            <li v-else class="nav-item d-flex align-items-center">
              <button class="nav-link btn btn-link fw-bold" @click="handleLogout" style="padding:0;">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="flex-grow-1 bg-light">
      <RouterView />
    </main>

    <footer class="py-4 text-center small text-muted bg-white border-top">
      © {{ new Date().getFullYear() }} ActiveMeets
    </footer>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { computed } from 'vue'
import { authState, logout } from './auth'

const userEmail = computed(() => authState.isAuthenticated ? authState.user?.email : null)

const handleLogout = async () => {
  await logout()
}
</script>

<style>
.badge-accent {
  background: #ffeedb;
  color: #ff7a00;
  border: 1px solid #ffd3a8;
}
.btn-accent {
  background: #ff7a00;
  color: #fff;
}
.btn-accent:hover {
  background: #e66e00;
  color: #fff;
}
</style>