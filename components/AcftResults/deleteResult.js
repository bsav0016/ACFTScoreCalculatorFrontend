// Deletes a record with the signed-in token and says what happened, so the screen only reports success (and only
// removes the row, or signs the person out) when the server did. `request` is authFetch (path, options) -> Response.
async function sendDelete(request, path, failMessage) {
  let response;
  try {
    response = await request(path, { method: 'DELETE' });
  } catch {
    return { ok: false, network: true, message: "Couldn't reach the server. Check your connection and try again." };
  }
  // 404 means it is already gone (for example deleted on another device), which is what the person wanted.
  if (response.ok || response.status === 404) return { ok: true };
  if (response.status === 401) {
    return { ok: false, signedOut: true, status: 401, message: 'Your session has ended. Please sign in again.' };
  }
  return { ok: false, status: response.status, message: failMessage };
}

export function deleteSavedResult(request, id) {
  return sendDelete(request, `api/acft_scores/${id}/`, "Couldn't delete this score. Please try again.");
}

export function deleteAccount(request, id) {
  return sendDelete(request, `api/users/${id}/`, "Couldn't delete your account. Please try again.");
}
