/// <reference path="../pb_data/types.d.ts" />
migrate(
  // UP — create the support_submissions collection
  (app) => {
    const collection = new Collection({
      name: "support_submissions",
      type: "base",

      // Public create — anyone can submit (no auth token required)
      createRule: "",
      // Admin-only for everything else
      listRule: null,
      viewRule: null,
      updateRule: null,
      deleteRule: null,

      fields: [
        // --- App-writable required ---
        { name: "kind",              type: "select", required: true,  maxSelect: 1, values: ["feedback", "bug_report", "support_request"] },
        { name: "summary",           type: "text",   required: true,  max: 500 },
        { name: "message",           type: "text",   required: true },
        { name: "allow_follow_up",   type: "bool",   required: false },
        { name: "source",            type: "text",   required: true,  max: 100 },
        { name: "source_surface",    type: "text",   required: false, max: 200 },
        { name: "app_version",       type: "text",   required: false, max: 100 },
        { name: "os_version",        type: "text",   required: false, max: 100 },

        // --- App-writable optional ---
        { name: "contact_email",     type: "email",  required: false },
        { name: "includes_diagnostics", type: "bool", required: false },
        { name: "diagnostic_summary", type: "text",   required: false },
        { name: "build_number",      type: "text",   required: false, max: 100 },
        { name: "build_commit",      type: "text",   required: false, max: 50 },
        { name: "bundle_id",         type: "text",   required: false, max: 200 },
        { name: "license_key_prefix",type: "text",   required: false, max: 8 },
        { name: "license_tier",      type: "text",   required: false, max: 50 },
        { name: "license_activated_at", type: "number", required: false },

        // --- Internal/admin (defaults set by hook) ---
        { name: "status",            type: "select", required: false, maxSelect: 1, values: ["to-review", "new", "triaged", "in_progress", "waiting_user", "resolved", "closed"] },
        { name: "priority",          type: "select", required: false, maxSelect: 1, values: ["low", "medium", "high", "urgent"] },
        { name: "notes_internal",    type: "text",   required: false },
      ],
    });

    return app.save(collection);
  },

  // DOWN — delete the collection
  (app) => {
    const collection = app.findCollectionByNameOrId("support_submissions");
    return app.delete(collection);
  }
);
