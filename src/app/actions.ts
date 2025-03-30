"use server";

import { cookies } from "next/headers";
import { createHash } from "crypto";

// Server-side encryption for HttpOnly cookies
function encryptServerSide(text: string): string {
  // In a real app, you would use a proper encryption key stored in environment variables
  // For this example, we'll use a simple hash-based approach
  const serverKey =
    process.env.ENCRYPTION_KEY || "default-server-key-change-in-production";

  // Create a hash of the text with the server key
  const hash = createHash("sha256")
    .update(text + serverKey)
    .digest("hex");

  // Combine the hash with the original text and encode to base64
  return Buffer.from(`${hash}:${text}`).toString("base64");
}

function decryptServerSide(encryptedText: string): string {
  try {
    // Decode from base64
    const decoded = Buffer.from(encryptedText, "base64").toString();

    // Split the hash and the original text
    const [_, originalText] = decoded.split(":");

    return originalText;
  } catch (error) {
    console.error("Error decrypting server-side:", error);
    return "";
  }
}

// Server action to set a secure HttpOnly cookie with encryption
export async function setSecureCookie(name: string, value: string) {
  const cookie = await cookies();
  const encryptedValue = encryptServerSide(value);

  cookie.set({
    name,
    value: encryptedValue,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "strict",
  });

  return { success: true };
}

// Server action to get a secure HttpOnly cookie and decrypt it
export async function getSecureCookie(name: string) {
  const cookie = (await cookies()).get(name);
  if (!cookie?.value) return null;

  return decryptServerSide(cookie.value);
}

// Server action to delete a secure HttpOnly cookie
export async function deleteSecureCookie(name: string) {
  (await cookies()).delete(name);
  return { success: true };
}
