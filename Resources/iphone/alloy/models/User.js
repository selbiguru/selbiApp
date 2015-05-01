var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            id: "integer",
            userName: "string",
            email: "string",
            password: "string",
            createDate: "date",
            modifiedDate: "string"
        },
        adapter: {
            type: "sql",
            collection_name: "user"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

model = Alloy.M("user", exports.definition, []);

collection = Alloy.C("user", exports.definition, model);

exports.Model = model;

exports.Collection = collection;