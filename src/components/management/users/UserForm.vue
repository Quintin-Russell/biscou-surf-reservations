<script setup>
import { Button, Divider, RadioButton, Tag, ToggleSwitch } from "primevue"
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"
import { computed, ref, watch } from "vue"
import { isEqual } from "lodash"
import { useUsersStore } from "@/stores/index.js"
import {
  ROLES,
  GUEST_PERMISSION,
  EMPLOYEE_PERMISSIONS,
  DEFAULT_EMPLOYEE_PERMISSION
} from "@/helpers/constants/user-constants.js"

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['saved', 'close'])

const confirm = useConfirm()
const toast = useToast()
const usersStore = useUsersStore()

const toEditable = (user) => ({
  role: user.role,
  permission: user.permission
})

const original = ref(toEditable(props.user))
const draft = ref(toEditable(props.user))
const saving = ref(false)

watch(() => props.user, (user) => {
  original.value = toEditable(user)
  draft.value = toEditable(user)
})

const isEmployee = computed(() => draft.value.role === ROLES.EMPLOYEE)
const isDirty = computed(() => !isEqual(draft.value, original.value))
const missingPermission = computed(() => isEmployee.value && !EMPLOYEE_PERMISSIONS.includes(draft.value.permission))
const createdAt = computed(() => props.user.created_at ? new Date(props.user.created_at).toLocaleDateString() : '')

defineExpose({ isDirty })

const ask = function(event, message, accept) {
  confirm.require({
    target: event.currentTarget,
    message,
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'No', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Yes' },
    accept
  })
}

const onToggleEmployee = function(event) {
  const name = props.user.full_name
  const message = isEmployee.value
    ? `Revoke ${name}'s employee status?`
    : `Make ${name} an employee?`
  ask(event, message, () => {
    draft.value = isEmployee.value
      ? { role: ROLES.GUEST, permission: GUEST_PERMISSION }
      : { role: ROLES.EMPLOYEE, permission: DEFAULT_EMPLOYEE_PERMISSION }
  })
}

const STATUS_MESSAGES = {
  401: 'Your session expired. Please log in again.',
  403: 'You need manager or admin permission to edit users.',
  404: 'This user no longer exists.',
  422: 'The server rejected these values.'
}
const saveErrorMessage = (e) => STATUS_MESSAGES[e?.response?.status] || 'Something went wrong. Please try again.'

const save = async function() {
  saving.value = true
  try {
    const roleChanged = draft.value.role !== original.value.role
    const updated = await usersStore.updateUser(props.user.id, draft.value)
    toast.add({ severity: 'success', summary: 'Saved', detail: `${props.user.full_name} updated`, life: 3000 })
    emit('saved', { user: updated, roleChanged })
  } catch (e) {
    console.error(e)
    toast.add({
      severity: 'error',
      summary: 'Save failed',
      detail: saveErrorMessage(e),
      life: 5000
    })
  } finally {
    saving.value = false
  }
}

const onSave = (event) => ask(event, 'Save changes to this user?', save)
const onReset = (event) => ask(event, 'Discard changes and reset the form?', () => {
  draft.value = { ...original.value }
})
const onCancel = (event) => ask(event, isDirty.value ? 'Close and discard unsaved changes?' : 'Close this form?', () => emit('close'))
</script>

<template>
  <div class="user-form flex flex-col gap-3 p-4 rounded" :class="{ dirty: isDirty }">
    <div class="flex items-center justify-between gap-2">
      <h2 class="text-xl font-semibold">{{ user.full_name }}</h2>
      <Tag v-if="isDirty" severity="warn" value="Unsaved changes" icon="pi pi-pencil" />
    </div>

    <dl class="info grid gap-x-4 gap-y-1">
      <dt>Email</dt><dd>{{ user.email }}</dd>
      <dt>Phone</dt><dd>{{ user.phone_number || '—' }}</dd>
      <dt>Nationality</dt><dd>{{ user.nationality || '—' }}</dd>
      <dt>Joined</dt><dd>{{ createdAt || '—' }}</dd>
    </dl>

    <Divider />

    <div class="flex items-center gap-3 w-fit cursor-pointer" @click="onToggleEmployee">
      <ToggleSwitch :model-value="isEmployee" readonly input-id="employee-toggle" />
      <label for="employee-toggle" class="cursor-pointer" @click.prevent>Employee</label>
    </div>

    <div v-if="isEmployee" class="flex flex-col gap-2">
      <span class="font-medium">Permission</span>
      <div v-for="permission in EMPLOYEE_PERMISSIONS" :key="permission" class="flex items-center gap-2">
        <RadioButton v-model="draft.permission" :input-id="`permission-${permission}`" name="permission" :value="permission" />
        <label :for="`permission-${permission}`" class="capitalize">{{ permission }}</label>
      </div>
      <small v-if="missingPermission" class="text-red-400">Choose a permission for this employee</small>
    </div>

    <div class="flex justify-end gap-2 mt-auto pt-4">
      <Button label="Cancel" severity="secondary" variant="text" @click="onCancel" />
      <Button label="Reset" severity="secondary" variant="outlined" :disabled="!isDirty || saving" @click="onReset" />
      <Button label="Save" :loading="saving" :disabled="!isDirty || missingPermission" @click="onSave" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-form {
  border: 1px solid var(--p-content-border-color);
  border-left-width: 4px;
  &.dirty {
    border-left-color: var(--p-orange-400);
  }
}
.info {
  grid-template-columns: max-content 1fr;
  dt {
    color: var(--p-text-muted-color);
  }
}
</style>
