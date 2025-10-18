import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import emailjs from '@emailjs/browser'

// Initialize EmailJS with public key (optional when passing in send, but recommended)
if (import.meta.env.VITE_EMAILJS_PUBLIC_KEY) {
	try { emailjs.init({ publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }) } catch {}
}

createApp(App).use(router).mount('#app')
