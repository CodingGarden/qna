const mongoose = require('mongoose');
const service = require('feathers-mongoose');

module.exports = function createService(name, schemaOptions, hooks = {}) {
  const schema = new mongoose.Schema(schemaOptions, { versionKey: false });
  
  schema.set('timestamps', true);
  
  const Model = mongoose.model(name, schema);
  
  const setOptions = (context) => {
    context.params.mongoose = {
      runValidators: true,
      setDefaultsOnInsert: true,
    };
  };
  
  return (app)  => {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  
    app.use('/' + name, service({
      Model,
      lean: true,
    }));
  
    app.service(name).hooks({
      before: {
        create: [setOptions, ...(hooks.before && hooks.before.create ? hooks.before.create : [])],
        update: [setOptions, ...(hooks.before && hooks.before.update ? hooks.before.update : [])],
        patch: [setOptions, ...(hooks.before && hooks.before.patch ? hooks.before.patch : [])],
      },
      after: {
        ...(hooks.after ? hooks.after: {})
      }
    });
  };
  
}
