<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
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

const handleGoogleLogin = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(() => {
      errorMsg.value = '';
      emit('login-success'); // Emit event để đóng popup
    })
    .catch(error => {
      if (error.code === 'auth/popup-closed-by-user') {
        errorMsg.value = 'Đăng nhập bị hủy!';
      } else {
        errorMsg.value = 'Lỗi đăng nhập Google: ' + error.message;
      }
    });
};
</script>

<template>
  <div>
    <input type="email" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <button @click="handleLogin">Đăng nhập</button>
    
    <hr style="margin: 10px 0; border: 1px solid #ddd;" />
    
    <button @click="handleGoogleLogin" class="google-btn">
      Đăng nhập bằng Google
    </button>
    
    <p v-if="errorMsg" style="color: red;">{{ errorMsg }}</p>
  </div>
</template>

<style scoped>
.google-btn {
  width: 100%;
  padding: 10px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.google-btn:hover {
  background-color: #3367d6;
}
</style>