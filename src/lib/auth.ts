import { supabase } from './supabase'
import bcrypt from 'bcryptjs'

export const authenticateUser = async (email: string, password: string) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !users) {
      return { success: false, message: 'Usuario no encontrado' }
    }

    const isValidPassword = await bcrypt.compare(password, users.password)
    
    if (!isValidPassword) {
      return { success: false, message: 'Contraseña incorrecta' }
    }

    return { 
      success: true, 
      user: {
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role
      }
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return { success: false, message: 'Error de autenticación' }
  }
}