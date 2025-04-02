export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  return emailRegex.test(email)
}

export function getEmailValidationMessage(email: string): string {
  if (!email) return 'Email is required'
  if (!isValidEmail(email)) return 'Please enter a valid email address'
  return ''
} 