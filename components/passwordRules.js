// Checks for a new password before it is sent. The server applies the full rules (common passwords, similarity to
// the username and so on) and its messages are shown as they come; these catch the obvious cases without a round trip.
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;

// A message for the first problem with a new password, or null when it looks fine.
export function newPasswordProblem(password, confirmation) {
  if (password.length < PASSWORD_MIN) return `Password must be at least ${PASSWORD_MIN} characters long.`;
  if (password.length > PASSWORD_MAX) return `Password must be no more than ${PASSWORD_MAX} characters.`;
  if (/^\d+$/.test(password)) return 'Password cannot be only numbers.';
  if (confirmation !== undefined && confirmation !== password) return 'Passwords must match.';
  return null;
}

// Turns what the server said about a password into one message for an alert.
export function serverPasswordMessage(messages) {
  return Array.isArray(messages) && messages.length ? messages.join('\n') : 'That password is not allowed.';
}
