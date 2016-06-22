exports.definition = {
	config: {
		columns: {
		    "id": "integer",
		    "userTo": "text",
		    "userFrom": "text",		    
		    "type": "text",
		    "user": "text",
		    "createdAt": "text",
		    "updatedAt": "text"
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