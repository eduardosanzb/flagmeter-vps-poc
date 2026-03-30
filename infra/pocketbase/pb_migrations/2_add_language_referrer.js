/// <reference path="../pb_data/types.d.ts" />
migrate(
  // UP — add language and referrer tracking fields to assessments
  (app) => {
    const collection = app.findCollectionByNameOrId("assessments");

    // Language code the user completed the assessment in ("en", "de", "es")
    collection.fields.add(new Field({
      name: "language",
      type: "text",
      required: false,
      max: 10,
    }));

    // HTTP Referer — the page the user navigated from (document.referrer)
    collection.fields.add(new Field({
      name: "referrer",
      type: "text",
      required: false,
      max: 2048,
    }));

    return app.save(collection);
  },

  // DOWN — remove the added fields
  (app) => {
    const collection = app.findCollectionByNameOrId("assessments");
    collection.fields.removeByName("language");
    collection.fields.removeByName("referrer");
    return app.save(collection);
  }
);
