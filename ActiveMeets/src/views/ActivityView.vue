<template>
  <section class="py-5">
    <div class="container">
      <div class="row g-4">
        <div class="col-12 col-lg-7">
          <h2 class="h3 mb-3">Browse Activities</h2>
          <div class="input-group mb-3">
            <span class="input-group-text">Search</span>
            <input
              v-model.trim="query"
              type="text"
              class="form-control"
              placeholder="Type to filter by name or location"
              @input="filterActivities"
            />
          </div>
          <div class="row row-cols-1 row-cols-sm-2 g-3">
            <div class="col" v-for="a in filtered" :key="a.id">
              <div class="card h-100">
                <div class="card-body">
                  <h5 class="card-title">{{ a.name }}</h5>
                  <ul class="list-unstyled small text-muted mb-0">
                    <li><strong>Location:</strong> {{ a.location }}</li>
                    <li><strong>Level:</strong> {{ a.level }}</li>
                    <li><strong>Age:</strong> {{ a.age }}</li>
                    <li><strong>Accessibility:</strong> {{ a.accessibility }}</li>
                  </ul>
                  <div class="mt-2">
                    <span class="fw-bold">Rating:</span>
                    {{ getAverageRating(a.id) }} / 5
                  </div>
                </div>
                <div class="card-footer bg-white d-flex justify-content-between align-items-center">
                  <button class="btn btn-sm btn-outline-secondary" @click="selectActivity(a)">
                    Select
                  </button>
                  <div class="d-flex align-items-center">
                    <label class="me-2 mb-0 small">Rate:</label>
                    <select class="form-select form-select-sm w-auto" @change="submitRating(a.id, $event.target.value)">
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="loading" class="text-muted mt-3 small">Loading activities…</div>
          <div v-else-if="filtered.length === 0" class="text-muted mt-3 small">No matches.</div>
        </div>
        <div class="col-12 col-lg-5">
          <div class="card shadow-sm">
            <div class="card-body">
              <h2 class="h4 mb-3">Register Your Interest</h2>
              <form novalidate @submit.prevent="onSubmit">
                <div class="mb-3">
                  <label class="form-label">Activity</label>
                  <select
                    v-model="form.activityId"
                    class="form-select"
                    :class="{'is-invalid': errors.activityId}"
                    @blur="validateActivity(true)"
                    @change="validateActivity(false)"
                    required
                  >
                    <option value="">Select an activity…</option>
                    <option v-for="a in activities" :key="a.id" :value="a.id">
                      {{ a.name }} — {{ a.location }}
                    </option>
                  </select>
                  <div v-if="errors.activityId" class="invalid-feedback">{{ errors.activityId }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Full Name</label>
                  <input
                    v-model.trim="form.name"
                    type="text"
                    class="form-control"
                    :class="{'is-invalid': errors.name}"
                    placeholder="Jane Doe"
                    @blur="validateName(true)"
                    @input="validateName(false)"
                    required
                  />
                  <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input
                    v-model.trim="form.email"
                    type="email"
                    class="form-control"
                    :class="{'is-invalid': errors.email}"
                    placeholder="jane@example.com"
                    @blur="validateEmail(true)"
                    @input="validateEmail(false)"
                    required
                  />
                  <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Age</label>
                  <input
                    v-model.number="form.age"
                    type="number"
                    min="5"
                    max="120"
                    class="form-control"
                    :class="{'is-invalid': errors.age}"
                    placeholder="e.g. 21"
                    @blur="validateAge(true)"
                    @input="validateAge(false)"
                    required
                  />
                  <div v-if="errors.age" class="invalid-feedback">{{ errors.age }}</div>
                </div>
                <button class="btn btn-accent w-100">Submit</button>
                <div class="form-text mt-2">
                  Validations: required fields (Activity, Name, Email), email format, and age number range.
                </div>
              </form>
            </div>
          </div>
          <div class="card mt-3">
            <div class="card-body">
              <h3 class="h5 mb-2">Your Saved Registrations</h3>
              <p class="text-muted small mb-2">Stored in localStorage (persists beyond the session).</p>
              <div v-if="registrations.length === 0" class="text-muted small">No registrations yet.</div>
              <div v-else class="table-responsive">
                <table class="table table-sm align-middle mb-0">
                  <thead>
                    <tr>
                      <th role="button" @click="setRegSort('activity')">
                        Activity
                        <small v-if="regSortKey==='activity'">{{ regSortAsc ? '▲' : '▼' }}</small>
                      </th>
                      <th role="button" @click="setRegSort('name')">
                        Name
                        <small v-if="regSortKey==='name'">{{ regSortAsc ? '▲' : '▼' }}</small>
                      </th>
                      <th role="button" @click="setRegSort('email')">
                        Email
                        <small v-if="regSortKey==='email'">{{ regSortAsc ? '▲' : '▼' }}</small>
                      </th>
                      <th role="button" @click="setRegSort('age')">
                        Age
                        <small v-if="regSortKey==='age'">{{ regSortAsc ? '▲' : '▼' }}</small>
                      </th>
                      <th></th>
                    </tr>
                    <tr>
                      <th><input v-model.trim="regFilters.activity" class="form-control form-control-sm" placeholder="Search activity" /></th>
                      <th><input v-model.trim="regFilters.name" class="form-control form-control-sm" placeholder="Search name" /></th>
                      <th><input v-model.trim="regFilters.email" class="form-control form-control-sm" placeholder="Search email" /></th>
                      <th><input v-model.trim="regFilters.age" class="form-control form-control-sm" placeholder="Search age" /></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="r in pagedRegistrations" :key="r.id">
                      <td><span v-html="findActivityName(r.activityId)"></span></td>
                      <td><span v-html="sanitize(r.name)"></span></td>
                      <td><span v-html="sanitize(r.email)"></span></td>
                      <td><span v-html="sanitize(r.age)"></span></td>
                      <td>
                        <button class="btn btn-sm btn-outline-danger" @click="removeRegistration(r.id)">
                          Remove
                        </button>
                      </td>
                    </tr>
                    <tr v-if="filteredRegistrations.length === 0">
                      <td colspan="5" class="text-muted small">No matching registrations.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="d-flex justify-content-between align-items-center mt-2" v-if="filteredRegistrations.length">
                <div class="small text-muted">
                  Showing {{ regStartItem }}–{{ regEndItem }} of {{ filteredRegistrations.length }}
                </div>
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-secondary" :disabled="regPage===1" @click="regPage--">Prev</button>
                  <button class="btn btn-outline-secondary" :disabled="regPage>=regTotalPages" @click="regPage++">Next</button>
                </div>
              </div>
              <div v-if="registrations.length" class="d-grid mt-2">
                <button class="btn btn-outline-secondary btn-sm" @click="clearAll">Clear All</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { fetchActivities } from '../data/activities'
import { authState } from "../auth";
import DOMPurify from 'dompurify'; // Import DOMPurify
// --------- Dynamic data ----------
const activities = ref([])
const loading = ref(true)
const query = ref('')
const filtered = ref([])
const ratings = ref([]) // To store ratings
onMounted(async () => {
  activities.value = await fetchActivities()
  filtered.value = activities.value
  loading.value = false
  // Load any saved registrations and ratings
  registrations.value = loadRegistrations()
  ratings.value = loadRatings()
})
// filter logic
function filterActivities() {
  const q = query.value.toLowerCase()
  filtered.value = activities.value.filter(a =>
    a.name.toLowerCase().includes(q) || a.location.toLowerCase().includes(q)
  )
}
function selectActivity(a) {
  form.value.activityId = a.id
  validateActivity(true) // Validate on selection
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
// New: Rating functions
const RATINGS_STORAGE_KEY = 'activemeets_ratings_v1'

function loadRatings() {
  try {
    const raw = localStorage.getItem(RATINGS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRatings(list) {
  localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(list))
}

function submitRating(activityId, score) {
  if (!authState.isAuthenticated || !authState.user || !authState.user.username) {
    alert('You must be logged in to rate an activity.');
    return;
  }
  
  const userUsername = authState.user.username;
  const allRatings = loadRatings();
  
  const existingRating = allRatings.find(r => r.activityId === activityId && r.username === userUsername);
  
  if (existingRating) {
    alert('You have already rated this activity.');
    return;
  }
  
  const newRating = { id: crypto.randomUUID(), activityId, score: Number(score), username: userUsername };
  allRatings.push(newRating);
  saveRatings(allRatings);
  ratings.value = allRatings;
  alert('Thank you for your rating!');
}

function getAverageRating(activityId) {
  const activityRatings = ratings.value.filter(r => r.activityId === activityId)
  if (activityRatings.length === 0) {
    return 'No ratings'
  }
  const totalScore = activityRatings.reduce((sum, r) => sum + r.score, 0)
  const average = totalScore / activityRatings.length
  return average.toFixed(1)
}
// New: XSS protection helper
const sanitize = (dirty) => {
  if (dirty === null) return '';
  return DOMPurify.sanitize(dirty);
};
// --------- Form + Validations ----------
const form = ref({
  activityId: '',
  name: '',
  email: '',
  age: null,
})
const errors = ref({
  activityId: null,
  name: null,
  email: null,
  age: null,
})

const validateActivity = (blur) => {
  if (!form.value.activityId) {
    if (blur) errors.value.activityId = 'Please choose an activity.'
  } else {
    errors.value.activityId = null
  }
}

const validateName = (blur) => {
  if (form.value.name.trim().length === 0) {
    if (blur) errors.value.name = 'Name is required.'
  } else {
    errors.value.name = null
  }
}

const validateEmail = (blur) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email || !emailRegex.test(form.value.email)) {
    if (blur) errors.value.email = 'Enter a valid email address.'
  } else {
    errors.value.email = null
  }
}

const validateAge = (blur) => {
  const age = form.value.age
  if (!age || age < 5 || age > 120) {
    if (blur) errors.value.age = 'Age must be between 5 and 120.'
  } else {
    errors.value.age = null
  }
}

function onSubmit() {
  validateActivity(true)
  validateName(true)
  validateEmail(true)
  validateAge(true)

  if (errors.value.activityId || errors.value.name || errors.value.email || errors.value.age) {
    return;
  }
  
  const entry = { 
    id: crypto.randomUUID(), 
    // Sanitize data before saving
    activityId: form.value.activityId,
    name: sanitize(form.value.name),
    email: sanitize(form.value.email),
    age: form.value.age // Number, no need to sanitize
  }
  const all = loadRegistrations()
  all.push(entry)
  saveRegistrations(all)
  registrations.value = all
  
  // reset, but keep list and filters
  form.value = { activityId: '', name: '', email: '', age: null }
  errors.value = { activityId: null, name: null, email: null, age: null }
}
// --------- localStorage helpers ----------
const STORAGE_KEY = 'activemeets_registrations_v1'
const registrations = ref([])
function loadRegistrations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}
function saveRegistrations(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}
function removeRegistration(id) {
  const next = registrations.value.filter(r => r.id !== id)
  saveRegistrations(next)
  registrations.value = next
}
function clearAll() {
  saveRegistrations([])
  registrations.value = []
}
function findActivityName(id) {
  const a = activities.value.find(x => x.id === id)
  return a ? a.name : '—'
}

// Sorting, filtering, pagination for registrations table
const regSortKey = ref('activity') // 'activity' maps to activity name
const regSortAsc = ref(true)
const regPage = ref(1)
const regPerPage = 10
const regFilters = ref({ activity: '', name: '', email: '', age: '' })

watch(registrations, () => { regPage.value = 1 })
watch(regFilters, () => { regPage.value = 1 }, { deep: true })

function setRegSort(key) {
  if (regSortKey.value === key) {
    regSortAsc.value = !regSortAsc.value
  } else {
    regSortKey.value = key
    regSortAsc.value = true
  }
}

const filteredRegistrations = computed(() => {
  const f = regFilters.value
  const toText = (v) => (v ?? '').toString().toLowerCase()
  return registrations.value.filter(r =>
    toText(findActivityName(r.activityId)).includes(toText(f.activity)) &&
    toText(r.name).includes(toText(f.name)) &&
    toText(r.email).includes(toText(f.email)) &&
    toText(r.age).includes(toText(f.age))
  )
})

const sortedRegistrations = computed(() => {
  const list = [...filteredRegistrations.value]
  const key = regSortKey.value
  list.sort((a, b) => {
    const av = key === 'activity' ? findActivityName(a.activityId) : a[key]
    const bv = key === 'activity' ? findActivityName(b.activityId) : b[key]
    const an = parseFloat(av)
    const bn = parseFloat(bv)
    let cmp
    if (!Number.isNaN(an) && !Number.isNaN(bn)) {
      cmp = an - bn
    } else {
      cmp = (av ?? '').toString().localeCompare((bv ?? '').toString())
    }
    return regSortAsc.value ? cmp : -cmp
  })
  return list
})

const regTotalPages = computed(() => Math.max(1, Math.ceil(sortedRegistrations.value.length / regPerPage)))
const regStartItem = computed(() => (sortedRegistrations.value.length === 0 ? 0 : (regPage.value - 1) * regPerPage + 1))
const regEndItem = computed(() => Math.min(sortedRegistrations.value.length, regPage.value * regPerPage))
const pagedRegistrations = computed(() => {
  const p = Math.min(regPage.value, regTotalPages.value)
  const start = (p - 1) * regPerPage
  return sortedRegistrations.value.slice(start, start + regPerPage)
})
</script>