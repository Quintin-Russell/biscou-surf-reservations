<script setup>
import MainContainer from "./base/MainContainer.vue"
import {ref} from "vue"
import NavBar from "../components/nav/NavBar.vue";

const navItems = ref([{
  /*
  label
  icon
  */
  label: 'Home',
  route: '/home',
  icon: 'pi pi-home'
}])
</script>

<template>
  <MainContainer>
    <template #top-bar>
      <nav-bar :nav-items="navItems"/>
    </template>
    <template #main-content>
      Home
    </template>
  </MainContainer>
</template>

<style scoped>

</style>