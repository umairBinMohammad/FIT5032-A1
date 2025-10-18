<template>
  <section class="py-5">
    <div class="container">
      <div class="row g-4">
        <div class="col-12">
          <h2 class="h3 mb-3">Create New Activity</h2>
          <div class="card shadow-sm">
            <div class="card-body">
              <form novalidate @submit.prevent="onSubmit">
                <div class="mb-3">
                  <label class="form-label">Activity Name</label>
                  <input
                    v-model.trim="form.name"
                    type="text"
                    class="form-control"
                    :class="{'is-invalid': errors.name}"
                    @blur="validateName(true)"
                    @input="validateName(false)"
                    required
                  />
                  <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Location</label>
                  <input
                    v-model.trim="form.location"
                    type="text"
                    class="form-control"
                    :class="{'is-invalid': errors.location}"
                    @blur="validateLocation(true)"
                    @input="validateLocation(false)"
                    required
                  />
                  <div v-if="errors.location" class="invalid-feedback">{{ errors.location }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Level</label>
                  <input
                    v-model.trim="form.level"
                    type="text"
                    class="form-control"
                    :class="{'is-invalid': errors.level}"
                    @blur="validateLevel(true)"
                    @input="validateLevel(false)"
                    required
                  />
                  <div v-if="errors.level" class="invalid-feedback">{{ errors.level }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Age</label>
                  <input
                    v-model.trim="form.age"
                    type="text"
                    class="form-control"
                    :class="{'is-invalid': errors.age}"
                    @blur="validateAge(true)"
                    @input="validateAge(false)"
                    required
                  />
                  <div v-if="errors.age" class="invalid-feedback">{{ errors.age }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Accessibility</label>
                  <input
                    v-model.trim="form.accessibility"
                    type="text"
                    class="form-control"
                    :class="{'is-invalid': errors.accessibility}"
                    @blur="validateAccessibility(true)"
                    @input="validateAccessibility(false)"
                    required
                  />
                  <div v-if="errors.accessibility" class="invalid-feedback">{{ errors.accessibility }}</div>
                </div>
                <button class="btn btn-accent w-100">Create Activity</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row g-4 mt-3">
        <div class="col-12">
          <h3 class="h5 mb-2">Saved Activities</h3>
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0">
              <thead>
                <tr>
                  <th role="button" @click="setSort('name')">
                    Name
                    <small v-if="sortKey==='name'">{{ sortAsc ? '▲' : '▼' }}</small>
                  </th>
                  <th role="button" @click="setSort('location')">
                    Location
                    <small v-if="sortKey==='location'">{{ sortAsc ? '▲' : '▼' }}</small>
                  </th>
                  <th role="button" @click="setSort('level')">
                    Level
                    <small v-if="sortKey==='level'">{{ sortAsc ? '▲' : '▼' }}</small>
                  </th>
                  <th role="button" @click="setSort('age')">
                    Age
                    <small v-if="sortKey==='age'">{{ sortAsc ? '▲' : '▼' }}</small>
                  </th>
                  <th role="button" @click="setSort('accessibility')">
                    Accessibility
                    <small v-if="sortKey==='accessibility'">{{ sortAsc ? '▲' : '▼' }}</small>
                  </th>
                  <th></th>
                </tr>
                <tr>
                  <th>
                    <input v-model.trim="filters.name" type="text" class="form-control form-control-sm" placeholder="Search name" />
                  </th>
                  <th>
                    <input v-model.trim="filters.location" type="text" class="form-control form-control-sm" placeholder="Search location" />
                  </th>
                  <th>
                    <input v-model.trim="filters.level" type="text" class="form-control form-control-sm" placeholder="Search level" />
                  </th>
                  <th>
                    <input v-model.trim="filters.age" type="text" class="form-control form-control-sm" placeholder="Search age" />
                  </th>
                  <th>
                    <input v-model.trim="filters.accessibility" type="text" class="form-control form-control-sm" placeholder="Search accessibility" />
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="a in pagedActivities" :key="a.id">
                  <td><span v-html="sanitize(a.name)"></span></td>
                  <td><span v-html="sanitize(a.location)"></span></td>
                  <td><span v-html="sanitize(a.level)"></span></td>
                  <td><span v-html="sanitize(a.age)"></span></td>
                  <td><span v-html="sanitize(a.accessibility)"></span></td>
                  <td>
                    <button class="btn btn-sm btn-outline-danger" @click="removeActivity(a.id)">
                      Remove
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredActivities.length === 0">
                  <td colspan="6" class="text-muted small">No matching activities.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-2" v-if="filteredActivities.length">
            <div class="small text-muted">
              Showing {{ startItem }}–{{ endItem }} of {{ filteredActivities.length }}
            </div>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-secondary" :disabled="page===1" @click="page--">Prev</button>
              <button class="btn btn-outline-secondary" :disabled="page>=totalPages" @click="page++">Next</button>
            </div>
          </div>
          <div v-if="activities.length" class="d-grid mt-2">
            <button class="btn btn-outline-secondary btn-sm" @click="clearAll">Clear All</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import DOMPurify from 'dompurify';

const activities = ref([])
const STORAGE_KEY = 'activemeets_activities_v1'

const form = ref({
  name: '',
  location: '',
  level: '',
  age: '',
  accessibility: '',
})

const errors = ref({
  name: null,
  location: null,
  level: null,
  age: null,
  accessibility: null,
})

onMounted(() => {
  activities.value = loadActivities()
})

// Sorting, filtering, pagination state
const sortKey = ref('name')
const sortAsc = ref(true)
const page = ref(1)
const perPage = 10
const filters = ref({ name: '', location: '', level: '', age: '', accessibility: '' })

watch(filters, () => { page.value = 1 }, { deep: true })
watch(activities, () => { page.value = 1 })

function setSort(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

const filteredActivities = computed(() => {
  const f = filters.value
  const toText = (v) => (v ?? '').toString().toLowerCase()
  return activities.value.filter(a =>
    toText(a.name).includes(toText(f.name)) &&
    toText(a.location).includes(toText(f.location)) &&
    toText(a.level).includes(toText(f.level)) &&
    toText(a.age).includes(toText(f.age)) &&
    toText(a.accessibility).includes(toText(f.accessibility))
  )
})

const sortedActivities = computed(() => {
  const list = [...filteredActivities.value]
  const key = sortKey.value
  list.sort((a, b) => {
    const av = a[key] ?? ''
    const bv = b[key] ?? ''
    // numeric compare if both are numeric
    const an = parseFloat(av)
    const bn = parseFloat(bv)
    let cmp
    if (!Number.isNaN(an) && !Number.isNaN(bn)) {
      cmp = an - bn
    } else {
      cmp = av.toString().localeCompare(bv.toString())
    }
    return sortAsc.value ? cmp : -cmp
  })
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(sortedActivities.value.length / perPage)))
const startItem = computed(() => (sortedActivities.value.length === 0 ? 0 : (page.value - 1) * perPage + 1))
const endItem = computed(() => Math.min(sortedActivities.value.length, page.value * perPage))
const pagedActivities = computed(() => {
  const p = Math.min(page.value, totalPages.value)
  const start = (p - 1) * perPage
  return sortedActivities.value.slice(start, start + perPage)
})

const validateField = (field, message, blur) => {
  if (form.value[field].trim().length === 0) {
    if (blur) errors.value[field] = message
  } else {
    errors.value[field] = null
  }
}

const validateName = (blur) => validateField('name', 'Name is required.', blur)
const validateLocation = (blur) => validateField('location', 'Location is required.', blur)
const validateLevel = (blur) => validateField('level', 'Level is required.', blur)
const validateAge = (blur) => validateField('age', 'Age is required.', blur)
const validateAccessibility = (blur) => validateField('accessibility', 'Accessibility is required.', blur)

function validateForm() {
  validateName(true)
  validateLocation(true)
  validateLevel(true)
  validateAge(true)
  validateAccessibility(true)
  return Object.values(errors.value).every(e => e === null)
}

const sanitize = (dirty) => {
  if (dirty === null || typeof dirty === 'undefined') {
    return '';
  }
  return DOMPurify.sanitize(dirty, { USE_PROFILES: { html: true } });
};

function onSubmit() {
  if (!validateForm()) {
    return
  }

  const sanitizedForm = {
    name: sanitize(form.value.name),
    location: sanitize(form.value.location),
    level: sanitize(form.value.level),
    age: sanitize(form.value.age),
    accessibility: sanitize(form.value.accessibility),
  };

  const newActivity = { id: crypto.randomUUID(), ...sanitizedForm }
  const allActivities = loadActivities()
  allActivities.push(newActivity)
  saveActivities(allActivities)
  activities.value = allActivities

  // Reset the form
  form.value = { name: '', location: '', level: '', age: '', accessibility: '' }
  errors.value = { name: null, location: null, level: null, age: null, accessibility: null }
}

function loadActivities() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveActivities(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function removeActivity(id) {
  const next = activities.value.filter(a => a.id !== id)
  saveActivities(next)
  activities.value = next
}

function clearAll() {
  saveActivities([])
  activities.value = []
}
</script>