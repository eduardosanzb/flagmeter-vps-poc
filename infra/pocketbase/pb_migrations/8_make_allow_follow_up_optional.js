/// <reference path="../pb_data/types.d.ts" />
migrate(
  // UP — make allow_follow_up optional (fixes PocketBase bool required quirk where false is treated as blank)
  (app) => {
    const collection = app.findCollectionByNameOrId("support_submissions");
    const field = collection.fields.getByName("allow_follow_up");
    if (field) {
      field.required = false;
    }
    return app.save(collection);
  },

  // DOWN — restore required
  (app) => {
    const collection = app.findCollectionByNameOrId("support_submissions");
    const field = collection.fields.getByName("allow_follow_up");
    if (field) {
      field.required = true;
    }
    return app.save(collection);
  }
);
