/// <reference path="../pb_data/types.d.ts" />
migrate(
  // UP — make Q5-Q7 and Q2 optional (dropped or moved in new flow)
  (app) => {
    const collection = app.findCollectionByNameOrId("assessments");

    // Q5, Q6, Q7 are dropped from the new assessment flow
    // Make them optional so new submissions don't fail validation
    const q5 = collection.fields.getByName("q5_audit_history");
    if (q5) q5.required = false;

    const q6 = collection.fields.getByName("q6_audit_usefulness");
    if (q6) q6.required = false;

    const q7 = collection.fields.getByName("q7_audit_budget");
    if (q7) q7.required = false;

    // Q2 is moved after the result screen — may not be submitted in early partial saves
    const q2 = collection.fields.getByName("q2_team_size");
    if (q2) q2.required = false;

    // Q8, Q9 also moved after result — make optional for partial submissions
    const q8 = collection.fields.getByName("q8_agent_interest");
    if (q8) q8.required = false;

    const q9 = collection.fields.getByName("q9_agent_priorities");
    if (q9) q9.required = false;

    // Q1, Q3, Q4 are still required in the scoring phase
    // But make them optional too since we save progressively
    const q1 = collection.fields.getByName("q1_cloud_setup");
    if (q1) q1.required = false;

    const q3 = collection.fields.getByName("q3_pain_points");
    if (q3) q3.required = false;

    const q4 = collection.fields.getByName("q4_migration");
    if (q4) q4.required = false;

    return app.save(collection);
  },

  // DOWN — restore required status (best effort)
  (app) => {
    const collection = app.findCollectionByNameOrId("assessments");
    const requiredFields = [
      "q1_cloud_setup", "q2_team_size", "q3_pain_points", "q4_migration",
      "q5_audit_history", "q6_audit_usefulness", "q7_audit_budget",
      "q8_agent_interest", "q9_agent_priorities"
    ];
    requiredFields.forEach(function(name) {
      const field = collection.fields.getByName(name);
      if (field) field.required = true;
    });
    return app.save(collection);
  }
);
