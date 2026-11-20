<script setup>
import { Button, Dialog, Password } from "primevue"
import { ref, watch, computed } from "vue"
import { useRouter } from "vue-router"
import { debounce } from "lodash"
import PasswordFields from "@/components/PasswordFields.vue"
import { displayToast } from "@/compostables/displayToast.js"
import { authService, profileService } from "@/services/index.js"
import { useMeStore } from "@/stores/index.js"

const visible = defineModel('visible', { type: Boolean, default: false })

const meStore = useMeStore()
const { notifyError, notifySuccess } = displayToast()
const router = useRouter()

const submitting = ref(false)
const canChangePassword = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordValid = ref(false)

const resetForm = function() {
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  passwordValid.value = false
  canChangePassword.value = false
}

watch(visible, (value) => {
  if (!value) resetForm()
})

const newPasswordIsUnique = computed(() => currentPassword.value !== newPassword.value)

const onVerify = debounce(async function() {
  submitting.value = true
  let success = false
  try {
    const user = await authService.login({ email: meStore.me.email, password: currentPassword.value })
    if (user?.id === meStore.me.id) {
      success = true
    } else {
      throw new Error('Incorrect password')
    }
  } catch (e) {
    currentPassword.value = ''
    notifyError('Could not verify password', e, { 401: 'Your current password is incorrect.' })
  } finally {
    canChangePassword.value = success
    submitting.value = false
  }
}, 500)

const onChangePassword = debounce(async function() {
  submitting.value = true
  try {
    await profileService.changePassword(meStore.me.id, {
      current_password: currentPassword.value,
      new_password: newPassword.value,
      confirm_password: confirmPassword.value
    })
    notifySuccess('Password changed', 'Please log in with your new password')
    visible.value = false
    meStore.me = null
    await router.push({ name: 'Login' })
  } catch (e) {
    notifyError('Could not change password', e)
  } finally {
    submitting.value = false
  }
}, 500)
</script>

<template>
  <Dialog v-model:visible="visible" modal header="Change Password" :closable="!submitting" class="w-full max-w-md">
    <form class="flex flex-col gap-3" @submit.prevent="onChangePassword">
      <div class="flex flex-col gap-1">
        <label for="current-password" class="font-medium">Current password</label>
        <Password
          v-model="currentPassword"
          input-id="current-password"
          :input-props="{ autocomplete: 'current-password' }"
          :feedback="false"
          :disabled="submitting || canChangePassword"
          :toggle-mask="!canChangePassword"
          fluid
        />

        <PasswordFields
          v-if = "canChangePassword"
          v-model:password="newPassword"
          v-model:confirmation="confirmPassword"
          v-model:valid="passwordValid"
          password-label="New password"
          confirmation-label="Confirm new password"
          :disabled="submitting"
          :error="newPasswordIsUnique ? '' : 'New password must be unique'"
        />
        <Button v-if="canChangePassword" class="self-end" label="Submit" type="submit" :loading="submitting" :disabled="!passwordValid || !newPasswordIsUnique" />
        <Button v-else class="self-end" label="Verify Password" :loading="submitting" :disabled="!currentPassword" @click="onVerify"/>
      </div>
    </form>
  </Dialog>
</template>
