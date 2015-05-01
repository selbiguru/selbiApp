exports.definition = {
	config: {
		columns: {
		    "id": "integer",
		    "userName": "string",
		    "email": "string",
		    "password": "string",
		    "createDate": "date",
		    "modifiedDate": "string",
		    "role": "string",
		    "token"
		},
		adapter: {
			type: "sql",
			collection_name: "user"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			prettyDate : function() {
				var _model = this;
				var date_update = model.get("createDate");
				return moment.unix(date_update).calendar();
			}
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