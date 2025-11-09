import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function usePermissions() {
  const authStore = useAuthStore()

  const canView = computed(() => authStore.canView)
  const canCreate = computed(() => authStore.canCreate)
  const canDelete = computed(() => authStore.canDelete)
  const userRole = computed(() => authStore.userRole)

  const hasPermission = (requiredRoles: string | string[]) => {
    return authStore.hasRole(requiredRoles)
  }

  const canAccessRoute = (routeRoles?: string | string[]) => {
    if (!routeRoles) return true
    return hasPermission(routeRoles)
  }

  return {
    canView,
    canCreate,
    canDelete,
    userRole,
    hasPermission,
    canAccessRoute,
  }
}
