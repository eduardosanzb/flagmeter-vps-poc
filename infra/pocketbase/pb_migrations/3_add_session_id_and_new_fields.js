/// <reference path="../pb_data/types.d.ts" />
migrate(
  // UP — add session_id and new question fields to assessments
  (app) => {
    const collection = app.findCollectionByNameOrId("assessments");

    // Session ID — client-generated UUID for tracking submissions without email
    collection.fields.add(new Field({
      name: "session_id",
      type: "text",
      required: false,
      max: 36,
    }));

    // New scoring question: cost visibility
    collection.fields.add(new Field({
      name: "q_cost_visibility",
      type: "text",
      required: false,
      max: 100,
    }));

    // New scoring question: AI adoption level
    collection.fields.add(new Field({
      name: "q_ai_adoption",
      type: "text",
      required: false,
      max: 100,
    }));

    // New scoring question: AI vendor coupling
    collection.fields.add(new Field({
      name: "q_ai_coupling",
      type: "text",
      required: false,
      max: 100,
    }));

    // Scores — computed by the frontend scoring function
    collection.fields.add(new Field({
      name: "score_sovereignty",
      type: "number",
      required: false,
    }));

    collection.fields.add(new Field({
      name: "score_cost_resilience",
      type: "number",
      required: false,
    }));

    collection.fields.add(new Field({
      name: "score_ai_readiness",
      type: "number",
      required: false,
    }));

    return app.save(collection);
  },

  // DOWN — remove the added fields
  (app) => {
    const collection = app.findCollectionByNameOrId("assessments");
    collection.fields.removeByName("session_id");
    collection.fields.removeByName("q_cost_visibility");
    collection.fields.removeByName("q_ai_adoption");
    collection.fields.removeByName("q_ai_coupling");
    collection.fields.removeByName("score_sovereignty");
    collection.fields.removeByName("score_cost_resilience");
    collection.fields.removeByName("score_ai_readiness");
    return app.save(collection);
  }
);
