<html>
  <head>
    <meta name="layout" content="public">
    <title>Cachirulo Hub</title>
    <g:javascript library="jquery"/>
	  <script src="https://maps.googleapis.com/maps/api/js?sensor=false"></script>
	  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <g:javascript src="home.js"/>
    <g:javascript src="markerclusterer.js" />
  </head>
  <body>
      <div class="map" id="map_canvas"></div>
      <div class="panel" id="panel"> 
        <div class="panelContent" id="panelContent"> </div>
        <a href="#" onClick="$('#panel').hide();">Cerrar</a>
      </div>
  </body>
</html>
