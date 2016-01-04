exports.definition = {
	config: {
		columns: {
		    "id": "integer",
		    "userTo": "string",
		    "userFrom": "string",		    
		    "type": "string",
		    "user": "string",
		    "createdAt": "date",
		    "updatedAt": "date"
		},
		adapter: {
			type: "sql",
			idAttribute: 'id',
			collection_name: "notification"
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