import { useAuthStore } from '@/store/authStore'

export interface User {
  id: number
  email: string
  id_type_document: number
  documento: string
  firstName: string
  lastName: string
  isActive: boolean
  idsRoles: number[]
  rolesDescriptions: string[]
  createAt: string
  updatedAt: string
  lastLogin: string
}

export interface UserTableFormat {
  id: string
  name: string
  email: string
  lastLogin: string
  permission: string
  selected: boolean
}

export interface UpdateUserRequest {
  id: number
  email: string
  id_type_document: number
  documento: string
  firstName: string
  lastName: string
  isActive: boolean
  idsRoles: number[]
  rolesDescriptions: string[]
}

export const userService = {
  async getUsers(): Promise<User[]> {
    const authStore = useAuthStore()
    const token = authStore.getToken()
    const userId = authStore.userId
    console.log('token', token)

    console.log('userId', userId)
    if (!token) {
      throw new Error('No authentication token available')
    }

    if (!userId) {
      throw new Error('No user ID available')
    }

    try {
      const response = await fetch('/api/api/v1/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.getToken()}`,
          userId: userId.toString(),
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
      const response = await fetch(`/api/api/v1/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          userId: userId.toString(),
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
      const response = await fetch(`/api/api/v1/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          userId: userId.toString(),
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
      const response = await fetch(`/api/api/v1/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          userId: userId.toString(),
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

  // Helper function to format users for table display
  formatUsersForTable(users: User[]): UserTableFormat[] {
    return users.map((user) => ({
      id: user.id.toString(),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      lastLogin: this.formatDate(user.lastLogin),
      permission: user.rolesDescriptions.length > 0 ? user.rolesDescriptions[0] : 'Sin rol',
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
