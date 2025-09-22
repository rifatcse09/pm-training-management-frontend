<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
    >
      <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Profile</h3>
      <ProfileCard :profile="profile" />
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

const fetchProfile = async () => {
  try {
    const response = await api.get("/me");
    profile.value = response.data.data.resource || {};
  } catch (error) {
    console.error("Failed to fetch profile:", error.response?.data || error.message);
    alert("Failed to load profile data.");
  }
};

onMounted(() => {
  fetchProfile();
});
</script>
