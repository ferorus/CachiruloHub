
var map;
var mc;
var markersArray=[];
var infoWindow = new google.maps.InfoWindow();

var baseUrl

function initMap() {
  var myLatlng = new google.maps.LatLng(41.6567,-0.8780);
  var mapOptions = {
    zoom: 8,
    center: myLatlng,
    disableDefaultUI: true,
    zoomControl:true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  
  if(!map){
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
  }
  var layer = new google.maps.FusionTablesLayer({
  query: {
    select: 'json_4326',
    from: '1vRgso0NNIocWUXffTPM1ukqAS0H3L4a60aWq6g',
    where: "name_1 not equal to 'Aragón'"
  },styles: [{


    polygonOptions: {
      fillColor: '#eaeaea',
      visible: false
    }
  }]
  });
  layer.setMap(map);
  if(!mc){
    var mcOptions = {
      gridSize: 25, 
      maxZoom: 12, 
      styles: [{
        opt_textColor: 'white',
        height: 78,
        url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m4.png",
        width: 78
        }]
    };
  mc = new MarkerClusterer(map, [], mcOptions);
  }

}

function fetchCompanies(text) {
  $('#searchText').val(text);
  //With API HUB JSON get the TIC companies to refresh map
  $.getJSON(baseUrl + 'home/queryJSON', {format: "json", text: text}, function(data) { 
    updateList(data);
    updateMap(data);
  });
}

function updateList(data) {
  $('#tableBody').html("");

  //make new rows
  $.each(data,function(index,company){
    $("#tableBody").append("<li><div class='empresa_item'><span class='img'><img class='thumbnail' src='"+ company.logoSrc + "'/></span><span><a href='"+baseUrl+"company/show/" + company.id + "' onclick='return showCompany(" + company.id + ")'>" + company.name + "</a><h6>"+company.web+"</h6></span></div></li>");
  });
}	

function updateMap(data) {
  //clear markers
  //$.each(markers,function(index,item){
  //  item.setMap(null);
  //});
  mc.clearMarkers();
  markersArray=[];
  //make new markers
  var markers={};
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
      marker = new google.maps.Marker({position: location});
      marker.setTitle(company.name);
      marker.companies = [company];
      
      markers[company.positionId] = marker;
      markersArray.push(marker);
      
      attachClickEvent(marker);
  });
  mc.addMarkers(markersArray);
}

function attachClickEvent(marker) {
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.content = ""
    $.each(marker.companies,function(index,company){
        var company = marker.companies[index]
        infoWindow.content += "<b><a onclick='return showCompany(" + company.id + ")' href='"+ baseUrl +"company/show/" + company.id + "'>" + company.name + "</a></b> <br>"
    });
    infoWindow.open(map, marker);
  });

}

function showCompany(id) {
  $.ajax({
    url: baseUrl + 'company/show/' + id,
    success:function(data,textStatus) {jQuery('#content_containter').html(data);},
    error:function(XMLHttpRequest,textStatus,errorThrown){}
  });
  return false;
}

$(document).ready(function() {
  baseUrl = $('#baseUrl').val();
  $('#panel').hide();
  $('#searchForm').submit(function() {
    fetchCompanies($('#searchText').val());
    return false;
  });
  initMap();
  fetchCompanies();
});

