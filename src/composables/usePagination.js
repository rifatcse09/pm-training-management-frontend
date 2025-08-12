import { ref, watch } from "vue";
import debounce from "lodash.debounce"; // Ensure lodash.debounce is installed

export default function usePagination(apiEndpoint, perPage = 10) {
  const items = ref([]);
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    perPage,
    total: 0,
  });
  const isLoading = ref(false);
  const searchQuery = ref("");
  const debouncedFetch = debounce((query) => fetchItems(1, query), 300);

  const fetchItems = async (page = 1, searchQuery = "") => {
    isLoading.value = true;
    try {
      const response = await apiEndpoint({
        params: {
          page,
          per_page: pagination.value.perPage,
          search: searchQuery, // Pass the search query to the API
        },
      });
      const responseData = response.data?.data || response.data; // Adjust if `data` is nested
      const responseMeta = response.data?.meta || {}; // Adjust if `meta` is nested

      if (Array.isArray(responseData)) {
        items.value = responseData;
        pagination.value.currentPage = responseMeta.current_page || page;
        pagination.value.lastPage = responseMeta.last_page || 1;
        pagination.value.total = responseMeta.total || responseData.length;
      } else {
        console.error("Unexpected API response structure:", response);
      }
    } catch (error) {
      console.error("Error fetching items:", error.response?.data || error.message);
    } finally {
      isLoading.value = false;
    }
  };

  const changePage = (page, searchQuery = "") => {
    if (page < 1 || page > pagination.value.lastPage) {
      alert("Invalid page number.");
      return;
    }
    fetchItems(page, searchQuery);
  };

  const clearSearch = () => {
    searchQuery.value = "";
    fetchItems(1); // Reload data
  };

  watch(searchQuery, (newQuery) => {
    if (newQuery) {
      debouncedFetch(newQuery); // Debounced fetch for typing
    }
  });

  return {
    items,
    pagination,
    isLoading,
    fetchItems,
    changePage,
    searchQuery,
    clearSearch,
  };
}
