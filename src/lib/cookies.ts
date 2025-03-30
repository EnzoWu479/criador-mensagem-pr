"use client"

import { encryptData, decryptData } from "./encryption"

// Cookie utility functions for client components with encryption
export const setCookie = (name: string, value: string, days = 30) => {
  const encryptedValue = encryptData(value)

  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = `; expires=${date.toUTCString()}`
  document.cookie = `${name}=${encryptedValue}${expires}; path=/; SameSite=Strict`
}

export const getCookie = (name: string): string | null => {
  const nameEQ = `${name}=`
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) {
      const encryptedValue = c.substring(nameEQ.length, c.length)
      return decryptData(encryptedValue)
    }
  }
  return null
}

export const removeCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=-99999999; path=/`
}

