Climbo.Place = Climbo.Class.extend({

	id: null,
	data: {},					//dati orignali dal db
	cache: {},					//caching for remote data	
	tmpl: Template.item_place,	//template usato nelle liste
	type: 'place',

	init: function(placeId) {

		var self = this;

		self.id = placeId;

		//REACTIVE SOURCES:
		self._dep = new Tracker.Dependency();
		self.rData = function() {	//Data Reactive Source
			self._dep.depend();
			//TODO raggruppare dati reattivi in self.rdata
			//e usare solo quelli come sorgente reattiva
			//TODO ritornare solo dati reattivi: checkins,stars,weather
			return self;
		};
		self.update = function(comp) {	//sincronizza istanza con dati nel db

			self.data = Places.findOne(new Meteor.Collection.ObjectID(self.id));
			
			//FIXME a volte: findOne ritorna null... xke forse i dati non vengono scaricati in tempo
			//FIXME forse per il bug precendete a volte scade la computation di e autorun i stoppa

			_.extend(self, self.data, self.cache);

			self._dep.changed();
		};
		Tracker.autorun( self.update );

		//MAP OBJECTS:
		self.icon = new L.NodeIcon({
			nodeHtml: L.DomUtil.create('div'),
			className: (self.name ? 'marker-'+self.type : 'marker-gray'),
		});
		self.marker = new L.Marker(self.loc, {icon: self.icon});
		self.marker.place = self;
		self.marker.on('add', function() {
				Blaze.renderWithData(Template.marker_checkins, self, self.icon.nodeHtml);
			})
			.on('click mousedown', function(e) {
				if(!this._popup) {
					self.popup$ = L.DomUtil.create('div','popup-place');
					Blaze.renderWithData(Template.popup_place, self, self.popup$);
					this.bindPopup(self.popup$, { closeButton:false, minWidth:180, maxWidth:320 });
				}
			});

	},

	//PUBLIC METHODS:
	loadLoc: function() {
		var self = this;
		if(Climbo.util.valid.loc(self.loc))
		{
			self.marker.addTo(Climbo.map.layers.cluster);
			//patch! per caricare marker di place non scaricati da layerjson
			Climbo.map.loadLoc(self.loc);
			setTimeout(function() {
				self.marker.fire('click');
				self.icon.animate();
			},400);
		}
	},

	isOutdoor: function() {
		return this.type != 'indoor';
	},

	isCheckin: function() {
		//return Meteor.user() && (Meteor.user().checkin === this.id);
		var place = Climbo.profile.getCheckin();
		return place && place.id === this.id;
	},
	
	isFavorite: function() {
		return Meteor.user() && _.contains(Meteor.user().favorites, this.id);
	},

	checkinsCount: function() {
		this._dep.depend();
		return this.checkins && this.checkins.length;
	},
	conversCount: function() {
		this._dep.depend();
		return this.convers && this.convers.length;
	},

	getRank: function() {
		this._dep.depend();
		return this.rank;
	}
});

//TODO move to Climbo.Class.newItem()
Climbo.newPlace = function(id)
{
	if(!id) return null;
	if(!Climbo.placesById[id])
		Climbo.placesById[id] = new Climbo.Place(id);
	return Climbo.placesById[id];
};

