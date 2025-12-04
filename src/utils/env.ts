export const getEnv = (key: string): string => {
  // Si existe la configuración inyectada en window, úsala
  if (typeof window !== 'undefined' && (window as any).__ENV__ && (window as any).__ENV__[key]) {
    return (window as any).__ENV__[key]
  }
  // Si no, usa la variable de entorno de Vite (desarrollo local)
  return import.meta.env[key] || ''
}

