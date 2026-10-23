<script setup>
import MainContainer from "./base/MainContainer.vue"
import NavBar from "../components/nav/NavBar.vue"
import ManagementContainer from "../components/management/ManagementContainer.vue"
import { ref } from "vue"
import { navItems as defaultNavItems } from "@/helpers/nav-items.js"

const navItems = ref(defaultNavItems)
</script>

<template>
  <MainContainer>
    <template #top-bar>
      <nav-bar :nav-items="navItems"/>
    </template>
    <template #main-content>
      <ManagementContainer>
        <template #content>
          <router-view />
        </template>
      </ManagementContainer>
    </template>
  </MainContainer>
</template>
