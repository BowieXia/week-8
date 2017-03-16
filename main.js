/* =====================
 Copy your code from Week 4 Lab 2 Part 2 part2-app-state.js in this space
===================== */
/* =====================
===================== */
var slideNumber = 1;
var DatasourceURL = "http://raw.githubusercontent.com/BowieXia/CPLN_692_Midterm/master/FoodInspection_FIELD_Updated.json";
var GeojsonData = "http://raw.githubusercontent.com/BowieXia/CPLN_692_Midterm/master/Zipcode.geojson";
var featureGroup;
var Popups = [];
var Group2010 = [];
var Group2011 = [];
var Group2012 = [];
var Group2013 = [];
var Group2014 = [];
var Group2015 = [];
var Group2016 = [];
var Group2017 = [];
var TimerCount = 0;
var MarkerLayer;
var MarkerLayer2010;
var MarkerLayer2011;
var MarkerLayer2012;
var MarkerLayer2013;
var MarkerLayer2014;
var MarkerLayer2015;
var MarkerLayer2016;
var MarkerLayer2017;
var MarkerLayerH;
var MarkerLayerM;
var MarkerLayerL;
var MarkerLayerE;

// We set this to HTTP to prevent 'CORS' issues
$(document).ready(function() {
  // $("#text-input1").val("http://raw.githubusercontent.com/CPLN692-MUSA611/datasets/master/json/philadelphia-crime-snippet.json");
  // $("#text-input2").val("Lat");
  // $("#text-input3").val("Lng");
  var map = L.map('map', {
    center: [41.921271, -87.702531],
    zoom: 14,
  });
  var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(map);
  L.control.mousePosition().addTo(map);

  if (slideNumber === 1) {
    $('.previous').hide();
  }
  $('.my-legend').hide();
  var GroupData = [];

  $.ajax(GeojsonData).done(function(data) {
    var parsedData = JSON.parse(data);
    //console.log(parsedData.features);
    featureGroup = L.geoJson(parsedData.features, {
      style: myStyle,
      onEachFeature: onEachFeature
      //filter: myFilter
    }).addTo(map);
    // quite similar to _.each
    featureGroup.eachLayer(eachFeatureFunction);
  });
  function onEachFeature(feature, layer) {
    if (feature.properties) {
        layer.bindPopup("Zipcode:" + feature.properties.zip);
    }
  }
  var eachFeatureFunction = function(layer) {
    layer.on('click', function (event) {
      /* =====================
      The following code will run every time a layer on the map is clicked.
      Check out layer.feature to see some useful data about the layer that
      you can use in your application.
      ===================== */
      //console.log(layer.feature.properties);

      //var LayerID = featureGroup.getLayerId();

      var LatLngBounds = layer.getBounds();
      LayerID = layer._leaflet_id;
      //console.log(LayerID);
      //console.log(LatLngBounds);
      map.fitBounds(LatLngBounds);
    });
  };

  $('#showChart').click(function(){
    var chart = c3.generate({
        bindto: '#chart',
        data: {
          columns: [
            ['FoodInspection', 528,738,663,786,772,723,774],
          ],
          types: {
        FoodInspection: 'bar' // ADD
          }
        },
        axis: {
          y: {
            label: { // ADD
              text: 'Inspection Numbers',
              position: 'outer-middle'
            }
          },
          x: {
            show: true,
            label: { // ADD
              text: 'From 2010 to 2016',
              position: 'outer-middle'
            }
          }
        }
    });
  });

  $('#ShowInfo').click(function(){
    downloadCrimeData.done(function(data) {
      var parsed = parseData(data);
      var NewMarkers =[];
      console.log(parsed);
      _.each(parsed,function(feature){
        console.log(feature);
        var node = document.createElement("div");  // Create a <li> node
        node.setAttribute('class', 'SideBar_Info');
        var name = document.createTextNode(feature.FIELD2); // Create a text node
        var type = document.createTextNode(feature.FIELD5); // Create a text node
        var risk  = document.createTextNode(feature.FIELD6); // Create a text node
        var address = document.createTextNode(feature.FIELD7); // Create a text node
        var date = document.createTextNode(feature.FIELD11); // Create a text node
        var result = document.createTextNode(feature.FIELD13);
        var vioReason = document.createTextNode(feature.FIELD14);
        node.append("Name:");
        node.appendChild(name);
        node.append("Type:");
        node.appendChild(type);
        node.append("Risk:");
        node.appendChild(risk);
        node.append("Address:");
        node.appendChild(address);
        node.append("Date:");
        node.appendChild(date);
        node.append("Result:");
        node.appendChild(result);
        node.append("Violation Reason:");
        node.appendChild(vioReason);
        document.getElementById("SideBar_Info").appendChild(node); ///append Item
        NewMarkers.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],GroceryMarkerOptions));
      });
      MarkerLayer = L.layerGroup(NewMarkers);
      console.log(MarkerLayer);
      MarkerLayer.addTo(map);
    });
  });

  var OtherRiskMarkerOptions = {
    radius: 8,
    fillColor: "#95a5a6",
    color: "#ffffff",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.2
  };
  var HighRiskMarkerOptions = {
    radius: 8,
    fillColor: "#D32F2F",
    color: "#ffffff",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.2
  };
  var MediumRiskMarkerOptions = {
    radius: 8,
    fillColor: "#EF5350",
    color: "#ffffff",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.2
  };
  var LowRiskMarkerOptions = {
    radius: 8,
    fillColor: "#EF9A9A",
    color: "#ffffff",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.2
  };

  $('select[name="dropdown"]').change(function(){
    downloadCrimeData.done(function(data) {
      var parsed = parseData(data);
      //var markers = makeMarkers(parsed);
      //plotMarkers(markers);
      //console.log(parsed);
      var NewMarkers = [];
      var NewMarkersH = [];
      var NewMarkersM = [];
      var NewMarkersL = [];
      var NewMarkersE = [];
      console.log($('#dropdown option:selected').val());

      _.each(parsed,function(feature){
        //console.log(feature.FIELD6);
        if (feature.FIELD6.includes("High")) {
          NewMarkersH.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],HighRiskMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
        }else if (feature.FIELD6.includes("Medium")) {
          NewMarkersM.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],MediumRiskMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
        }else if (feature.FIELD6.includes("Low")) {
          NewMarkersL.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],LowRiskMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
        }else {
          NewMarkersE.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],OtherRiskMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
        }
        // switch ($('#dropdown option:selected').val()) {
        //   case "1": return NewMarkers.append(NewMarkers);
        //
        //   case "2": return NewMarkers.append(NewMarkersM);
        //
        //   case "3": return NewMarkers.append(NewMarkersL);
        //
        //   default:  return  NewMarkers.append(NewMarkersE);
        // }
      });
      if ($('#dropdown option:selected').val() == 1) {
        console.log("1");
        MarkerLayerH = L.layerGroup(NewMarkersH);
        console.log(MarkerLayerH);
        MarkerLayerH.addTo(map);
      }else if ($('#dropdown option:selected').val() == 2) {
        console.log("2");
        MarkerLayerM = L.layerGroup(NewMarkersM);
        console.log(MarkerLayerM);
        MarkerLayerM.addTo(map);
      }else if ($('#dropdown option:selected').val() == 3) {
        console.log("3");
        MarkerLayerL = L.layerGroup(NewMarkersL);
        console.log(MarkerLayerL);
        MarkerLayerL.addTo(map);
      }else {
        console.log("4");
        MarkerLayerE = L.layerGroup(NewMarkersE);
        console.log(MarkerLayerE);
        MarkerLayerE.addTo(map);
      }
      //console.log(MarkerLayer);

    });
  });


  $("#MapData").click(function(){
    downloadCrimeData.done(function(data) {
      var parsed = parseData(data);
  //    console.log(parsed);
  //    var F_Data = filterData(parsed);
  //    console.log(F_Data);
      // var featureGroup = L.geoJson(parsed, {
      //   style: myStyle,
      //   filter: myFilter
      // }).addTo(map);
      // console.log(featureGroup);
      GroupByType(parsed);
      console.log(GroupData);
      var markers = makeMarkers(parsed);
    //  console.log("markers");
    //  console.log(markers);
      plotMarkers(markers);
    // removeMarkers(markers);
    });
    $('.my-legend').hide();
  });

  //classify spots click function
  $("#ButtonClassify").click(function(){
    downloadCrimeData.done(function(data) {
      var parsed = parseData(data);
      GroupByType(parsed);
      var markers = makeClassifiedMarkers(parsed);
      plotMarkers(markers);
    });
    $('.my-legend').show();
  });

  $('#DisplayRe').click(function(){
    //console.log("did clicked");
    downloadCrimeData.done(function(data) {
      var parsed = parseData(data);
      DisplayResult(parsed);
      // console.log("Count2010:",Count2010);
      // console.log("Count2011:",Count2011);
      // console.log("Count2012:",Count2012);
      // console.log("Count2013:",Count2013);
      // console.log("Count2014:",Count2014);
      // console.log("Count2015:",Count2015);
      // console.log("Count2016:",Count2016);
      // console.log("Count2017:",Count2017);
    });
  });

  //reset view click function
  $('#reset').click(function(){
    ResetView();
  });

  var areaSelect;

  $('#DrawRect').click(function(){
    // L.Draw.Rectangle();
    areaSelect = L.areaSelect({width:200, height:300});
    areaSelect.addTo(map);

    // Read the bouding box
    var bounds = areaSelect.getBounds();

    // Get a callback when the bounds change
    areaSelect.on("change", function() {
        console.log("Bounds:", this.getBounds());
    });

    // Set the dimensions of the box
    areaSelect.setDimensions({width: 500, height: 500});
  });

  $('#RemoveRect').click(function(){
    areaSelect.remove();
  });

  //Previous, next and return click function

