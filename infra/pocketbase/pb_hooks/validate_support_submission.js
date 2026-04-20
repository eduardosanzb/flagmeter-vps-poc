/// <reference path="../pb_data/types.d.ts" />
// Hook to enforce product rules on support submission ingestion

onRecordCreateRequest((e) => {
  // Only apply to the support_submissions collection
  if (e.record.collection().name !== 'support_submissions') {
    e.next();
    return;
  }

  const data = e.request.data;

  // Rule 1: follow-up gate — if allow_follow_up is true, contact_email must be present
  if (data.allow_follow_up === true && !data.contact_email) {
    throw new BadRequestError('Follow-ups require a contact email.');
  }

  // Rule 2: diagnostics opt-in — if includes_diagnostics is not explicitly true, clear diagnostic_summary
  if (data.includes_diagnostics !== true) {
    data.diagnostic_summary = undefined;
  }

  // Rule 3: sanitize diagnostic summary — strip HTML, hard limit
  if (data.diagnostic_summary) {
    data.diagnostic_summary = data.diagnostic_summary
      .replace(/<[^>]*>/g, '')
      .slice(0, 10000);
  }

  // Set admin defaults
  if (!data.status) data.status = 'to-review';
  if (!data.priority) data.priority = 'medium';

  e.next();
});
