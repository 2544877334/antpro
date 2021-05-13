<template>
  <div id="app1">
    <HelloWorld msg="Welcome to Your Vue.js 2x App"/>
    <router-link :to="{ name: 'user' }">User</router-link> | <router-link :to="{ name: 'about' }">About</router-link>
    <router-view />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app1 {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
