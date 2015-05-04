exports.definition = {
	config: {
		columns: {
		    "Id": "integer",
		    "userName": "string",
		    "password": "string",
		    "email": "string",
		    "createdate": "date",
		    "modifiedDate": "number",
		    "sessionAuthToken": "string"
		},
		adapter: {
			type: "sql",
			collection_name: "User"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
		// extended functions and properties go here
		});

		return Collection;
	}
};