<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="'Pending User List'" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Pending User List">
        <PendingUserTable :columns="columns" />
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import PendingUserTable from "@/components/tables/basic-tables/PendingUserTable.vue";

const columns = [
  { label: "Name", field: "name" },
  { label: "Email", field: "email" },
  { label: "Designation", field: "designation" },
  { label: "Class", field: "class" },
  { label: "Grade", field: "grade" },
];
</script>
