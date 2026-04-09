// Hook to validate that session-based updates only modify records with matching session_id
// This provides security for public updates since PocketBase filter syntax doesn't support {:variable}

onRecordUpdateRequest((e) => {
  // Only apply to the assessments collection
  if (e.record.collection().name !== 'assessments') {
    e.next();
    return;
  }

  // Get the session_id from the request data
  const requestSessionId = e.request.data.session_id;
  const recordSessionId = e.record.get('session_id');

  // Validate that the request session_id matches the record's session_id
  if (requestSessionId !== recordSessionId) {
    throw new ForbiddenError('Session ID mismatch. You can only update records created by your session.');
  }

  // Allow the update to proceed
  e.next();
});
