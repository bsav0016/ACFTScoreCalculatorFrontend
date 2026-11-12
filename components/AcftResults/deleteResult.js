// Deletes one saved result with the signed-in token and says what happened, so the screen only removes the row
// when the server did. `request` is authFetch (path, options) -> Response.
export async function deleteSavedResult(request, id) {
  let response;
  try {
    response = await request(`api/acft_scores/${id}/`, { method: 'DELETE' });
  } catch {
    return { ok: false, message: "Couldn't reach the server. Check your connection and try again." };
  }
  // 404 means it is already gone (for example deleted on another device), which is what the person wanted.
  if (response.ok || response.status === 404) return { ok: true };
  if (response.status === 401) {
    return { ok: false, signedOut: true, message: 'Your session has ended. Please sign in again.' };
  }
  return { ok: false, message: "Couldn't delete this score. Please try again." };
}
