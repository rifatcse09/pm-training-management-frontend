import { ref } from "vue";

export default function usePagination(apiCall) {
  const items = ref([]);
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10,
  });

  const fetchItems = async (page = 1, searchQuery = "") => {
    try {
      console.log("Fetching items with page:", page, "and search query:", searchQuery);
      const response = await apiCall({
        params: {
          page,
          search: searchQuery,
        },
      });
      console.log("API response:", response.data);

      items.value = response.data.data || [];
      pagination.value = {
        currentPage: response.data.current_page || 1,
        totalPages: response.data.last_page || 1,
        totalItems: response.data.total || 0,
        perPage: response.data.per_page || 10,
      };
    } catch (error) {
      console.error("Error fetching items:", error.response?.data || error.message);
      items.value = []; // Reset items on error
      pagination.value = {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        perPage: 10,
      };
    }
  };

  const changePage = (page) => {
    fetchItems(page);
  };

  return {
    items,
    pagination,
    fetchItems,
    changePage,
  };
}
