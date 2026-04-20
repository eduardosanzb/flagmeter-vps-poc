/// <reference path="../pb_data/types.d.ts" />
migrate(
  // UP — create the escribano_licenses collection (idempotent)
  (app) => {
    // Skip if collection already exists (e.g. re-deploy, migration already applied)
    try {
      app.findCollectionByNameOrId("escribano_licenses");
      return;
    } catch (e) {
      // doesn't exist, proceed to create
    }

    const collection = new Collection({
      name: "escribano_licenses",
      type: "base",

      // Admin-only create — keys are issued manually
      createRule: null,
      // Admin-only list — prevents key enumeration
      listRule: null,
      // Public view — CLI verifies keys unauthenticated
      viewRule: "",
      // Admin-only update — revoke/change tier manually
      updateRule: null,
      // Admin-only delete
      deleteRule: null,

      fields: [
        // License tier: "beta" or "pro"
        { name: "tier", type: "select", required: true, maxSelect: 1, values: ["beta", "pro"] },
        // Whether the key has been revoked
        { name: "revoked", type: "bool", required: false },
      ],
    });

    return app.save(collection);
  },

  // DOWN — delete the collection
  (app) => {
    const collection = app.findCollectionByNameOrId("escribano_licenses");
    return app.delete(collection);
  }
);
