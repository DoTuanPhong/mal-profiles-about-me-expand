<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const email = ref('');
const password = ref('');
const errorMsg = ref('');

const handleLogin = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .catch(error => {
      errorMsg.value = 'Sai email hoặc mật khẩu!';
    });
};
</script>

<template>
  <div>
    <h3>Admin Login</h3>
    <input type="email" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <button @click="handleLogin">Đăng nhập</button>
    <p v-if="errorMsg">{{ errorMsg }}</p>
  </div>
</template>