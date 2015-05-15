exports.definition = {
	config: {
		columns: {
		    "id": "int",
		    "letter": "text",
		    "found": "text"
		},
		adapter: {
			type: "sql",
			collection_name: "SassasModel"
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