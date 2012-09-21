
var map;
var markers = {};
var infoWindow = new google.maps.InfoWindow();

function initMap() {
  var myLatlng = new google.maps.LatLng(41.6567,-0.8780);
  var mapOptions = {
    zoom: 8,
    center: myLatlng,
    disableDefaultUI: true,
    zoomControl:true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
  
 /**/ var layer = new google.maps.FusionTablesLayer({
  query: {
    select: 'kml_4326',
    from: '1vRgso0NNIocWUXffTPM1ukqAS0H3L4a60aWq6g',
    where: "name_1 CONTAINS IGNORING CASE 'aragón'"
  },styles: [{
    polygonOptions: {
      fillColor: "#FF0000",
      fillOpacity:0.1
    }
  }]
  });
  layer.setMap(map);
  
 //var ctaLayer = new google.maps.KmlLayer("file:///home/marcos/Proyects/CachiruloHub/hub/web-app/js/aragon.kml");
 // ctaLayer.setMap(map);
}

function fetchCompanies(text) {
  $('#searchText').val(text);
  //With API HUB JSON get the TIC companies to refresh map
  $.getJSON('home/queryJSON', {format: "json", text: text}, function(data) { 
    updateList(data);
    updateMap(data);
  });
}

function updateList(data) {
  var $tableBody=$('#tableBody');
  $tableBody.html('');

  //make new rows
  $.each(data,function(index,company){
	$('<li><a href="company/show/"' + company.id + '>' + company.name + '</a></li>')
	.appendTo($tableBody)
	.mouseover(function(e){
	    var marker = markers[company.positionId];
	    if(marker){
	      google.maps.event.trigger(marker,'click');
	    }
	})
	;
  });
}	

function updateMap(data) {
  //clear markers
  $.each(markers,function(index,item){
    item.setMap(null);
  });
  markers={};
  //make new markers
 $.each(data,function(index,company){
      if(company.latitude==null || company.longitude==null
      //Temporal: hasta que los datos sean correctos
      || company.latitude==1 || company.longitude==1
      ){
	return true; /*continue;*/
      }
    
      var marker = markers[company.positionId]
      if(marker){
          marker.companies.push(company)
	  return true; /*continue;*/
      }
      
      var location = new google.maps.LatLng(company.latitude, company.longitude);
      marker = new google.maps.Marker({position: location, map: map});
      marker.setTitle(company.name);
      marker.companies = [company]
      markers[company.positionId] = marker;              
      google.maps.event.addListener(marker, 'click', markerClick);
    
  });
}

function markerClick() {
    var marker=this;
    infoWindow.content = ""
    $.each(marker.companies,function(index,company){
        var company = marker.companies[index]
        infoWindow.content += "<b><a href='company/show/" + company.id + "'>" + company.name + "</a></b> <br>"
    });
    infoWindow.open(map, marker);
}

$(document).ready(function() {

  $('#searchForm').submit(function() {
    fetchCompanies($('#searchText').val());
    return false;
  });
  initMap();
  fetchCompanies();
});

