/*
	global container
*/
Kepler = K = {
	version: '0.1.0',

	//core models
	Model: {},  	 //class base for items         (client)
	Place: {},       //class for places             (client)
	placeById: {},	 //constructor of Place  		(client)
	placesById: {},  //index of Place instances    (client)
	
	User: {},        //class for users              (client)
	userById: {},	 //constructor of User  		(client)
	usersById: {},  //index of User instances      (client)

	//utilities
	Util: {},        //module utils functions            (client,server)
	Cache: {},       //module caching system             (client,server)	
	Schema: {},      //define base fields for models     (client,server)	
	Field: {},       //define fields in pubs/queries     (client,server)
	
	//managing
	Admin: {},       //methods only for admin users      (client,server)
	placesByName: {},//index of places by name           (client)
	usersByName: {}, //index of users by name            (client)

	//core modules
	Profile: {},     //module for user logged data       (client)	
	Map: {},         //module map, controls, layers      (client)

	//others modules
	Upload: {},      //module manage file uploads        (client)
	Conver: {},      //module messages, place comments   (client)
	Notif: {},       //module notifications              (client)

	extend: function(e) {
		_.extend(K, e);
	},
	
	_queries: {},
	queries: function(q) {
		_.extend(this._queries, q);
		this.extend(q);
	},

	plugins: {},
};
/*TODO
if(Meteor.isServer)
	Settings = _.extend(JSON.parse(Assets.getText('settings.default.json')), Meteor.settings);

else if(Meteor.isClient)
	Settings = Meteor.settings.public;
*/