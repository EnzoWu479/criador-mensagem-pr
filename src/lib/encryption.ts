"use client"

// A simple encryption/decryption utility for client-side use
// Note: This is not military-grade encryption but provides basic obfuscation

export function encryptData(text: string): string {
  if (!text) return ""

  // Create a simple encryption key from the browser's user agent
  // This makes the encryption somewhat unique to the user's browser
  const browserKey = getBrowserKey()

  // Convert the text to a base64 string first
  const base64 = btoa(text)

  // XOR each character with the corresponding character in the key
  let result = ""
  for (let i = 0; i < base64.length; i++) {
    const charCode = base64.charCodeAt(i) ^ browserKey.charCodeAt(i % browserKey.length)
    result += String.fromCharCode(charCode)
  }

  // Convert to base64 again to make it URL-safe
  return btoa(result)
}

export function decryptData(encryptedText: string): string {
  if (!encryptedText) return ""

  try {
    // Get the browser key
    const browserKey = getBrowserKey()

    // Decode from base64
    const decoded = atob(encryptedText)

    // XOR each character with the key
    let result = ""
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ browserKey.charCodeAt(i % browserKey.length)
      result += String.fromCharCode(charCode)
    }

    // Decode from base64 again to get the original text
    return atob(result)
  } catch (error) {
    console.error("Error decrypting data:", error)
    return ""
  }
}

// Generate a key based on browser information
function getBrowserKey(): string {
  const userAgent = navigator.userAgent
  let key = ""

  // Create a simple hash from the user agent
  for (let i = 0; i < userAgent.length; i++) {
    key += String.fromCharCode((userAgent.charCodeAt(i) % 26) + 97)
  }

  // Ensure the key is at least 32 characters long
  while (key.length < 32) {
    key += key
  }

  return key.substring(0, 32)
}

