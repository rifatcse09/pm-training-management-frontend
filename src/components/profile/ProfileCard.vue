<template>
  <div>
    <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div
            class="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800"
          >
            <!-- Use defaultAvatar if profile.avatar is missing -->
            <img :src="defaultAvatar" alt="user" />
          </div>
          <div class="order-3 xl:order-2">
            <h4
              class="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left"
            >
              {{ localProfile.name || "N/A" }}
            </h4>
            <!-- <div
              class="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left"
            >
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ localProfile.file_designation || "No designation" }}</p>
              <span class="hidden w-1 h-1 bg-gray-400 rounded-full xl:block"></span>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ localProfile.email || "N/A" }}</p>
            </div> -->
          </div>
        </div>
        <button @click="openModal" class="edit-button">
          <svg
            class="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Edit
        </button>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" class="mb-4 p-4 rounded-md" :class="messageClass">
      {{ message }}
    </div>

    <Modal v-if="isProfileInfoModal" @close="closeModal">
      <template #body>
        <div
          class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
        >
          <!-- close btn -->
          <button
            @click="closeModal"
            class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
          >
            <svg
              class="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                fill=""
              />
            </svg>
          </button>
          <div class="px-2 pr-14">
            <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p class="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form @submit.prevent="saveProfile" class="flex flex-col">
            <div class="custom-scrollbar h-[458px] overflow-y-auto p-2">
              <div class="mt-7">
                <h5 class="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <!-- File Designation - Changed from col-span-2 to col-span-2 lg:col-span-1 -->
                  <div class="col-span-2 lg:col-span-1">
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Designation
                    </label>
                    <input
                      type="text"
                      v-model="form.file_designation"
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      :class="errors.file_designation ? 'border-red-500' : 'border-gray-300'"
                      placeholder="Enter file designation"
                    />
                    <p v-if="errors.file_designation" class="mt-1 text-sm text-red-600">
                      {{ errors.file_designation[0] }}
                    </p>
                  </div>

                  <!-- Mobile Number - Moved up to be beside Designation -->
                  <div class="col-span-2 lg:col-span-1">
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      v-model="form.mobile"
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      :class="errors.mobile ? 'border-red-500' : 'border-gray-300'"
                      placeholder="Enter your mobile number"
                    />
                    <p v-if="errors.mobile" class="mt-1 text-sm text-red-600">
                      {{ errors.mobile[0] }}
                    </p>
                  </div>

                  <!-- Full Name -->
                  <div class="col-span-2 lg:col-span-1">
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      v-model="form.name"
                      required
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      :class="errors.name ? 'border-red-500' : 'border-gray-300'"
                      placeholder="Enter your full name"
                    />
                    <p v-if="errors.name" class="mt-1 text-sm text-red-600">
                      {{ errors.name[0] }}
                    </p>
                  </div>

                  <!-- Email -->
                  <div class="col-span-2 lg:col-span-1">
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      v-model="form.email"
                      required
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      :class="errors.email ? 'border-red-500' : 'border-gray-300'"
                      placeholder="Enter your email"
                    />
                    <p v-if="errors.email" class="mt-1 text-sm text-red-600">
                      {{ errors.email[0] }}
                    </p>
                  </div>

                  <!-- New Password -->
                  <div class="col-span-2 lg:col-span-1">
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      New Password
                    </label>
                    <input
                      type="password"
                      v-model="form.password"
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      :class="errors.password ? 'border-red-500' : 'border-gray-300'"
                      placeholder="Leave blank to keep current password"
                    />
                    <p v-if="errors.password" class="mt-1 text-sm text-red-600">
                      {{ errors.password[0] }}
                    </p>
                  </div>

                  <!-- Confirm Password -->
                  <div v-if="form.password" class="col-span-2 lg:col-span-1">
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      v-model="form.password_confirmation"
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      :class="errors.password_confirmation ? 'border-red-500' : 'border-gray-300'"
                      placeholder="Confirm your new password"
                    />
                    <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-600">
                      {{ errors.password_confirmation[0] }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <button
                @click="closeModal"
                type="button"
                :disabled="loading"
                class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import axios from "axios";
import Modal from "./Modal.vue";

const props = defineProps({
  profile: {
    type: Object,
    required: true,
    default: () => ({
      name: "N/A",
      email: "N/A",
      file_designation: "",
      mobile: "",
      avatar: null,
    }),
  },
});
const emit = defineEmits(["update:profile"]);

const isProfileInfoModal = ref(false);
const loading = ref(false);
const message = ref('');
const messageType = ref('success');
const defaultAvatar = "/images/user/avatar.png";

// Initialize localProfile with default values
const localProfile = ref({ ...props.profile });

// Form data for editing
const form = ref({
  name: '',
  email: '',
  file_designation: '',
  mobile: '',
  password: '',
  password_confirmation: ''
});

const errors = ref({});

// Watch for prop changes and update localProfile
watch(
  () => props.profile,
  (newProfile) => {
    localProfile.value = { ...newProfile };
  },
  { deep: true, immediate: true }
);

const messageClass = computed(() => {
  return messageType.value === 'success'
    ? 'bg-green-100 border border-green-400 text-green-700'
    : 'bg-red-100 border border-red-400 text-red-700'
});

const openModal = () => {
  // Initialize form with current data from props
  form.value = {
    name: localProfile.value.name || '',
    email: localProfile.value.email || '',
    file_designation: localProfile.value.file_designation || '',
    mobile: localProfile.value.mobile || '',
    password: '',
    password_confirmation: ''
  };

  errors.value = {};
  message.value = '';
  isProfileInfoModal.value = true;
};

const closeModal = () => {
  if (!loading.value) {
    isProfileInfoModal.value = false;
    form.value = {
      name: '',
      email: '',
      file_designation: '',
      mobile: '',
      password: '',
      password_confirmation: ''
    };
    errors.value = {};
  }
};

const saveProfile = async () => {
  loading.value = true;
  errors.value = {};
  message.value = '';

  try {
    const token = localStorage.getItem('token');
    const payload = {
      name: form.value.name,
      email: form.value.email,
      file_designation: form.value.file_designation,
      mobile: form.value.mobile
    };

    // Only include password if it's provided
    if (form.value.password) {
      payload.password = form.value.password;
      payload.password_confirmation = form.value.password_confirmation;
    }

    const response = await axios.put('/api/v1/profile', payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Update local profile data
    localProfile.value = {
      name: response.data.user.name || '',
      email: response.data.user.email || '',
      file_designation: response.data.user.file_designation || '',
      mobile: response.data.user.mobile || '',
      avatar: response.data.user.avatar || null
    };

    // Emit update to parent component
    emit("update:profile", { ...localProfile.value });

    showMessage(response.data.message || 'Profile updated successfully', 'success');
    closeModal();

  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {};
    }
    showMessage(
      error.response?.data?.message || 'Failed to update profile',
      'error'
    );
  } finally {
    loading.value = false;
  }
};

const showMessage = (text, type = 'success') => {
  message.value = text;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 5000);
};
</script>