///////////////////////////////////Return button
  $('#return').click(function(){
    $('.Narratives').text("Press button to show all the food inspections in the selecting zipcode area(60649)");
    $('button#PageNum').css({"background-image":"url('css/1.png')"});
    slideNumber = 1;
    $('.previous').hide();
    console.log(slideNumber);
    $('.next').show();
    $('.return').hide();
    if (MarkerLayerH && MarkerLayerM && MarkerLayerL) {
      map.removeLayer(MarkerLayerH);
      map.removeLayer(MarkerLayerM);
      map.removeLayer(MarkerLayerL);
    }
    $('.Selector').hide();
    $('.ButtonMap').show();
  });

//////////////////////////////////Previous button
  $('#previous').click(function(){
    if (MarkerLayer) {
      map.removeLayer(MarkerLayer);
    }
    slideNumber -= 1;
    //console.log(slideNumber);
    if (slideNumber === 1) {
      $('.Narratives').text("Press button to show all the food inspections in the selecting zipcode area(60649)");
      $('button#PageNum').css({"background-image":"url('css/1.png')"});
      $('.previous').hide();
      $('.ButtonMap').show();
      $('.ButtonClassify').hide();
      $('.DisplayRe').hide();
      $('.Inspection_Year').hide();
      $('.InsYear').hide();
      $('.my-legend').hide();
    } else if (slideNumber === 2) {
      if (MarkerLayer2010 && MarkerLayer2011 && MarkerLayer2012 && MarkerLayer2013 && MarkerLayer2014 && MarkerLayer2015 &&
      MarkerLayer2016 && MarkerLayer2017) {
        map.removeLayer(MarkerLayer2010);
        map.removeLayer(MarkerLayer2011);
        map.removeLayer(MarkerLayer2012);
        map.removeLayer(MarkerLayer2013);
        map.removeLayer(MarkerLayer2014);
        map.removeLayer(MarkerLayer2015);
        map.removeLayer(MarkerLayer2016);
        map.removeLayer(MarkerLayer2017);
      }
      $('button#PageNum').css({"background-image":"url('css/2.png')"});
      $('.Narratives').text("Press the button to classify the resaurant by their types");
      $('.MapData').hide();
      $('.ButtonClassify').show();
      $('.DisplayRe').hide();
      $('.Inspection_Year').hide();
      $('.ShowInfo').hide();
      $('.SideBar_Info').hide();
      $('.InsYear').text("");
    } else if (slideNumber === 3) {
      $('.Narratives').text("Press the button to show the inspection results from 2010 to 2017. Circles with green boundaries for passed. Circles with red boundaries for failed");
      $('button#PageNum').css({"background-image":"url('css/3.png')"});
      $('.ShowInfo').hide();
      $('.SideBar_Info').hide();
      $('.DisplayRe').show();
      $('.Inspection_Year').show();
      $('.InsYear').show();
      $('.Selector').hide();
    } else if (slideNumber === 4) {
      if (MarkerLayerH && MarkerLayerM && MarkerLayerL) {
        map.removeLayer(MarkerLayerH);
        map.removeLayer(MarkerLayerM);
        map.removeLayer(MarkerLayerL);
      }
      $('button#PageNum').css({"background-image":"url('css/4.png')"});
      $('.Narratives').text("Press the button to show info of all points");
      $('.Selector').hide();
      $('.ShowInfo').show();
      $('.SideBar_Info').show();
    } else if (slideNumber === 5) {
      $('button#PageNum').css({"background-image":"url('css/5.png')"});
      $('.Narratives').text("Press the button to show points with specific risks");
      $('.Selector').show();
    }
    if (slideNumber !== 5) {
      $('.return').hide();
      $('.next').show();
    }
  });
