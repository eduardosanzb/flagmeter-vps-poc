/// <reference path="../pb_data/types.d.ts" />
migrate(
  // UP — allow session-based updates for public users
  (app) => {
    const collection = app.findCollectionByNameOrId("assessments");

    // Allow public updates (security enforced by pb_hooks/validate_session_update.js)
    collection.updateRule = '';

    return app.save(collection);
  },

  // DOWN — revert updateRule to null (no public updates)
  (app) => {
    const collection = app.findCollectionByNameOrId("assessments");
    collection.updateRule = null;
    return app.save(collection);
  }
);
