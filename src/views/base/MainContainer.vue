<script setup>
import {Splitter, SplitterPanel} from "primevue"
</script>

<template>
  <Splitter layout="vertical" class="flex items-center justify-center full-screen">
    <SplitterPanel :size="7" class="w-full">
      <slot name="top-bar"></slot>
    </SplitterPanel>
    <SplitterPanel :size="93" class="w-full">
      <slot name="main-content"></slot>
    </SplitterPanel>
  </Splitter>
</template>

<style lang="scss" scoped>
.full-screen {
  width: 100vw;
  height: 100vh;
}
::v-deep .p-splitter-gutter {
  display: none;
}
</style>