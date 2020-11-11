let MapDrawContent = (function () {

  function MapDrawContent() {
    this.marker_ = [];
    this.distance_ = [];
    this.metric_ = [];
    this.volume_ = [];
  }

  MapDrawContent.prototype = Object.create(null);
  MapDrawContent.prototype.constructor = MapDrawContent;

  MapDrawContent.prototype.addMarker = function addMarker(lon, lat) {
    this.marker_.push({lon, lat})
  };

  MapDrawContent.prototype.addMarkers = function addMarkers(arr) {
    arr.forEach((lon, lat) => {
      this.marker_.push({lon, lat})
    });
  };

  MapDrawContent.prototype.getMarkers = function getMarkers() {
    return this.marker_;
  };

  MapDrawContent.prototype.clearMarkers = function clearMarkers() {
    this.marker_.splice(0, this.marker_.length);
  };


  MapDrawContent.prototype.addDistances = function addDistances(distances) {
    this.distance_.push(distances)
  };

  MapDrawContent.prototype.getDistances = function getMarkers() {
    return this.distance_;
  };

  MapDrawContent.prototype.clearDistances = function clearMarkers() {
    this.distance_.splice(0, this.distance_.length);
  };

  return MapDrawContent;
});

export default MapDrawContent;
