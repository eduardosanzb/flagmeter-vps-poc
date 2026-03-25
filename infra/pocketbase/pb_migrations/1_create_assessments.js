/// <reference path="../pb_data/types.d.ts" />
migrate(
  // UP — create the assessments collection
  (app) => {
    const collection = new Collection({
      name: "assessments",
      type: "base",

      // Public create — anyone can submit the survey (no auth token required)
      createRule: "",
      // Admin-only for everything else
      listRule: null,
      viewRule: null,
      updateRule: null,
      deleteRule: null,

      fields: [
        // --- Context ---
        { name: "q1_cloud_setup",      type: "text",  required: true,  options: { max: 100 } },
        { name: "q2_team_size",        type: "text",  required: true,  options: { max: 50  } },
        // --- Pain ---
        // Multi-select stored as JSON array string e.g. '["costs","vendor-lock"]'
        { name: "q3_pain_points",      type: "json",  required: true,  options: { maxSize: 2000 } },
        { name: "q4_migration",        type: "text",  required: true,  options: { max: 100 } },
        // --- Audit interest ---
        { name: "q5_audit_history",    type: "text",  required: true,  options: { max: 100 } },
        { name: "q6_audit_usefulness", type: "text",  required: true,  options: { max: 100 } },
        { name: "q7_audit_budget",     type: "text",  required: true,  options: { max: 100 } },
        // --- Automation interest ---
        { name: "q8_agent_interest",   type: "text",  required: true,  options: { max: 100 } },
        // Multi-select stored as JSON array string, max 2 selections
        { name: "q9_agent_priorities", type: "json",  required: true,  options: { maxSize: 1000 } },
        // --- Lead capture (all optional) ---
        { name: "respondent_name",     type: "text",  required: false, options: { max: 200 } },
        { name: "respondent_email",    type: "email", required: false, options: {} },
        { name: "respondent_company",  type: "text",  required: false, options: { max: 200 } },
        // --- Tracking ---
        // 'source' differentiates events: "cloudfest", "kubecon", etc.
        { name: "source",              type: "text",  required: false, options: { max: 50  } },
      ],
    });

    return app.save(collection);
  },

  // DOWN — delete the collection
  (app) => {
    const collection = app.findCollectionByNameOrId("assessments");
    return app.delete(collection);
  }
);
