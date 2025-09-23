<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <!-- Success Message -->
    <div v-if="successMessage" class="mb-4 p-4 rounded-md bg-green-100 border border-green-400 text-green-700">
      {{ successMessage }}
    </div>

    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
    >
      <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Profile</h3>
      <ProfileCard :profile="profile" @update:profile="handleProfileUpdate" />
      <PersonalInfoCard :profile="profile" />
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AdminLayout from "../../components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import ProfileCard from "../../components/profile/ProfileCard.vue";
import PersonalInfoCard from "../../components/profile/PersonalInfoCard.vue";
import api from "@/composables/useApi";

const currentPageTitle = ref("User Profile");
const profile = ref({});
const successMessage = ref('');

const fetchProfile = async () => {
  try {
    const response = await api.get("/me");
    profile.value = response.data.data.resource || {};
  } catch (error) {
    console.error("Failed to fetch profile:", error.response?.data || error.message);
    alert("Failed to load profile data.");
  }
};

const handleProfileUpdate = (updatedProfile) => {
  // Update the profile data reactively
  profile.value = { ...updatedProfile };

  // Show success message
  successMessage.value = 'Profile updated successfully!';

  // Hide success message after 5 seconds
  setTimeout(() => {
    successMessage.value = '';
  }, 5000);
};

onMounted(() => {
  fetchProfile();
});
</script>
