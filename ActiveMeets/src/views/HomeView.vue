<template>
  <section class="py-5">
    <div class="container">
      <!-- Hero -->
      <div class="row align-items-center g-4">
        <div class="col-12 col-lg-6">
          <h1 class="display-5 fw-bold">Welcome to <span class="text-nowrap">ActiveMeets</span></h1>
          <p class="lead text-muted">
            Find local sports and community activities across Melbourne. Connect, move, belong.
          </p>
          <div class="d-flex gap-2">
            <RouterLink
              to="/activity"
              class="btn btn-lg d-flex align-items-center justify-content-center"
              style="background: linear-gradient(90deg, #ff9800 0%, #ffb74d 100%); color: #fff; border: none; box-shadow: 0 2px 8px rgba(255,152,0,0.15); font-weight: 600; letter-spacing: 0.5px; transition: background 0.2s; min-width: 220px;"
              @mouseover="event.target.style.background='linear-gradient(90deg, #ffb74d 0%, #ff9800 100%)'"
              @mouseleave="event.target.style.background='linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)'"
            >
              <i class="bi bi-search me-2"></i>
              <span class="w-100 text-center">Find an Activity</span>
            </RouterLink>
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <!-- Simple responsive placeholder -->
          <div class="ratio ratio-16x9 rounded-3" style="background:#fff; border:1px dashed #ffb36a;">
            <div class="d-flex flex-column justify-content-center align-items-center text-muted">
              <div class="fw-semibold">Placeholder Picture</div>
              <small>Resizable</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Responsive cards -->
      <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3 mt-4">
        <div class="col" v-for="n in 3" :key="n">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Featured Highlight {{ n }}</h5>
              <p class="card-text text-muted">
                Responsive (bootstrap).
              </p>
            </div>
          </div>
        </div>
      </div>

      
      <div class="alert alert-light border mt-4">
        Resizeable.
      </div>
    </div>
  </section>
</template>

<script setup>

</script>
