<script setup>
import { Menubar, Menu, Button, Divider } from "primevue"
import { useMeStore } from "@/stores/index.js"
import { useRouter } from "vue-router"
import { ref } from "vue"
import { capitalize } from "lodash"

const props = defineProps(['navItems'])
const meStore = useMeStore()
const router = useRouter()

const menu = ref()
const items = ref([
  {
    label: "Home"
  }
])

const logout = async function() {
  try {
    await meStore.logout(router)
  } catch (e) {
    console.log(e)
  }
}
const toggleMenu = function(e) {
  menu.value.toggle(e)
}
</script>

<template>
  <Menubar :model="props.navItems" class="w-full" style="max-height: 7vh">
    <template #start>
      <div class="logo-container py-2 pr-2 flex flex-col items-center justify-center" @click="toggleMenu">
        <img class="logo" src="../../assets/biscou_logo.svg" alt="logo" />
      </div>
      <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" :pt="{root: { style: 'left: 1vh;' }}">
        <template #start>
          <span class="px-1 font-size-1">Welcome {{ capitalize(meStore.me.first_name) }}</span>
        </template>
        <template #end>
          <Divider />
          <Button class="w-full" label="Logout" severity="secondary" variant="outlined" @click="logout" />
        </template>
      </Menu>
    </template>
    <template #item="{ item }">
      <router-link :to="item.route" class="p-2">
        <i v-if="'icon' in item" class="pr-1" :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </router-link>
    </template>
  </Menubar>
</template>

<style lang="scss">
.menubar {
  max-height: 10%;
}
.logo {
  max-width: 40px;
}
.p-menubar-item-content > div {
  &:hover {
    cursor: pointer;
  }
}
.logo-container {
  &:hover {
    cursor: pointer;
  }
}
</style>