exports.definition = {
	config: {

		adapter: {
			type: "sql",
			collection_name: "letterModel",
			db_file : "/dbKostervandring.sqlite",
			idAttribute : "id"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});
		
		function setFound(){
			lettersModel.get('found');
			lettersModel.set({'found':1});
			lettersModel.save();
		}
		
		function setAlerted(){
			var alert = lettersModel.get('alerted');
			alert.set({'alerted':1});
			alert.save();
			
			return alert;
		}

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};