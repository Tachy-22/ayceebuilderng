// List of adjectives and nouns to create random anonymous names
const adjectives = [
  "Happy",
  "Clever",
  "Brave",
  "Gentle",
  "Witty",
  "Swift",
  "Calm",
  "Bright",
  "Bold",
  "Eager",
  "Fancy",
  "Proud",
  "Smart",
  "Quick",
  "Kind",
  "Wise",
];

const nouns = [
  "Panda",
  "Tiger",
  "Eagle",
  "Dolphin",
  "Wolf",
  "Fox",
  "Owl",
  "Bear",
  "Falcon",
  "Rabbit",
  "Lion",
  "Koala",
  "Hawk",
  "Deer",
  "Otter",
  "Seal",
];

/**
 * Generates a random name in the format "AdjectiveNoun"
 * @returns A randomly generated name
 */
export function generateRandomName(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective}${noun}`;
}

/**
 * Get user IP address from request headers
 * @param req Request object
 * @returns IP address string or "unknown" if not found
 */
export async function getUserIP(): Promise<string> {
  try {
    // Use a service to get the client's IP address
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return "unknown";
  }
}

/**
 * Generate a consistent user identifier based on IP address
 * This adds a layer of anonymity while still allowing comment tracking
 * @param ip The IP address to hash
 * @returns A hashed identifier
 */
export function generateUserIdentifier(ip: string): string {
  // Simple hash function for demo purposes - in production use a proper hash function
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}
