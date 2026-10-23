<script setup>
import { Column, DataTable, Tab, TabList, TabPanel, TabPanels, Tabs } from "primevue"
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"
import { computed, onMounted, ref } from "vue"
import LoadingSpinner from "@/components/LoadingSpinner.vue"
import UserForm from "./UserForm.vue"
import { useUsersStore } from "@/stores/index.js"

const TABS = {
  EMPLOYEES: 'employees',
  GUESTS: 'guests'
}

const usersStore = useUsersStore()
const confirm = useConfirm()
const toast = useToast()

const activeTab = ref(TABS.EMPLOYEES)
const selectedUser = ref(null)
const userForm = ref()

const tabs = computed(() => [
  { value: TABS.EMPLOYEES, label: 'Employees', users: usersStore.employees },
  { value: TABS.GUESTS, label: 'Users', users: usersStore.guests }
])

onMounted(async () => {
  try {
    await usersStore.fetchUsers()
  } catch (e) {
    console.error(e)
    const detail = e?.response?.status === 403
      ? 'You need manager or admin permission to view users.'
      : 'Please try again.'
    toast.add({ severity: 'error', summary: 'Could not load users', detail, life: 5000 })
  }
})

// run `action` right away, or after confirming when the open form has unsaved changes
const guardUnsaved = function(target, action) {
  if (!userForm.value?.isDirty) return action()
  confirm.require({
    target,
    message: 'Discard unsaved changes?',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'No', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Yes' },
    accept: action
  })
}

const onRowClick = function({ originalEvent, data }) {
  if (data.id === selectedUser.value?.id) return
  guardUnsaved(originalEvent.currentTarget, () => { selectedUser.value = data })
}

const onTabChange = function(value) {
  if (value === activeTab.value) return
  guardUnsaved(document.activeElement, () => {
    activeTab.value = value
    selectedUser.value = null
  })
}

const onSaved = function({ user, roleChanged }) {
  // role change moves the user to the other tab, so close the form
  selectedUser.value = roleChanged ? null : user
}

</script>

<template>
  <div class="flex flex-col h-full">
    <h1 class="text-2xl font-semibold mb-3">User Management</h1>
    <LoadingSpinner v-if="usersStore.loading" />
    <div v-else class="flex gap-4 items-start">
      <Tabs :value="activeTab" class="flex-1 min-w-0" @update:value="onTabChange">
        <TabList>
          <Tab v-for="tab in tabs" :key="tab.value" :value="tab.value">
            {{ tab.label }} ({{ tab.users.length }})
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel v-for="tab in tabs" :key="tab.value" :value="tab.value">
            <DataTable
              :value="tab.users"
              :selection="selectedUser"
              selection-mode="single"
              data-key="id"
              paginator
              :rows="15"
              striped-rows
              @row-click="onRowClick"
            >
              <template #empty>No {{ tab.label.toLowerCase() }} found</template>
              <Column field="full_name" header="Name" sortable />
              <Column field="email" header="Email" sortable />
              <Column field="phone_number" header="Phone" />
              <Column field="permission" header="Permission" sortable>
                <template #body="{ data }">
                  <span class="capitalize">{{ data.permission || '—' }}</span>
                </template>
              </Column>
            </DataTable>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <UserForm
        v-if="selectedUser"
        ref="userForm"
        :user="selectedUser"
        class="w-96 shrink-0"
        @saved="onSaved"
        @close="selectedUser = null"
      />
    </div>
  </div>
</template>
