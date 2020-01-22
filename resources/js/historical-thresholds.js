'use strict';

// add auto hide for what is this.

$(function () {

  enableCustomSelect('chartmap-select');
  enableCustomSelect('stations-select');
  enableCustomSelect('download-select');
  enableCustomSelect('threshold-variable-select');

  // get city, state from state url
  $('#default-city-state').text(window.ce.ce('getLocationPageState')['city']);
  $('#default-city-county').text(window.ce.ce('getLocationPageState')['county']);
  $('#cards-search-input').val(window.ce.ce('getLocationPageState')['city']);

  var stationsMapState = window.ce.ce("getStationsMapState");
  var county = window.ce.ce('getLocationPageState')['county'];
  var city = window.ce.ce('getLocationPageState')['city'];
  var zoom = window.ce.ce('getLocationPageState')['zoom'] || 9;
  var lat = window.ce.ce('getLocationPageState')['lat'];
  var lon = window.ce.ce('getLocationPageState')['lon'];
  var mode = 'thresholds'; // stationsMapState['mode'];
  var stationId = stationsMapState['stationId'];
  var stationName = stationsMapState['stationName'];
  var tidalStationId = stationsMapState['tidalStationId'];
  var tidalStationName = stationsMapState['tidalStationName'];
  var tidalStationMOverMHHW = stationsMapState['tidalStationMOverMHHW'];
  var center = [lat, lon];
  var threshold = stationsMapState['threshold'] || 1;
  var windowValue = stationsMapState['window'] || 1;
  var thresholdVariable = stationsMapState['thresholdVariable'] || 'precipitation';

  // initialize staion map state from url values
  stationsMapState = {
    city: city,
    county: county,
    mode: mode,
    stationId: stationId,
    stationName: stationName,
    tidalStationId: tidalStationId,
    tidalStationName: tidalStationName,
    tidalStationMOverMHHW: tidalStationMOverMHHW,
    threshold: threshold,
    window: windowValue,
    thresholdVariable: thresholdVariable,
    lat: lat,
    lon: lon,
    zoom: zoom,
    center: center
  };

  var thresholdStationsDataURL = "https://data.rcc-acis.org/StnData";
  var initialObj = {
    station: stationsMapState.stationId, // GHCN-D Station id (required)
    variable: stationsMapState.thresholdVariable, // Valid values: 'precipitation', 'tmax', 'tmin', 'tavg'
    threshold: stationsMapState.threshold,
    responsive: true,
    thresholdOperator: '>', // Valid values: '==', '>=', '>', '<=', '<'
    thresholdFilter: '', // Transformations/Filters to support additional units. Valid Values: 'KtoC','CtoK','FtoC','CtoF','InchToCM','CMtoInch'
    thresholdFunction: undefined, //Pass in a custom function: function(this, values){ return _.sum(values) > v2; }
    window: stationsMapState.window, // Rolling window size in days.
    dailyValueValidator: undefined, // Pass in a custom validator predicate function(value, date){return date.slice(0, 4) > 1960 && value > 5 }
    yearValidator: undefined, // Similar to dailyValueValidator
    dataAPIEndpoint: thresholdStationsDataURL.split('StnData')[0],
    barColor: '#307bda' // Color for bars.
  };

  updateThresholdVariableSelectText(initialObj);
  $('#threshold-value').val(initialObj.threshold);
  $('#window-value').val(initialObj.window);

  $("#thresholds-container").item(initialObj);
  $("#thresholds-container").item(initialObj);

  // updates the visible text for the station pulldown with the information from the state url
  function updateStationSelectText(stations) {
    var stationsSelectElem = $('#stations-select-vis');
    if (stationsSelectElem) {
      if (stations.stationId !== undefined) {
        stationsSelectElem.attr('rel', stations.stationId + ',' + stations.stationName);
        stationsSelectElem.text(stations.stationName + ' - (' + stations.stationId + ')');
      }
    }
  }

  // updates the visible text for the Threshold Variable pulldown with the information from the state url
  function updateThresholdVariableSelectText(initialObj) {
    var thresholdVariableSelectElem = $('#threshold-variable-select-vis');
    var thresholdVariable = initialObj.variable;

    if (thresholdVariableSelectElem) {
      if (thresholdVariable !== undefined) {
        thresholdVariableSelectElem.attr('rel', thresholdVariable);
        switch (thresholdVariable) {
          case 'precipitation':
            thresholdVariableSelectElem.text('Precipitation');
            break;
          case 'tmax':
            thresholdVariableSelectElem.text('Maximum Temperature');
            break;
          case 'tmin':
            thresholdVariableSelectElem.text('Minimum Temperature');
            break;
          case 'tavg':
            thresholdVariableSelectElem.text('Average Temperature');
            break;
          default:
            thresholdVariableSelectElem.text('Precipitation');
        }
      }
    }

    thresholdVariableChanged($(thresholdVariableSelectElem));
  }

  // the way graphs are handled and initialized require them to visible
  // so we move them off the screen.  this not ideal but we can move
  // trade them with the map when we the use needs them
  function resetGraphs(stations) {
    // remove and reset old graphs
    $('#stations-graph-wrap').empty();

    // add new graph wrappers so they will initialize
    $('#stations-graph-wrap').append('<div id="thresholds-container" class="d-flex-center width-100"></div>');

    // update graphs with new station id and station name
    $('#thresholds-container').item({
      variable: stations.variable,
      station: stations.stationId,
      stationName: stations.stationName,
      window: stations.window,
      threshold: stations.stations
    }).item('update');
  }

  // updates the visible text for the station pulldown with the information from the state url
  updateStationSelectText({ stationName: stationName, stationId: stationId });

  // show graph overlay.
  // graph is visbile and on page just pushed of viewable area
  // so we can intialize it when needed
  function showGraphs() {
    var stationsGraphRowElem = document.getElementById('stations-graph-row');
    var stationsMapRowElem = document.getElementById('stations-map-row');

    // unhide chart overlay
    if (stationsGraphRowElem) {
      stationsGraphRowElem.classList.remove('d-off');
      stationsGraphRowElem.classList.add('d-flex');
    }

    // hide chart overlay
    if (stationsMapRowElem) {
      stationsMapRowElem.classList.add('d-off');
      stationsMapRowElem.classList.remove('d-flex');
    }
  }

  // show map overlay.
  // map is visbile and on page just pushed of viewable area
  // so we can intialize it when needed
  function showMap() {
    var stationsGraphRowElem = document.getElementById('stations-graph-row');
    var stationsMapRowElem = document.getElementById('stations-map-row');

    // unhide chart overlay
    if (stationsGraphRowElem) {
      stationsGraphRowElem.classList.remove('d-flex');
      stationsGraphRowElem.classList.add('d-off');
    }

    // unhide map overlay
    if (stationsMapRowElem) {
      stationsMapRowElem.classList.add('d-flex');
      stationsMapRowElem.classList.remove('d-off');
    }
  }

  // reuturn attribute of html element based on rel for dropdown or val based on button
  // we probably should switch all elements to val for consistency.
  function RelorVal(target) {
    if (target.attr('val') === undefined || target.attr('val') === null) {
      return target.attr('rel');
    }
    return target.attr('val');
  }

  function chooseGraphOrMap(target) {
    // check val of button to see if user is on map  or chart
    // hide or unhide the appropriate overlay (map, chart)
    switch (RelorVal(target)) {
      case 'chart':
        // unhide chart overlay
        showGraphs();
        break;
      case 'map':
        // unhide map overlay
        showMap();
        break;
      default:
        // unhide chart overlay
        showGraphs();
    }
    forceResize();
  }

  function toggleChartInfoText(val) {
    var ChartInfoTextElem = document.getElementById('station-info-row');
    if (ChartInfoTextElem) {
      switch (val) {
        case 'chart':
          // unhide chart text
          ChartInfoTextElem.setAttribute("style", 'display: block;');
          break;
        case 'map':
          // unhide map overlay
          ChartInfoTextElem.setAttribute("style", 'display: none !important;');
          break;
        default:
          // unhide chart text
          ChartInfoTextElem.setAttribute("style", 'display: block;');
      }
    }
  }

  function toggleDownloads() {
    var target = $('#downnloads-select-vis');
    if (target.hasClass('disabled')) {
      target.removeClass('disabled');
      enableCustomSelect('download-select');
    }
  }

  // update chart pulldown to chart as default
  function chartPulldownChartText() {
    // updart pulldown default of chart
    var chartMapElem = $('#chartmap-select-vis');
    if (chartMapElem) {
      chartMapElem.attr('rel', 'chart');
      chartMapElem.text('Chart');
    }
  }

  // if state url has a station render station and not map.
  if (stationId) {
    // // unhide chart overlay
    showGraphs();

    // get current threshold values
    var variableValue = $('#threshold-variable-select-vis').attr('rel');
    var _windowValue = parseInt($('#window-value').val());
    var thresholdValue = parseFloat($('#threshold-value').val());

    // reset graphs
    resetGraphs({
      stationId: stationId,
      stationName: stationName,
      variable: variableValue,
      window: _windowValue,
      threshold: thresholdValue,
      from: 'stationid'
    });

    // toggle button visual state
    toggleButton($('.btn-chart'));

    // update chart pulldown to chart as default
    chartPulldownChartText();

    // updates the visible text for the station pulldown with the information from the state url
    updateStationSelectText({ stationName: stationName, stationId: stationId });

    toggleChartInfoText('chart');

    toggleDownloads();

    setTimeout(function () {
      // reset map and chart sizes
      // filer transistion means heigh will be updates in few seconds
      // so delaying the resize ensures proper size
      setMapSize();
    }, 600);
  } else {
    showMap();
    toggleChartInfoText('map');
    setMapSize();
  }

  // function to enable downloads (images and data)
  $('.download-select li a').click(function (e) {
    var downloadAction = $(this).attr('rel');
    var stationsMapState = window.ce.ce("getStationsMapState");
    var stationId = stationsMapState['stationId'];

    // capture what we are downloading
    switch (downloadAction) {
      case 'download-thresholds-image':
        // download image
        event.target.href = $("#thresholds-container canvas")[0].toDataURL('image/png');
        event.target.download = "thresholds_" + stationId + ".png";
        break;
      case 'download-thresholds-data':
        $("#thresholds-container").item('downloadExceedanceData', event.currentTarget);
        break;
      default:
        event.target.href = $("#thresholds-container canvas")[0].toDataURL('image/png');
        event.target.download = "thresholds_" + stationId + ".png";
    }
  });

  // imcrement threshold
  $('.threshold-up').click(function (e) {
    var target = $(e.target);
    var thresholdValueElem = document.getElementById('threshold-value');

    // ensure thresholdValue element exits
    if (thresholdValueElem) {

      // get thresholdValue element values
      var min = parseFloat(thresholdValueElem.getAttribute('min')).toFixed(1);
      var max = parseFloat(thresholdValueElem.getAttribute('max')).toFixed(1);
      var step = parseFloat(thresholdValueElem.getAttribute('step')).toFixed(1);
      var val = parseFloat($(thresholdValueElem).val()).toFixed(1);
      var newVal = parseFloat(parseFloat(val) + parseFloat(step)).toFixed(1);
      if (parseFloat(newVal) > parseFloat(max)) {
        $(thresholdValueElem).val(val);
      } else {
        $(thresholdValueElem).val(newVal);

        var stations = $('#stations-select-vis').attr('rel').split(',');
        var _stationName = stations[1];
        var _stationId = stations[0];
        var _variableValue = $('#threshold-variable-select-vis').attr('rel'); //  , thresholdValue: variableValue

        // change map url state
        window.ce.ce('setStationsMapState', { stationId: _stationId, stationName: _stationName, threshold: newVal, thresholdValue: _variableValue });

        $("#thresholds-container").item({
          threshold: newVal
        }).item('update');
      }
    }
  });

  // descrememt threshold
  $('.threshold-down').click(function (e) {
    var target = $(e.target);
    var thresholdValueElem = document.getElementById('threshold-value');
    if (thresholdValueElem) {
      var min = parseFloat(thresholdValueElem.getAttribute('min')).toFixed(1);
      var max = parseFloat(thresholdValueElem.getAttribute('max')).toFixed(1);
      var step = parseFloat(thresholdValueElem.getAttribute('step')).toFixed(1);
      var val = parseFloat($(thresholdValueElem).val()).toFixed(1);
      var newVal = parseFloat(parseFloat(val) - parseFloat(step)).toFixed(1);

      if (parseFloat(newVal) < parseFloat(min)) {
        $(thresholdValueElem).val(val);
      } else {
        $(thresholdValueElem).val(newVal);

        var stations = $('#stations-select-vis').attr('rel').split(',');
        var _stationName2 = stations[1];
        var _stationId2 = stations[0];
        var _variableValue2 = $('#threshold-variable-select-vis').attr('rel'); //  , thresholdValue: variableValue

        // change map url state
        window.ce.ce('setStationsMapState', { stationId: _stationId2, stationName: _stationName2, threshold: newVal, thresholdValue: _variableValue2 });

        $("#thresholds-container").item({
          threshold: newVal
        }).item('update');
      }
    }
  });

  // imcrement window
  $('.window-up').click(function (e) {
    var target = $(e.target);
    var windowValueElem = document.getElementById('window-value');
    if (windowValueElem) {
      var min = parseFloat(windowValueElem.getAttribute('min')).toFixed(1);
      var max = parseFloat(windowValueElem.getAttribute('max')).toFixed(1);
      var step = parseFloat(windowValueElem.getAttribute('step')).toFixed(1);
      var val = parseFloat($(windowValueElem).val()).toFixed(1);
      var newVal = parseFloat(parseFloat(val) + parseFloat(step)).toFixed(1);

      if (parseFloat(newVal) > parseFloat(max)) {
        $(windowValueElem).val(val);
      } else {
        $(windowValueElem).val(newVal);

        var stations = $('#stations-select-vis').attr('rel').split(',');
        var _stationName3 = stations[1];
        var _stationId3 = stations[0];
        var _variableValue3 = $('#threshold-variable-select-vis').attr('rel'); //  , thresholdValue: variableValue

        // change map url state
        window.ce.ce('setStationsMapState', { stationId: _stationId3, stationName: _stationName3, window: newVal, thresholdValue: _variableValue3 });

        $("#thresholds-container").item({
          window: newVal
        }).item('update');
      }
    }
  });

  // descrememt window
  $('.window-down').click(function (e) {
    var target = $(e.target);
    var windowValueElem = document.getElementById('window-value');
    if (windowValueElem) {
      var min = parseFloat(windowValueElem.getAttribute('min')).toFixed(1);
      var max = parseFloat(windowValueElem.getAttribute('max')).toFixed(1);
      var step = parseFloat(windowValueElem.getAttribute('step')).toFixed(1);
      var val = parseFloat($(windowValueElem).val()).toFixed(1);
      var newVal = parseFloat(parseFloat(val) - parseFloat(step)).toFixed(1);

      if (parseFloat(newVal) < parseFloat(min)) {
        $(windowValueElem).val(val);
      } else {
        $(windowValueElem).val(newVal);

        var stations = $('#stations-select-vis').attr('rel').split(',');
        var _stationName4 = stations[1];
        var _stationId4 = stations[0];
        var _variableValue4 = $('#threshold-variable-select-vis').attr('rel'); //  , thresholdValue: variableValue

        // change map url state
        window.ce.ce('setStationsMapState', { stationId: _stationId4, stationName: _stationName4, window: newVal, thresholdValue: _variableValue4 });

        $("#thresholds-container").item({
          window: newVal
        }).item('update');
      }
    }
  });

  function thresholdVariableChanged(target) {
    var notDisabled = !target.hasClass('disabled');
    if (notDisabled) {
      var val = $('#threshold-variable-select-vis').attr('rel');
      var thresholdValueElem = document.getElementById('threshold-value');
      var windowValueElem = document.getElementById('window-value');
      if (thresholdValueElem) {
        // capture what we are downloading
        switch (val) {
          case 'precipitation':
            thresholdValueElem.setAttribute('min', 0);
            thresholdValueElem.setAttribute('max', 150);
            thresholdValueElem.setAttribute('step', .1);
            thresholdValueElem.setAttribute('value', 1);
            $(thresholdValueElem).val(1);
            document.getElementById('threshold-unit').innerHTML = ' in inches';
            break;
          case 'tavg':
            thresholdValueElem.setAttribute('min', -200);
            thresholdValueElem.setAttribute('max', 200);
            thresholdValueElem.setAttribute('step', .1);
            thresholdValueElem.setAttribute('value', 70);
            $(thresholdValueElem).val(70);
            document.getElementById('threshold-unit').innerHTML = ' °F';
            break;
          case 'tmin':
            thresholdValueElem.setAttribute('min', -200);
            thresholdValueElem.setAttribute('max', 200);
            thresholdValueElem.setAttribute('step', .1);
            thresholdValueElem.setAttribute('value', 32);
            $(thresholdValueElem).val(32);
            document.getElementById('threshold-unit').innerHTML = ' °F';
            break;
          case 'tmax':
            thresholdValueElem.setAttribute('min', -200);
            thresholdValueElem.setAttribute('max', 200);
            thresholdValueElem.setAttribute('step', .1);
            thresholdValueElem.setAttribute('value', 95);
            $(thresholdValueElem).val(95);
            document.getElementById('threshold-unit').innerHTML = ' °F';
            break;
          default:
            thresholdValueElem.setAttribute('min', 0);
            thresholdValueElem.setAttribute('max', 150);
            thresholdValueElem.setAttribute('step', .1);
            thresholdValueElem.setAttribute('value', 1);
            $(thresholdValueElem).val(1);
            document.getElementById('threshold-unit').innerHTML = ' in inches';
        }
      }

      var _variableValue5 = val;
      var _windowValue2 = parseInt($('#window-value').val());
      var _thresholdValue = parseFloat($('#threshold-value').val());

      var stations = $('#stations-select-vis').attr('rel').split(',');
      var _stationName5 = stations[1];
      var _stationId5 = stations[0];

      // change map url state
      window.ce.ce('setStationsMapState', { stationId: _stationId5, stationName: _stationName5, threshold: _thresholdValue, window: _windowValue2, thresholdVariable: _variableValue5 });

      $("#thresholds-container").item({
        threshold: _thresholdValue,
        window: _windowValue2,
        variable: _variableValue5
      }).item('update');
    }
  }
  // in resposnive mode, event hanlder a for when season (time) varriable changes
  $('#threshold-variable-select-vis').bind('cs-changed', function (e) {
    thresholdVariableChanged($(e.target));
  });

  // in resposnive mode, event hanlder a for when season (time) varriable changes
  $('#stations-select-vis').bind('cs-changed', function (e) {
    var target = $(e.target);
    var notDisabled = !target.hasClass('disabled');
    if (notDisabled) {
      var val = $('#stations-select-vis').attr('rel').split(',');
      var _stationName6 = val[1];
      var _stationId6 = val[0];

      document.getElementById('station-info').classList.remove('d-none');
      document.getElementById('station-info-none').classList.add('d-none');
      updateStationIDText('' + _stationId6);
      updateStationText('' + _stationName6);

      // get current threshold values
      var _variableValue6 = $('#threshold-variable-select-vis').attr('rel');
      var _windowValue3 = parseInt($('#window-value').val());
      var _thresholdValue2 = parseFloat($('#threshold-value').val());

      // change map varriable
      window.ce.ce('setStationsMapState', { stationId: _stationId6, stationName: _stationName6, threshold: _thresholdValue2, window: _windowValue3, thresholdVariable: _variableValue6 });

      // state url object
      stationsMapState = {
        county: county,
        mode: mode,
        stationId: _stationId6,
        stationName: _stationName6,
        tidalStationId: tidalStationId,
        tidalStationName: tidalStationName,
        tidalStationMOverMHHW: tidalStationMOverMHHW,
        lat: lat,
        lon: lon,
        zoom: zoom,
        center: center,
        threshold: _thresholdValue2,
        window: _windowValue3,
        thresholdVariable: _variableValue6
      };

      // unhide chart overlay
      showGraphs();

      // reset graphs
      resetGraphs({
        variable: _variableValue6,
        stationId: _stationId6,
        stationName: _stationName6,
        window: _windowValue3,
        threshold: _thresholdValue2
      });

      // make sure selector actually changes
      thresholdVariableChanged($('#threshold-variable-select-vis'));

      // toggle button visual state
      toggleButton($('.btn-chart'));

      toggleChartInfoText('chart');

      toggleDownloads();

      // reset map and chart sizes
      setMapSize();
    }
  });

  // in resposnive mode, event hanlder a for when  threshold value (inches of rain temp in F) changes
  $('#threshold-value').change(function (e) {
    var target = $(e.target);
    var newValue = parseFloat($(target).val());

    var stations = $('#stations-select-vis').attr('rel').split(',');
    var stationName = stations[1];
    var stationId = stations[0];
    var variableValue = $('#threshold-variable-select-vis').attr('rel'); //  , thresholdValue: variableValue

    // change map url state
    window.ce.ce('setStationsMapState', { stationId: stationId, stationName: stationName, threshold: newValue, thresholdValue: variableValue });

    // update chart with new threshold value
    $("#thresholds-container").item({ threshold: newValue }).item('update');
  });

  // in resposnive mode, event hanlder a for when  window value (duration of days) changes
  $('#window-value').change(function (e) {
    var target = $(e.target);
    var newValue = parseInt($(target).val());

    var stations = $('#stations-select-vis').attr('rel').split(',');
    var stationName = stations[1];
    var stationId = stations[0];
    var variableValue = $('#threshold-variable-select-vis').attr('rel'); //  , thresholdValue: variableValue

    // change map url state
    window.ce.ce('setStationsMapState', { stationId: stationId, stationName: stationName, window: newValue, thresholdValue: variableValue });

    // update chart with new threshold value
    $("#thresholds-container").item({ window: newValue }).item('update');
  });

  // eanbles time chart, map click events
  $('#chartmap-wrapper').click(function (e) {
    var target = $(e.target);
    var notDisabled = !target.hasClass('btn-default-disabled') || !target.hasClass('disabled');

    if (notDisabled) {

      // toggle button visual state
      toggleButton($(target));

      // change select pulldowns for resposnive mode
      setSelectFromButton(target);

      // check val of button to see if user is on map  or chart
      // hide or unhide the appropriate overlay (map, chart)
      chooseGraphOrMap(target);
      toggleChartInfoText(RelorVal(target));
    }

    // reset map and chart sizes
    setMapSize();
    chooseGraphOrMap(target);
  });

  // in repsonsive mode the time is a pulldown this eanbles the change of the chart map
  $('#chartmap-select-vis').bind('cs-changed', function (e) {
    var target = $(e.target);
    var notDisabled = !target.hasClass('disabled');
    if (notDisabled) {
      var val = $('#time-select-vis').attr('rel');

      // toggle button visual state
      toggleButton($('.btn-' + $('#chartmap-select-vis').attr('rel')));

      // check val of button to see if user is on map  or chart
      // hide or unhide the appropriate overlay (map, chart)
      chooseGraphOrMap(target);
      toggleChartInfoText(RelorVal(target));
    }
    // reset map and chart sizes
    setMapSize();
  });

  // this function Updates the chart title.
  function updateTitle(chartText) {
    $('#default-chart-map-varriable').html(chartText);
  }

  // this function Updates the chart title.
  function updateStationText(text) {
    $('#default-station').html(text);
  }

  // this function Updates the chart title.
  function updateStationIDText(text) {
    $('#default-station-id').html(text);
  }

  function renderStationInfo(stationName, stationId) {
    if (stationName) {
      document.getElementById('station-info').classList.remove('d-none');
      document.getElementById('station-info-none').classList.add('d-none');
      updateStationIDText('' + stationId);
      updateStationText('' + stationName);
    } else {
      document.getElementById('station-info').classList.add('d-none');
      document.getElementById('station-info-none').classList.remove('d-none');
    }
  }

  renderStationInfo(stationName, stationId);

  // toggle filters click
  $('#filters-toggle').click(function (e) {
    var target = $(e.target);
    if (target.hasClass('closed-filters')) {
      target.removeClass('closed-filters');
    } else {
      target.addClass('closed-filters');
    }

    var infoRowElem = $('#info-row');
    if ($(infoRowElem).hasClass('closed-filters')) {
      $(infoRowElem).removeClass('closed-filters');
    } else {
      $(infoRowElem).addClass('closed-filters');
    }

    var chartRowElem = $('#stations-graph-row');
    if ($(chartRowElem).hasClass('closed-filters')) {
      $(chartRowElem).removeClass('closed-filters');
    } else {
      $(chartRowElem).addClass('closed-filters');
    }

    var stationsMapRowElem = $('#stations-map-row');
    if ($(stationsMapRowElem).hasClass('closed-filters')) {
      $(stationsMapRowElem).removeClass('closed-filters');
    } else {
      $(stationsMapRowElem).addClass('closed-filters');
    }

    setTimeout(function () {
      // reset map and chart sizes
      // filer transistion means heigh will be updates in few seconds
      // so delaying the resize ensures proper size
      setMapSize();
    }, 600);
  });

  window.stations = $('#stations-map').stationsMap(_extends({
    // When state changes, just pass the current options along directly for this page.
    // If we re-use the stationsMap widget on another page there may be more handling to do.
    change: function change(event, options) {
      window.ce.ce('setStationsMapState', options);
      renderStationInfo(options.stationId, options.stationName);

      var messsageElem = document.getElementById('stations-map-message');
      // check if there are any tidal stations in map extent
      if (options.currentstations.features.length === 0) {
        // get map parent element - which provides the correct dimensions for the map
        if (messsageElem) {
          var rect = document.getElementById('stations-map-wrap').getBoundingClientRect();
          messsageElem.style.left = (rect.right - rect.left) / 3 + 'px';
          messsageElem.style.top = '-' + (rect.bottom - rect.top) / 2 + 'px';
          messsageElem.innerHTML = 'There are no weather stations within the map view.';
          messsageElem.classList.remove('d-none');
        }
      } else {
        messsageElem.classList.add('d-none');
      }
    },

    // when user clicks on map station marker
    // show graph hide map
    // todo add this to puldown events also
    stationUpdated: function stationUpdated(event, options) {
      // unhide chart overlay
      showGraphs();

      // toggle button to select chart
      toggleButton($('.btn-chart'));

      // update chart pulldown to chart as default
      chartPulldownChartText();

      // get current threshold values
      var variableValue = $('#threshold-variable-select-vis').attr('rel');
      var windowValue = parseInt($('#window-value').val());
      var thresholdValue = parseFloat($('#threshold-value').val());

      // reset graphs
      resetGraphs({
        variable: variableValue,
        window: windowValue,
        threshold: thresholdValue,
        stationId: options.stationId,
        stationName: options.stationName
      });

      // updates the visible text for the station pulldown with the information from the state url
      updateStationSelectText({ stationName: options.stationName, stationId: options.stationId });

      options.threshold = thresholdValue;
      options.window = windowValue;
      options.thresholdVariable = variableValue;

      window.ce.ce('setStationsMapState', options);

      toggleChartInfoText('chart');

      toggleDownloads();

      thresholdVariableChanged($('#threshold-variable-select-vis'));

      setTimeout(function () {
        // reset map and chart sizes
        // filer transistion means heigh will be updates in few seconds
        // so delaying the resize ensures proper size
        setMapSize();
      }, 100);
    }
  }, stationsMapState));

  // resize map when browser is resized
  function setMapSize() {
    $('#stations-map').height($('#stations-map').parent().height());

    // get map parent element - which provides the correct dimensions for the map
    var rect = document.getElementById('stations-map-wrap').getBoundingClientRect();

    var messsageElem = document.getElementById('stations-map-message');
    // get map parent element - which provides the correct dimensions for the map
    if (messsageElem) {
      var _rect = document.getElementById('stations-map-wrap').getBoundingClientRect();
      messsageElem.style.left = (_rect.right - _rect.left) / 3 + 'px';
      messsageElem.style.top = '-' + (_rect.bottom - _rect.top) / 2 + 'px';
    }

    // set size of map overlay
    if (document.querySelector('.esri-view-root')) {
      document.querySelector('.esri-view-root').style.minWidth = rect.width + 'px';
      document.querySelector('.esri-view-root').style.maxWidth = rect.width + 'px';
      document.querySelector('.esri-view-root').style.height = rect.height + 'px';
    }

    // set size of map overlay
    if (document.querySelector('.esri-view-user-storage')) {
      document.querySelector('.esri-view-user-storage').style.minWidth = rect.width + 'px';
      document.querySelector('.esri-view-user-storage').style.maxWidth = rect.width + 'px';
    }

    // set size of map
    if (document.querySelector('#stations-map')) {
      document.querySelector('#stations-map').style.minWidth = rect.width + 'px';
      document.querySelector('#stations-map').style.maxWidth = rect.width + 'px';
      document.querySelector('#stations-map').style.width = rect.width + 'px';
      document.querySelector('#stations-map').style.height = rect.height + 'px';
    }

    // get graph parent element - which provides the correct dimensions for the graph
    var graphRect = document.getElementById('stations-graph-wrap').getBoundingClientRect();
    var graphWidth = graphRect.width;

    // when smaller than 900 (full size)
    // expand graphs to cover 100%
    if (graphRect.width <= 882) {
      graphWidth = graphRect.width;
    }

    // set size of temp chart
    if (graphRect.width <= 900) {
      if (document.querySelector('#stations-graph-row')) {
        document.querySelector('#stations-graph-row').style.height = '350px';
        document.querySelector('#stations-graph-row').style.minHeight = '350px';
      }
    }

    // set size of temp chart
    if (document.querySelector('#thresholds-container')) {
      document.querySelector('#thresholds-container').style.minWidth = graphWidth + 'px';
      document.querySelector('#thresholds-container').style.maxWidth = graphWidth + 'px';
      document.querySelector('#thresholds-container').style.width = graphWidth + 'px';
      document.querySelector('#thresholds-container').style.height = graphRect.height + 'px';
      document.querySelector('#thresholds-container').style.maxHeight = graphRect.height + 'px';
    }

    // set size of map
    if (document.querySelector('.chartjs-size-monitor')) {
      document.querySelector('.chartjs-size-monitor').style.minWidth = graphWidth + 'px';
      document.querySelector('.chartjs-size-monitor').style.maxWidth = graphWidth + 'px';
      document.querySelector('.chartjs-size-monitor').style.width = graphWidth + 'px';
      document.querySelector('.chartjs-size-monitor').style.height = graphRect.height + 'px';
    }
  }

  // reset map and chart sizes
  setMapSize();

  $(window).resize(function () {
    setMapSize();
  });

  // not sure why but on initalize does not update the graph so this makes sure url updates happen.
  // this is a bit hacky way of resolving....
  var thresholdValueTEMP = parseFloat($('#threshold-value').val());
  $("#thresholds-container").item({ threshold: thresholdValueTEMP }).item('update');
});