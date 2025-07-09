import { useAuthStore } from '@/store/authStore'
import type {
  User,
  UserTableFormat,
  UpdateUserRequest,
  UpdateCurrentUserRequest,
  ChangePasswordRequest,
} from '@/types/user'

export const userService = {
  async getUsers(): Promise<User[]> {
    const authStore = useAuthStore()
    const token = authStore.getToken()
    const userId = authStore.userId

    if (!token) {
      throw new Error('No authentication token available')
    }

    if (!userId) {
      throw new Error('No user ID available')
    }

    try {
      const response = await fetch('/api/v1/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.getToken()}`,
          UserId: userId.toString(),
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const users: User[] = await response.json()
      return users
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  async getCurrentUser(): Promise<User> {
    const authStore = useAuthStore()
    const token = authStore.getToken()
    const userId = authStore.userId

    if (!token) {
      throw new Error('No authentication token available')
    }

    if (!userId) {
      throw new Error('No user ID available')
    }

    try {
      const response = await fetch('/api/v1/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          UserId: userId.toString(),
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const user: User = await response.json()
      return user
    } catch (error) {
      console.error('Error fetching current user:', error)
      throw error
    }
  },

  async updateCurrentUser(userData: UpdateCurrentUserRequest): Promise<User> {
    const authStore = useAuthStore()
    const token = authStore.getToken()
    const userId = authStore.userId

    if (!token) {
      throw new Error('No authentication token available')
    }

    if (!userId) {
      throw new Error('No user ID available')
    }

    try {
      const response = await fetch('/api/v1/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          UserId: userId.toString(),
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedUser: User = await response.json()
      return updatedUser
    } catch (error) {
      console.error('Error updating current user:', error)
      throw error
    }
  },

  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    const authStore = useAuthStore()
    const token = authStore.getToken()
    const userId = authStore.userId

    if (!token) {
      throw new Error('No authentication token available')
    }

    if (!userId) {
      throw new Error('No user ID available')
    }

    try {
      const response = await fetch('/api/v1/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          UserId: userId.toString(),
        },
        body: JSON.stringify(passwordData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // The endpoint might return a success message or empty response
      // We'll handle both cases
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        await response.json()
      }
    } catch (error) {
      console.error('Error changing password:', error)
      throw error
    }
  },

  async getUserById(id: number | string): Promise<User> {
    const authStore = useAuthStore()
    const token = authStore.getToken()
    const userId = authStore.userId

    if (!token) {
      throw new Error('No authentication token available')
    }

    if (!userId) {
      throw new Error('No user ID available')
    }

    try {
      const response = await fetch(`/api/v1/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          UserId: userId.toString(),
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const user: User = await response.json()
      return user
    } catch (error) {
      console.error('Error fetching user details:', error)
      throw error
    }
  },

  async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    const authStore = useAuthStore()
    const token = authStore.getToken()
    const userId = authStore.userId

    if (!token) {
      throw new Error('No authentication token available')
    }

    if (!userId) {
      throw new Error('No user ID available')
    }

    try {
      const response = await fetch(`/api/v1/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          UserId: userId.toString(),
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedUser: User = await response.json()
      return updatedUser
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  async toggleUserStatus(id: number, newStatus: boolean): Promise<User> {
    const authStore = useAuthStore()
    const token = authStore.getToken()
    const userId = authStore.userId

    if (!token) {
      throw new Error('No authentication token available')
    }

    if (!userId) {
      throw new Error('No user ID available')
    }

    try {
      // First get the current user data
      const currentUser = await this.getUserById(id)

      // Update only the isActive field
      const updateData: UpdateUserRequest = {
        id: currentUser.id,
        email: currentUser.email,
        idTipoDocumento: currentUser.idTipoDocumento,
        documento: currentUser.documento,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        isActive: newStatus,
        idsRoles: currentUser.idsRoles,
        rolesDescriptions: currentUser.rolesDescriptions,
        idAreas: currentUser.idAreas || [],
      }

      return await this.updateUser(id, updateData)
    } catch (error) {
      console.error('Error toggling user status:', error)
      throw error
    }
  },

  // Helper function to format users for table display
  formatUsersForTable(users: User[]): UserTableFormat[] {
    return users.map((user) => ({
      id: user.id.toString(),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      lastLogin: this.formatDate(user.lastLogin),
      permission: user.rolesDescriptions.length > 0 ? user.rolesDescriptions[0] : 'Sin rol',
      isActive: user.isActive,
      selected: false,
    }))
  },

  // Helper function to format date
  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch (error) {
      return dateString // Return original if formatting fails
    }
  },
}
