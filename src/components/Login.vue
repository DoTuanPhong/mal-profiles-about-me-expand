<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const emit = defineEmits(['login-success']);

const email = ref('');
const password = ref('');
const errorMsg = ref('');

const handleLogin = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      errorMsg.value = '';
      emit('login-success'); // Emit event để đóng popup
    })
    .catch(error => {
      errorMsg.value = 'Sai email hoặc mật khẩu!';
    });
};
</script>

<template>
  <div>
    <input type="email" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <button @click="handleLogin">Đăng nhập</button>
    <p v-if="errorMsg" style="color: red;">{{ errorMsg }}</p>
  </div>
</template>