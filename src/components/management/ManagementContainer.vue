<script setup>
import { Button } from "primevue"
import { ref } from "vue"

const collapsed = ref(false)
// add future management options here (each needs a child route under /management)
const options = [
  { label: 'Users', icon: 'pi pi-users', to: { name: 'ManagementUsers' } }
]
</script>

<template>
  <div class="flex w-full h-full">
    <aside
      class="sidebar flex flex-col gap-1 p-2 h-full"
      :class="collapsed ? 'w-14' : 'w-56'"
    >
      <Button
        :icon="collapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"
        severity="secondary"
        variant="text"
        class="self-end"
        :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        @click="collapsed = !collapsed"
      />
      <router-link
        v-for="option in options"
        :key="option.label"
        :to="option.to"
        :title="option.label"
        class="sidebar-link flex items-center gap-2 p-2 rounded"
      >
        <i :class="option.icon"></i>
        <span v-if="!collapsed">{{ option.label }}</span>
      </router-link>
    </aside>
    <section class="flex-1 overflow-auto p-4">
      <slot name="content"></slot>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  border-right: 1px solid var(--p-content-border-color);
  transition: width 0.2s ease;
  overflow: hidden;
}
.sidebar-link {
  white-space: nowrap;
  &:hover {
    background: var(--p-content-hover-background);
  }
  &.router-link-active {
    background: var(--p-highlight-background);
    color: var(--p-highlight-color);
  }
}
</style>
