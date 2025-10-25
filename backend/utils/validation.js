export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return password && password.length >= 6
}

export const validateContactData = (data) => {
  const errors = []

  if (!data.name || data.name.trim() === "") {
    errors.push("Name is required")
  }

  if (data.email && !validateEmail(data.email)) {
    errors.push("Invalid email format")
  }

  if (data.phone && !/^[\d\s\-+$$$$]+$/.test(data.phone)) {
    errors.push("Invalid phone format")
  }

  return errors
}
