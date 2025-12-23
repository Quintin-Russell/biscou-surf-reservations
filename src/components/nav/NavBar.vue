<script setup>
import { Menubar, Button } from "primevue"
import { useMeStore } from "../../stores/index.js";
import {useRouter} from "vue-router";

const props = defineProps(['navItems'])
const meStore = useMeStore()
const router = useRouter()

const logout = async () => {
  try {
    await meStore.logout(router)
  } catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <Menubar :model="props.navItems" class="w-full" style="max-height: 7vh">
    <template #start>
      <div class="pr-2 flex flex-col items-center justify-center">
        <img class="logo" src="../../assets/biscou_logo.svg" alt="logo" />
        <div>
          <span>Welcome</span>
          <span></span>
        </div>
      </div>
    </template>
    <template #item="{ item }">
      <router-link :to="item.route" class="p-2">
        <i v-if="'icon' in item" class="pr-1" :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </router-link>
    </template>
  </Menubar>
</template>

<style lang="scss" scoped>
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
</style>