// Shared 2FA status store for demo purposes
// In a real app, this would be a database

let usersWith2FA: string[] = ['admin', 'test', 'demo', 'user', 'john', 'jane'];

export function getUsersWith2FA(): string[] {
  return [...usersWith2FA]; // Return a copy to prevent external modification
}

export function addUserTo2FA(username: string): void {
  const normalizedUsername = username.toLowerCase();
  if (!usersWith2FA.includes(normalizedUsername)) {
    usersWith2FA.push(normalizedUsername);
    console.log(`2FA Store: Added user "${normalizedUsername}" to 2FA list. Current users: [${usersWith2FA.join(', ')}]`);
  } else {
    console.log(`2FA Store: User "${normalizedUsername}" already in 2FA list. Current users: [${usersWith2FA.join(', ')}]`);
  }
}

export function removeUserFrom2FA(username: string): void {
  const normalizedUsername = username.toLowerCase();
  const index = usersWith2FA.indexOf(normalizedUsername);
  if (index > -1) {
    usersWith2FA.splice(index, 1);
  }
}

export function hasUser2FAEnabled(username: string): boolean {
  const normalizedUsername = username.toLowerCase();
  const has2FA = usersWith2FA.includes(normalizedUsername);
  console.log(`2FA Store: Checking user "${username}" -> normalized: "${normalizedUsername}" - Has 2FA: ${has2FA}`);
  console.log(`2FA Store: Current users with 2FA: [${usersWith2FA.join(', ')}]`);
  console.log(`2FA Store: Exact match test: usersWith2FA.includes("${normalizedUsername}") = ${usersWith2FA.includes(normalizedUsername)}`);
  return has2FA;
}

// Debug function to manually add users for testing
export function debugAddUser(username: string): void {
  addUserTo2FA(username);
  console.log(`Debug: Manually added "${username}" to 2FA list`);
}
