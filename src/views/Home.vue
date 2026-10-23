<script setup>
import MainContainer from "./base/MainContainer.vue"
import {ref} from "vue"
import NavBar from "../components/nav/NavBar.vue";
import { navItems as defaultNavItems } from "@/helpers/nav-items.js"

const navItems = ref(defaultNavItems)
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