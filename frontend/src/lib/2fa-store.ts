// Shared 2FA status store for demo purposes
// In a real app, this would be a database

const usersWith2FA: string[] = ['admin', 'test', 'demo', 'user', 'john', 'jane'];

export function getUsersWith2FA(): string[] {
  return [...usersWith2FA]; // Return a copy to prevent external modification
}

export function addUserTo2FA(username: string): void {
  const normalizedUsername = username.toLowerCase();
  
  // If username is an email, extract the username part before @
  const usernameToStore = normalizedUsername.includes('@') 
    ? normalizedUsername.split('@')[0] 
    : normalizedUsername;
  
  if (!usersWith2FA.includes(usernameToStore)) {
    usersWith2FA.push(usernameToStore);
    console.log(`2FA Store: Added user "${usernameToStore}" (from "${normalizedUsername}") to 2FA list. Current users: [${usersWith2FA.join(', ')}]`);
  } else {
    console.log(`2FA Store: User "${usernameToStore}" (from "${normalizedUsername}") already in 2FA list. Current users: [${usersWith2FA.join(', ')}]`);
  }
}

export function removeUserFrom2FA(username: string): void {
  const normalizedUsername = username.toLowerCase();
  
  // If username is an email, extract the username part before @
  const usernameToRemove = normalizedUsername.includes('@') 
    ? normalizedUsername.split('@')[0] 
    : normalizedUsername;
  
  const index = usersWith2FA.indexOf(usernameToRemove);
  if (index > -1) {
    usersWith2FA.splice(index, 1);
    console.log(`2FA Store: Removed user "${usernameToRemove}" (from "${normalizedUsername}") from 2FA list. Current users: [${usersWith2FA.join(', ')}]`);
  } else {
    console.log(`2FA Store: User "${usernameToRemove}" (from "${normalizedUsername}") not found in 2FA list. Current users: [${usersWith2FA.join(', ')}]`);
  }
}

export function hasUser2FAEnabled(username: string): boolean {
  const normalizedUsername = username.toLowerCase();
  
  // Check for exact match first
  let has2FA = usersWith2FA.includes(normalizedUsername);
  
  // If not found and username contains @, try extracting the username part before @
  if (!has2FA && normalizedUsername.includes('@')) {
    const usernamePart = normalizedUsername.split('@')[0];
    has2FA = usersWith2FA.includes(usernamePart);
    console.log(`2FA Store: Email username detected, checking username part "${usernamePart}" - Has 2FA: ${has2FA}`);
  }
  
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
