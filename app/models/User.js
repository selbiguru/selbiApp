exports.definition = {
	config: {
		columns: {
		    "id": "integer",
		    "username": "text",
		    "password": "text",		    
		    "email": "text",
		    "firstName": "text",
		    "lastName": "text",
		    "createdAt": "text",
		    "updatedAt": "text",
		    "admin": "integer"
		},
		adapter: {
			type: "sql",
			idAttribute: 'id',
			collection_name: "user"
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