/////////////////////////////////////////Next button
  $('#next').click(function(){
    if (MarkerLayer) {
      map.removeLayer(MarkerLayer);
    }
    //var MarkerLayer;
    slideNumber += 1;
    $('.previous').show();
    console.log(slideNumber);
    if (slideNumber === 2) {
      $('button#PageNum').css({"background-image":"url('css/2.png')"});
      $('.Narratives').text("Press the button to classify the resaurant by their types");
      $('.ButtonMap').hide();
      //$('.my-legend').hide();
      $('.ButtonClassify').show();
    } else if (slideNumber === 3) {
      $('button#PageNum').css({"background-image":"url('css/3.png')"});
      $('.Narratives').text("Press the button to show the inspection results from 2010 to 2017. Circles with green boundaries for passed. Circles with red boundaries for failed");
      $('.ButtonClassify').hide();
      $('.my-legend').hide();
      $('.DisplayRe').show();
      $('.Inspection_Year').show();
      $('.InsYear').show();
      $('.Selector').hide();
    } else if (slideNumber === 4) {
      if (MarkerLayer2010 && MarkerLayer2011 && MarkerLayer2012 && MarkerLayer2013 && MarkerLayer2014 && MarkerLayer2015 &&
      MarkerLayer2016 && MarkerLayer2017) {
        map.removeLayer(MarkerLayer2010);
        map.removeLayer(MarkerLayer2011);
        map.removeLayer(MarkerLayer2012);
        map.removeLayer(MarkerLayer2013);
        map.removeLayer(MarkerLayer2014);
        map.removeLayer(MarkerLayer2015);
        map.removeLayer(MarkerLayer2016);
        map.removeLayer(MarkerLayer2017);
      }
      $('button#PageNum').css({"background-image":"url('css/4.png')"});
      $('.Narratives').text("Press the button to show info of all points");
      $('.InsYear').text("");
      $('.ShowInfo').show();
      $('.SideBar_Info').show();
      $('.DisplayRe').hide();
      $('.Inspection_Year').hide();
      $('.InsYear').hide();
    } else if (slideNumber === 5) {
      $('button#PageNum').css({"background-image":"url('css/5.png')"});
      if (MarkerLayer) {
        map.removeLayer(MarkerLayer);
      }
      $('.Narratives').text("Press the button to show points with specific risks");
      $('.ShowInfo').hide();
      $('.SideBar_Info').hide();
      $('.Selector').show();
      $('.next').hide();
      $('.return').show();
    }
  });


  //reset view function
  var ResetView = function(){
    map.setView([41.921271, -87.702531],14);
  };
  //parse data function
  var downloadCrimeData = $.ajax(DatasourceURL);
  var parseData = function(data) {
      var parsedInfo =  JSON.parse(data);
      return parsedInfo;
  };

  downloadCrimeData.done(function(data){
     parseData(data);
  });
  //different circlemarker options
  var CircleMarkerOptions = {
    radius: 8,
    fillColor: "#95a5a6",
    color: "#ffffff",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8
  };

  var BakeryMarkerOptions = {
    radius: 8,
    fillColor: "#1abc9c",
    color: "#ffffff",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8
  };
  var GroceryMarkerOptions = {
    radius: 8,
    fillColor: "#3498db",
    color: "#ffffff",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8
  };
  var LiquorMarkerOptions = {
    radius: 8,
    fillColor: "#9b59b6",
    color: "#ffffff",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8
  };
  var TRUCKMarkerOptions = {
    radius: 8,
    fillColor: "#34495e",
    color: "#ffffff",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8,
  };
  var RESTAURANTMarkerOptions = {
    radius: 8,
    fillColor: "#e67e22",
    color: "#ffffff",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8
  };
  var PassedMarkerOptions = {
    radius: 8,
    fillColor: "#95a5a6",
    color: "#8BC34A",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.2
  };
  var FailedMarkerOptions = {
    radius: 8,
    fillColor: "#95a5a6",
    color: "#E91E63",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.2
  };
  var OtherMarkerOptions = {
    radius: 8,
    fillColor: "#95a5a6",
    color: "#ffffff",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.2
  };

  var myStyle = {
      "color": "#f1c40f",
      "weight": 3,
      "opacity": 0.65,
      "fillColor": "#ecf0f1",
      "fillOpacity": 0.3
  };

  var myFilter = function(feature) {
  // if (feature.properties.COLLDAY !== " ") {
  //   return feature;
  // }
  //return true;
  };

  var GroupByType = function(data) {
     GroupData = _.groupBy(data,function(data){ return data.FIELD6;});
  };
  //Original markers
  var makeMarkers = function(data) {
  //    return L.marker([data.Lat,data.Lng]);
    var NewMarkers = [];

    _.each(data,function(feature){

      if (feature.FIELD15 !== "" || feature.FIELD16 !== "") {
        NewMarkers.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],CircleMarkerOptions).
        bindPopup("Name:" + feature.FIELD2 + "<br />" +
        "Facility Type:"+ feature.FIELD5 +  "<br />" +
        "Violation Risk:"+ feature.FIELD6 +  "<br />" +
        "Address:"+ feature.FIELD7 +  "<br />" +
        "City:"+ feature.FIELD8 +  "<br />" +
        "State:"+ feature.FIELD9 +  "<br />" +
        "Date:"+ feature.FIELD11));
      }
    });
    return NewMarkers;
  };
  //Classifies markers
  var makeClassifiedMarkers = function(data) {
  //    return L.marker([data.Lat,data.Lng]);
    var NewMarkers = [];

    _.each(data,function(feature){
  //    console.log(feature);
      if (feature.FIELD15 !== "" || feature.FIELD16 !== "") {

        switch (feature.FIELD5) {
            case 'Bakery': return NewMarkers.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],BakeryMarkerOptions).
            bindPopup("Name:" + feature.FIELD2 + "<br />" +
            "Facility Type:"+ feature.FIELD5 +  "<br />" +
            "Violation Risk:"+ feature.FIELD6 +  "<br />" +
            "Address:"+ feature.FIELD7 +  "<br />" +
            "City:"+ feature.FIELD8 +  "<br />" +
            "State:"+ feature.FIELD9 +  "<br />" +
            "Date:"+ feature.FIELD11));
            case 'Grocery Store':   return NewMarkers.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],GroceryMarkerOptions).
            bindPopup("Name:" + feature.FIELD2 + "<br />" +
            "Facility Type:"+ feature.FIELD5 +  "<br />" +
            "Violation Risk:"+ feature.FIELD6 +  "<br />" +
            "Address:"+ feature.FIELD7 +  "<br />" +
            "City:"+ feature.FIELD8 +  "<br />" +
            "State:"+ feature.FIELD9 +  "<br />" +
            "Date:"+ feature.FIELD11));
            case 'Liquor': return NewMarkers.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],LiquorMarkerOptions).
            bindPopup("Name:" + feature.FIELD2 + "<br />" +
            "Facility Type:"+ feature.FIELD5 +  "<br />" +
            "Violation Risk:"+ feature.FIELD6 +  "<br />" +
            "Address:"+ feature.FIELD7 +  "<br />" +
            "City:"+ feature.FIELD8 +  "<br />" +
            "State:"+ feature.FIELD9 +  "<br />" +
            "Date:"+ feature.FIELD11));
            case 'MOBILE FOOD TRUCK':  return NewMarkers.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],TRUCKMarkerOptions).
            bindPopup("Name:" + feature.FIELD2 + "<br />" +
            "Facility Type:"+ feature.FIELD5 +  "<br />" +
            "Violation Risk:"+ feature.FIELD6 +  "<br />" +
            "Address:"+ feature.FIELD7 +  "<br />" +
            "City:"+ feature.FIELD8 +  "<br />" +
            "State:"+ feature.FIELD9 +  "<br />" +
            "Date:"+ feature.FIELD11));
            case 'Restaurant': return NewMarkers.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],RESTAURANTMarkerOptions).
            bindPopup("Name:" + feature.FIELD2 + "<br />" +
            "Facility Type:"+ feature.FIELD5 +  "<br />" +
            "Violation Risk:"+ feature.FIELD6 +  "<br />" +
            "Address:"+ feature.FIELD7 +  "<br />" +
            "City:"+ feature.FIELD8 +  "<br />" +
            "State:"+ feature.FIELD9 +  "<br />" +
            "Date:"+ feature.FIELD11));
            default: return NewMarkers.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],CircleMarkerOptions).
            bindPopup("Name:" + feature.FIELD2 + "<br />" +
            "Facility Type:"+ feature.FIELD5 +  "<br />" +
            "Violation Risk:"+ feature.FIELD6 +  "<br />" +
            "Address:"+ feature.FIELD7 +  "<br />" +
            "City:"+ feature.FIELD8 +  "<br />" +
            "State:"+ feature.FIELD9 +  "<br />" +
            "Date:"+ feature.FIELD11));
        }

        console.log(feature);
      }
    });
    //console.log(NewMarkers);
    return NewMarkers;
  };

  //Plot markers
  var plotMarkers = function(markers) {
  //  markers.addTo(map);
    //console.log(markers);
    //console.log(popup);
    MarkerLayer = L.layerGroup(markers);
    console.log(MarkerLayer);
    MarkerLayer.addTo(map);
  };

  var removeMarkers = function(markers) {
  //  map.removeLayer(markers);
    _.each(markers,function(markers){
      map.removeLayer(markers);
    });
  };

  var Count2010 = 0;
  var Count2011 = 0;
  var Count2012 = 0;
  var Count2013 = 0;
  var Count2014 = 0;
  var Count2015 = 0;
  var Count2016 = 0;
  var Count2017 = 0;

  var DisplayResult = function(data){
    //create one empty GeoJson layer
    // var ResultLayer = L.geoJson(false, {
    //   pointToLayer: function (feature, latlng) {
    //       return L.circleMarker(latlng, style(feature)); //new style function
    //   },
    //   //onEachFeature: onEachDot // new onEachDot function
    // }).addTo(map);
    //Classify markers into different groups by Date
    //2010
    //console.log("Group2010");
    _.each(data,function(feature){
      if (feature.FIELD11.includes(2010)) {
        Count2010 +=1;
        switch (feature.FIELD13) {
          case 'Pass':  return Group2010.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],PassedMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
          case 'Fail':  return Group2010.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],FailedMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
          default:  return Group2010.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],OtherMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
        }
        console.log("Group2010");
      }
    });
    //2011
    _.each(data,function(feature){
      if (feature.FIELD11.includes(2011)) {
        Count2011 +=1;
        switch (feature.FIELD13) {
          case 'Pass':  return Group2011.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],PassedMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
          case 'Fail':  return Group2011.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],FailedMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
          default:  return Group2011.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],OtherMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
        }
      }
    });
    //2012
    _.each(data,function(feature){
      if (feature.FIELD11.includes(2012)) {
        Count2012 +=1;
        switch (feature.FIELD13) {
          case 'Pass':  return Group2012.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],PassedMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
          case 'Fail':  return Group2012.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],FailedMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
          default:  return Group2012.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],OtherMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
        }
      }
    });
    //2013
    _.each(data,function(feature){
      if (feature.FIELD11.includes(2013)) {
        Count2013 +=1;
        switch (feature.FIELD13) {
          case 'Pass':  return Group2013.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],PassedMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
          case 'Fail':  return Group2013.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],FailedMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
          default:  return Group2013.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],OtherMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
        }
      }
    });
    //2014
    _.each(data,function(feature){
      if (feature.FIELD11.includes(2014)) {
        Count2014 +=1;
        switch (feature.FIELD13) {
          case 'Pass':  return Group2014.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],PassedMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
          case 'Fail':  return Group2014.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],FailedMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
          default:  return Group2014.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],OtherMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
        }
      }
    });
    //2015
    _.each(data,function(feature){
      if (feature.FIELD11.includes(2015)) {
        Count2015 +=1;
        switch (feature.FIELD13) {
          case 'Pass':  return Group2015.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],PassedMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
          case 'Fail':  return Group2015.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],FailedMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
          default:  return Group2015.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],OtherMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
        }
      }
    });
    //2016
    _.each(data,function(feature){
      if (feature.FIELD11.includes(2016)) {
        Count2016 +=1;
        switch (feature.FIELD13) {
          case 'Pass':  return Group2016.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],PassedMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
          case 'Fail':  return Group2016.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],FailedMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
          default:  return Group2016.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],OtherMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
        }
      }
    });
    //2017
    _.each(data,function(feature){
      if (feature.FIELD11.includes(2017)) {
        Count2017 +=1;
        switch (feature.FIELD13) {
          case 'Pass':  return Group2017.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],PassedMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
          case 'Fail':  return Group2017.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],FailedMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
          default:  return Group2017.push(L.circleMarker([Number(feature.FIELD15),Number(feature.FIELD16)],OtherMarkerOptions).
          bindPopup("Name:" + feature.FIELD2 + "<br />" +
          "Facility Type:"+ feature.FIELD5 +  "<br />" +
          "Violation Risk:"+ feature.FIELD6 +  "<br />" +
          "Address:"+ feature.FIELD7 +  "<br />" +
          "City:"+ feature.FIELD8 +  "<br />" +
          "State:"+ feature.FIELD9 +  "<br />" +
          "Date:"+ feature.FIELD11));
        }
      }
    });


    function AddMarkers() {
      console.log("did clicked");
      $('.Inspection_Year').show();
      //create a new dot and add it to the existing layer
      // var newDot = make_dot(dotIndex);
      // dotLayer.addData(newDot);
      //
      // ++dotIndex;
      if (TimerCount === 0) {
        $('.InsYear').text(2010);
        // _.each(Group2010,function(markers){
        //   markers.addTo(map);
        // });
        MarkerLayer2010 = L.layerGroup(Group2010);
        MarkerLayer2010.addTo(map);
        TimerCount += 1;
      }else if (TimerCount === 1) {
        $('.InsYear').text(2011);
        // _.each(Group2011,function(markers){
        //   markers.addTo(map);
        // });
        MarkerLayer2011 = L.layerGroup(Group2011);
        MarkerLayer2011.addTo(map);
        TimerCount += 1;
        console.log(TimerCount);
      }else if (TimerCount === 2) {
        $('.InsYear').text(2012);
        // _.each(Group2012,function(markers){
        //   markers.addTo(map);
        // });
        MarkerLayer2012 = L.layerGroup(Group2012);
        MarkerLayer2012.addTo(map);
        TimerCount += 1;
        console.log(TimerCount);
      }else if (TimerCount === 3) {
        $('.InsYear').text(2013);
        // _.each(Group2013,function(markers){
        //   markers.addTo(map);
        // });
        MarkerLayer2013 = L.layerGroup(Group2013);
        MarkerLayer2013.addTo(map);
        TimerCount += 1;
        console.log(TimerCount);
      }else if (TimerCount === 4) {
        $('.InsYear').text(2014);
        // _.each(Group2014,function(markers){
        //   markers.addTo(map);
        // });
        MarkerLayer2014 = L.layerGroup(Group2014);
        MarkerLayer2014.addTo(map);
        TimerCount += 1;
        console.log(TimerCount);
      }else if (TimerCount === 5) {
        $('.InsYear').text(2015);
        // _.each(Group2015,function(markers){
        //   markers.addTo(map);
        // });
        MarkerLayer2015 = L.layerGroup(Group2015);
        MarkerLayer2015.addTo(map);
        TimerCount += 1;
        console.log(TimerCount);
      }else if (TimerCount === 6) {
        $('.InsYear').text(2016);
        // _.each(Group2016,function(markers){
        //   markers.addTo(map);
        // });
        MarkerLayer2016 = L.layerGroup(Group2016);
        MarkerLayer2016.addTo(map);
        TimerCount += 1;
        console.log(TimerCount);
      }else if (TimerCount === 7) {
        $('.InsYear').text(2017);
        // _.each(Group2017,function(markers){
        //   markers.addTo(map);
        // });
        MarkerLayer2017 = L.layerGroup(Group2017);
        MarkerLayer2017.addTo(map);
        TimerCount += 1;
        console.log(TimerCount);
      } else if (TimerCount === 8) clearInterval(dotClock);
    }
    var dotInterval = 1333; // Add new dots every interval ms
    var dotClock = setInterval(AddMarkers, dotInterval);
  };


  var hiden = false;
  //Hiding sidebar button click function
  $('button#hide').click(
    function(){
      hiden = !hiden;
      if(hiden) {
        $('#sidebar').animate({width:0});
        $('#map').animate({left:0});
        $('button#hide').css({"background-image":"url('css/inveye.png')"});
      }else {
        $('#sidebar').animate({width:340});
        $('#map').animate({left:340});
        $('button#hide').css({"background-image":"url('css/veye.png')"});
      }
    }
  );


});
