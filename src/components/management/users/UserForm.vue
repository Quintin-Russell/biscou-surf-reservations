<script setup>
import { Button, Divider, InputText, RadioButton, Tag, ToggleSwitch } from "primevue"
import { useConfirm } from "primevue/useconfirm"
import { computed, ref, watch } from "vue"
import { isEmpty, isEqual, pickBy } from "lodash"
import { displayToast } from "@/compostables/displayToast.js"
import { useUsersStore } from "@/stores/index.js"
import { profileService } from "@/services/index.js"
import profileSchema from "@/helpers/validation-schemas/profileSchema.js"
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
  },
  // the user editing their own details instead of management editing role/permission
  profile: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['saved', 'close'])

const confirm = useConfirm()
const { notifyError, notifySuccess } = displayToast()
const usersStore = useUsersStore()

const PROFILE_FIELDS = [
  { key: 'first_name', label: 'First name' },
  { key: 'last_name', label: 'Last name' },
  { key: 'email', label: 'Email' },
  { key: 'phone_number', label: 'Phone' }
]

const toEditable = (user) => {
  if (!props.profile) return { role: user.role, permission: user.permission }
  return Object.fromEntries(PROFILE_FIELDS.map(({ key }) => [key, user[key] || '']))
}

const original = ref(toEditable(props.user))
const draft = ref(toEditable(props.user))
const saving = ref(false)
const editing = ref(false)

watch(() => props.user, (user) => {
  original.value = toEditable(user)
  draft.value = toEditable(user)
})

const isEmployee = computed(() => draft.value.role === ROLES.EMPLOYEE)
const isDirty = computed(() => !isEqual(draft.value, original.value))
const missingPermission = computed(() => isEmployee.value && !EMPLOYEE_PERMISSIONS.includes(draft.value.permission))
const createdAt = computed(() => props.user.created_at ? new Date(props.user.created_at).toLocaleDateString() : '')
const profileErrors = computed(() => {
  if (!props.profile) return {}
  try {
    profileSchema.validateSync(draft.value, { abortEarly: false })
    return {}
  } catch (e) {
    return Object.fromEntries(e.inner.map(({ path, message }) => [path, message]))
  }
})

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

const onToggleEditing = function(event) {
  if (saving.value) return
  if (!editing.value || !isDirty.value) {
    editing.value = !editing.value
    return
  }
  ask(event, 'Discard unsaved changes?', () => {
    draft.value = { ...original.value }
    editing.value = false
  })
}

const save = async function() {
  saving.value = true
  try {
    const roleChanged = draft.value.role !== original.value.role
    const updated = props.profile
      ? await profileService.update(props.user.id, pickBy(draft.value, (value, key) => value !== original.value[key]))
      : await usersStore.updateUser(props.user.id, draft.value)
    const detail = props.profile ? 'Your profile was updated' : `${props.user.full_name} updated`
    notifySuccess('Saved', detail, 3000)
    editing.value = false
    emit('saved', { user: updated, roleChanged })
  } catch (e) {
    notifyError('Save failed', e, {
      403: 'You need manager or admin permission to edit users.',
      404: 'This user no longer exists.'
    })
  } finally {
    saving.value = false
  }
}

const onSave = (event) => ask(event, props.profile ? 'Save changes to your profile?' : 'Save changes to this user?', save)
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

    <template v-if="profile">
      <div class="flex items-center gap-3 w-fit cursor-pointer" @click="onToggleEditing">
        <ToggleSwitch :model-value="editing" readonly :disabled="saving" input-id="edit-toggle" />
        <label for="edit-toggle" class="cursor-pointer" @click.prevent>Edit</label>
      </div>

      <div v-for="field in PROFILE_FIELDS" :key="field.key" class="flex flex-col gap-1">
        <label :for="`profile-${field.key}`" class="font-medium">{{ field.label }}</label>
        <InputText v-model="draft[field.key]" :id="`profile-${field.key}`" :disabled="!editing || saving" />
        <small v-if="editing && profileErrors[field.key]" class="text-red-400">{{ profileErrors[field.key] }}</small>
      </div>

      <Divider />

      <dl class="info grid gap-x-4 gap-y-1">
        <dt>Nationality</dt><dd>{{ user.nationality || '—' }}</dd>
        <dt>Role</dt><dd class="capitalize">{{ user.role || '—' }}</dd>
        <dt>Permission</dt><dd class="capitalize">{{ user.permission || '—' }}</dd>
        <dt>Joined</dt><dd>{{ createdAt || '—' }}</dd>
      </dl>
    </template>

    <template v-else>
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
    </template>

    <div v-if="!profile || editing" class="flex justify-end gap-2 mt-auto pt-4">
      <Button v-if="!profile" label="Cancel" severity="secondary" variant="text" @click="onCancel" />
      <Button label="Reset" severity="secondary" variant="outlined" :disabled="!isDirty || saving" @click="onReset" />
      <Button label="Save" :loading="saving" :disabled="!isDirty || missingPermission || !isEmpty(profileErrors)" @click="onSave" />
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
