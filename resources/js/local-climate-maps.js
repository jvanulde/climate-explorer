'use strict';

$(function () {
  // var activeVariableTemperature = 'tmax';
  // var activeVariablePrecipitation = 'pcpn';
  // var activeVariableDerived = 'hdd';

  // get city, state from state url
  $('#default-city-state').text(window.ce.ce('getLocationPageState')['city']);
  $('#default-city-county').text(window.ce.ce('getLocationPageState')['county']);
  $('#cards-search-input').val(window.ce.ce('getLocationPageState')['city']);

  // let mapcenter = window.ce.ce('getLocationPageState')['center'];
  var mapExtent = window.ce.ce('getLocationPageState')['extent'];
  var mapZoom = window.ce.ce('getLocationPageState')['zoom'] || 9;
  var lat = window.ce.ce('getLocationPageState')['lat'];
  var lon = window.ce.ce('getLocationPageState')['lon'];
  var variable = window.ce.ce('getLocationPageState')['id'] || 'tmax';
  var city = window.ce.ce('getLocationPageState')['city'];
  var county = window.ce.ce('getLocationPageState')['county'];
  var mapcenter = [lon, lat];

  var locationMapState = {
    city: city,
    county: county,
    variable: variable,
    lat: lat,
    lon: lon,
    zoom: mapZoom,
    center: mapcenter,
    id: variable
  };

  if (isNational()) {
    lat = null, lon = null, mapcenter = null;
    mapExtent = null;
    mapZoom = 7;
  }

  // enable custom selction boxes
  enableCustomSelect('download-select');
  enableCustomSelect('stations-select');
  enableCustomSelect('varriable-select');
  enableCustomSelect('chartmap-select');
  enableCustomSelect('time-select');

  // valid seasonal varriables
  // seasonal timeperoid is only valud for limitited varriables
  // to dissable those varriabls from the user we use this constant
  var validSeasonal = ['tmax', 'tmin', 'pcpn'];

  // this function Updates the chart title.
  function updateTitle(chartText) {
    $('#default-chart-map-varriable').html(chartText);
  }

  window.addEventListener('last-left-image-added', function (e) {
    exportLeft();
  });

  window.addEventListener('last-right-image-added', function (e) {
    exportRight();
  });

  // function to enable downloads (images and data)
  $('.download-select li a').click(function (e) {
    var downloadAction = $(this).attr('rel');
    $('#temperature-map').spinner();
    // capture what we are downloading
    switch (downloadAction) {
      case 'download-rightmap-image':
        // download image
        mapToImageRight();
        break;
      case 'download-lefttmap-image':
        // download image
        mapToImageLeft();
        break;
      default:
        mapToImageRight();
    }
  });

  function addImage(imageUrl) {
    var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'left';
    var cssclass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'none';
    var add = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (add) {
      var elem = document.getElementById('map-for-print-' + side);
      elem.innerHTML = '';
    }
    var img = document.createElement('img');
    img.src = imageUrl;
    if (cssclass) {
      img.classList.add(cssclass);
    }
    img.setAttribute('crossorigin', 'anonymous');
    document.getElementById('map-for-print-' + side).appendChild(img);
  }

  function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    // hardcoded until there is a better way
    canvas.width = 147;
    canvas.height = 605;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");;
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  function exportRight() {
    // download image of images
    var elem = document.getElementById('map-for-print-right');
    elem.classList.remove('d-none');

    html2canvas($('#map-for-print-right'), {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null,
      letterRendering: 1,
      foreignObjectRendering: true,
      onrendered: function onrendered(canvas) {

        var a = document.createElement('a');
        a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        a.download = 'local-climate-map-' + variable + '-right.png';
        document.body.appendChild(a);
        a.click();
        elem.classList.add('d-none');
        document.body.removeChild(a);
        $('#temperature-map').spinner('destroy');
      }
    });
  }

  function exportLeft() {
    // download image of images
    var elem = document.getElementById('map-for-print-left');
    elem.classList.remove('d-none');

    html2canvas($('#map-for-print-left'), {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null,
      letterRendering: 1,
      foreignObjectRendering: true,
      onrendered: function onrendered(canvas) {

        var a = document.createElement('a');
        a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        a.download = 'local-climate-map-' + variable + '-left.png';
        document.body.appendChild(a);
        a.click();
        elem.classList.add('d-none');
        document.body.removeChild(a);
        $('#temperature-map').spinner('destroy');
      }
    });
  }

  function mapToImageRight() {
    // base map
    html2canvas($('#temperature-map .esri-view-root .esri-view-surface canvas.esri-display-object')[0], {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null,
      removeContainer: true,
      foreignObjectRendering: true,
      onrendered: function onrendered(canvas) {
        var imageUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        addImage(imageUrl, 'right', 'basemap', true);
      }
    });

    // export right map
    html2canvas($('#temperature-map .esri-view-root .esri-view-surface canvas.esri-display-object')[2], {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null,
      removeContainer: true,
      foreignObjectRendering: true,
      onrendered: function onrendered(canvas) {
        var imageUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        addImage(imageUrl, 'right', 'rightmap');
      }
    });

    // export label and state boundaries overlay
    html2canvas($('#temperature-map .esri-view-root .esri-view-surface canvas.esri-display-object')[4], {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null,
      removeContainer: true,
      foreignObjectRendering: true,
      onrendered: function onrendered(canvas) {
        var imageUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        addImage(imageUrl, 'right', 'label-boundaries-overlay1');
      }
    });

    // export label and state boundaries overlay
    var canvasLength = $('#temperature-map .esri-view-root .esri-view-surface canvas.esri-display-object').length;
    if (canvasLength >= 6) {
      html2canvas($('#temperature-map .esri-view-root .esri-view-surface canvas.esri-display-object')[5], {
        allowTaint: true,
        useCORS: true,
        backgroundColor: null,
        removeContainer: true,
        foreignObjectRendering: true,
        onrendered: function onrendered(canvas) {
          var imageUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
          addImage(imageUrl, 'right', 'label-boundaries-overlay2');
        }
      });
    }

    // export legend
    html2canvas($('.esri-expand__content .legend-image'), {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null,
      removeContainer: true,
      foreignObjectRendering: true,
      onrendered: function onrendered(canvas) {
        var imageUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        var base64temp = getBase64Image($('.esri-expand__content .legend-image')[0]);
        addImage(base64temp, 'right', 'legend');
      }
    });

    // export right controls
    html2canvas($('.bottom-scenario-controls .right-scenario-controls'), {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null,
      removeContainer: true,
      foreignObjectRendering: true,
      onrendered: function onrendered(canvas) {
        var imageUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        addImage(imageUrl, 'right', 'botttom-controls');
      }
    });

    // export right title
    html2canvas($('#info-text-wrapper'), {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null,
      removeContainer: true,
      foreignObjectRendering: true,
      onrendered: function onrendered(canvas) {
        var imageUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        addImage(imageUrl, 'right', 'title');
      }
    });

    // export attribution
    html2canvas($('.esri-ui-inner-container.esri-ui-manual-container .esri-component.esri-attribution.esri-widget'), {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null,
      removeContainer: true,
      foreignObjectRendering: true,
      onrendered: function onrendered(canvas) {
        var imageUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        addImage(imageUrl, 'right', 'attribution');
        var leftMapDoneEvent = new CustomEvent('last-right-image-added');
        window.dispatchEvent(leftMapDoneEvent);
      }
    });
  }

  function mapToImageLeft() {
    // base map
    html2canvas($('#temperature-map .esri-view-root .esri-view-surface canvas.esri-display-object')[0], {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null,
      removeContainer: true,
      foreignObjectRendering: true,
      onrendered: function onrendered(canvas) {
        var imageUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        addImage(imageUrl, 'left', 'basemap', true);
      }
    });

    // export left map
    html2canvas($('#temperature-map .esri-view-root .esri-view-surface canvas.esri-display-object')[1], {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null,
      removeContainer: true,
      foreignObjectRendering: true,
      onrendered: function onrendered(canvas) {
        var imageUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        addImage(imageUrl, 'left', 'leftmap');
      }
    });

    // export label and state boundaries overlay
    html2canvas($('#temperature-map .esri-view-root .esri-view-surface canvas.esri-display-object')[4], {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null,
      removeContainer: true,
      foreignObjectRendering: true,
      onrendered: function onrendered(canvas) {
        var imageUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        addImage(imageUrl, 'left', 'label-boundaries-overlay1');
      }
    });

    // export label and state boundaries overlay
    var canvasLength = $('#temperature-map .esri-view-root .esri-view-surface canvas.esri-display-object').length;
    if (canvasLength >= 6) {
      html2canvas($('#temperature-map .esri-view-root .esri-view-surface canvas.esri-display-object')[5], {
        allowTaint: true,
        useCORS: true,
        backgroundColor: null,
        removeContainer: true,
        foreignObjectRendering: true,
        onrendered: function onrendered(canvas) {
          var imageUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
          addImage(imageUrl, 'left', 'label-boundaries-overlay2');
        }
      });
    }

    // export legend
    html2canvas($('.esri-expand__content .legend-image'), {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null,
      removeContainer: true,
      foreignObjectRendering: true,
      onrendered: function onrendered(canvas) {
        var imageUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        var base64temp = getBase64Image($('.esri-expand__content .legend-image')[0]);
        addImage(base64temp, 'left', 'legend');
      }
    });

    // export left title
    html2canvas($('#info-text-wrapper'), {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null,
      removeContainer: true,
      foreignObjectRendering: true,
      onrendered: function onrendered(canvas) {
        var imageUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        addImage(imageUrl, 'left', 'title');
      }
    });

    // export left controls
    html2canvas($('.bottom-scenario-controls .left-scenario-controls'), {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null,
      removeContainer: true,
      foreignObjectRendering: true,
      onrendered: function onrendered(canvas) {
        var imageUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        addImage(imageUrl, 'left', 'botttom-controls');
      }
    });

    // export attribution
    html2canvas($('.esri-ui-inner-container.esri-ui-manual-container .esri-component.esri-attribution.esri-widget'), {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null,
      removeContainer: true,
      foreignObjectRendering: true,
      onrendered: function onrendered(canvas) {
        var imageUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        addImage(imageUrl, 'left', 'attribution');
        var leftMapDoneEvent = new CustomEvent('last-left-image-added');
        window.dispatchEvent(leftMapDoneEvent);
      }
    });
  }

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

    var chartRowElem = $('#map-row');
    if ($(chartRowElem).hasClass('closed-filters')) {
      $(chartRowElem).removeClass('closed-filters');
    } else {
      $(chartRowElem).addClass('closed-filters');
    }

    setTimeout(function () {
      // reset map and chart sizes
      // filer transistion means heigh will be updates in few seconds
      // so delaying the resize ensures proper size
      setMapSize();
    }, 600);
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

      handleChartMapClick(target);
    }
  });

  // update season map
  function updateSeason(targetval) {
    if (window.precipitationScenariosMap) {
      $(window.precipitationScenariosMap).scenarioComparisonMap({ season: targetval });
    }
  }

  // eanbles time annual, monlthly click events
  $('#time-wrapper').click(function (e) {
    var target = $(e.target);
    var notDisabled = !target.hasClass('btn-default-disabled');

    // not all varriables can display monthly chart
    // when the varriable cannot display monthly chart do
    // do execute the click event
    if (notDisabled) {
      var val = target.attr('val');

      // toggle button visual state
      toggleButton(target);

      // change select pulldowns for resposnive mode
      setSelectFromButton(target);

      // change map varriable
      updateSeason(val);
    }
  });

  // in repsonsive mode the time is a pulldown this eanbles the change of the chart map
  $('#chartmap-select-vis').bind('cs-changed', function (e) {
    var target = $(e.target);
    var notDisabled = !target.hasClass('disabled');
    if (notDisabled) {
      var val = $('#time-select-vis').attr('rel');

      // toggle button visual state
      toggleButton($('.btn-' + $('#chartmap-select-vis').attr('rel')));

      handleChartMapClick(target);
    }
  });

  // event hanlder a for when map varriable changes
  $('#varriable-select-vis').bind('cs-changed', function (e) {
    var target = $(e.target);
    var notDisabled = !target.hasClass('btn-default-disabled');
    if (notDisabled) {
      var _variable = $('#varriable-select-vis').attr('rel');
      window.ce.ce('setVariablesMapState', { variable: _variable });
      // disable varriablles if they are valid time period
      var isvalid = jQuery.inArray(_variable, validSeasonal);
      if (isvalid < 0) {
        $('.btn-summer').addClass('btn-default-disabled');
        $('.btn-summer').removeClass('btn-default');

        $('.btn-winter').addClass('btn-default-disabled');
        $('.btn-winter').removeClass('btn-default');

        $('.btn-fall').addClass('btn-default-disabled');
        $('.btn-fall').removeClass('btn-default');

        $('.btn-spring').addClass('btn-default-disabled');
        $('.btn-spring').removeClass('btn-default');

        $('#time-select-vis').addClass('disabled');
        $('#time-select-wrapper').addClass('disabled');
      } else {
        $('.btn-summer').removeClass('btn-default-disabled');
        $('.btn-summer').addClass('btn-default');

        $('.btn-winter').removeClass('btn-default-disabled');
        $('.btn-winter').addClass('btn-default');

        $('.btn-fall').removeClass('btn-default-disabled');
        $('.btn-fall').addClass('btn-default');

        $('.btn-spring').removeClass('btn-default-disabled');
        $('.btn-spring').addClass('btn-default');

        $('#time-select-vis').removeClass('disabled');
        $('#time-select-wrapper').removeClass('disabled');
      }

      // update the text
      updateTitle($('#varriable-select-vis').text());

      // change map varriable
      if (window.precipitationScenariosMap) {
        $(window.precipitationScenariosMap).scenarioComparisonMap({ variable: _variable });
      }
    }
  });

  // in resposnive mode, event hanlder a for when season (time) varriable changes
  $('#time-select-vis').bind('cs-changed', function (e) {
    var target = $(e.target);
    var notDisabled = !target.hasClass('btn-default-disabled');
    if (notDisabled) {
      var val = $('#time-select-vis').attr('rel');

      // change map varriable
      updateSeason(val);
    }
  });

  function isNational() {
    return window.ce.ce('getNavFooterState')['nav'] === 'national-climate-maps';
  }

  $('#temperature-map').height($('#temperature-map').parent().height());
  if (typeof window.precipitationScenariosMap === 'undefined') {
    $('#temperature-map').spinner();
    var _variable2 = window.ce.ce('getVariablesPageState')['variable'] || 'tmax';
    window.precipitationScenariosMap = $('#temperature-map').scenarioComparisonMap({
      variable: 'tmax',
      extent: mapExtent,
      center: mapcenter,
      zoom: mapZoom,
      showCounties: isNational(),
      layersloaded: function layersloaded() {
        $('#temperature-map').spinner('destroy');
        var rect = document.getElementById('map-wrap').getBoundingClientRect();
        document.querySelector('.esri-view-root').style.minWidth = rect.width + 'px';
        document.querySelector('.esri-view-root').style.height = rect.height + 'px';
        enableCustomSelect('leftScenario-select');
        enableCustomSelect('rightScenario-select');

        if (_variable2 !== undefined) {
          var $styledSelect = $('.select.varriable-select div.select-styled');
          $('[rel="' + _variable2 + '"]').click();

          // change map varriable
          if (window.precipitationScenariosMap) {
            $(window.precipitationScenariosMap).scenarioComparisonMap({ variable: _variable2 });
          }
        }
      },
      change: function change(event) {
        window.precipitationScenariosMap.scenarioComparisonMap("getShowSeasonControls") ? $("#precipitation-map-season").show(200) : $("#precipitation-map-season").hide();
      }
    });
    window.precipitationScenariosMap.scenarioComparisonMap("getShowSeasonControls") ? $("#precipitation-map-season").show(200) : $("#precipitation-map-season").hide();
  }

  if (!isNational()) {
    window.stations = $('#temperature-map').scenarioComparisonMap(_extends({
      // When state changes, just pass the current options along directly for this page.
      // If we re-use the stationsMap widget on another page there may be more handling to do.
      change: function change(event, options) {
        window.ce.ce('setLocationPageState', options);
      }
    }, locationMapState));
  }

  function setMapSize() {
    $('#temperature-map').height($('#temperature-map').parent().height());

    var rect = document.getElementById('map-wrap').getBoundingClientRect();
    var infoRowRect = document.getElementById('info-row').getBoundingClientRect();

    if (document.querySelector('.esri-view-root')) {
      document.querySelector('.esri-view-root').style.minWidth = rect.width + 'px';
      document.querySelector('.esri-view-root').style.maxWidth = rect.width + 'px';
      document.querySelector('.esri-view-root').style.height = rect.height + 'px';
    }

    if (document.querySelector('.esri-view-user-storage')) {
      document.querySelector('.esri-view-user-storage').style.minWidth = rect.width + 'px';
      document.querySelector('.esri-view-user-storage').style.maxWidth = rect.width + 'px';
    }

    if (document.querySelector('#temperature-map')) {
      document.querySelector('#temperature-map').style.minWidth = rect.width + 'px';
      document.querySelector('#temperature-map').style.maxWidth = rect.width + 'px';
      document.querySelector('#temperature-map').style.height = rect.height + 'px';
      document.querySelector('#temperature-map').style.minHeight = rect.height + 'px';
      document.querySelector('#temperature-map').style.maxHeight = rect.height + 'px';
      document.querySelector('#temperature-map').style.minWidth = rect.width + 'px';
    }
    // -infoRowRect.height
    document.querySelector('.scenario-map-overlay-container').style.top = rect.top + 'px';
    document.querySelector('.scenario-map-overlay-container').style.left = rect.left + 'px';
    document.querySelector('.scenario-map-overlay-container').style.width = rect.width + 'px';
    document.querySelector('.scenario-map-overlay-container').style.height = rect.height + 'px';
    document.querySelector('.scenario-map-overlay-container').style.minHeight = rect.height + 'px';
    document.querySelector('.scenario-map-overlay-container').style.maxHeight = rect.height + 'px';

    document.querySelector('#map-for-print-left').style.top = rect.top + 'px';
    document.querySelector('#map-for-print-left').style.left = rect.left + 'px';
    document.querySelector('#map-for-print-left').style.width = rect.width + 'px';
    document.querySelector('#map-for-print-left').style.height = rect.height + 'px';

    document.querySelector('#map-for-print-right').style.top = rect.top + 'px';
    document.querySelector('#map-for-print-right').style.left = rect.left + 'px';
    document.querySelector('#map-for-print-right').style.width = rect.width + 'px';
    document.querySelector('#map-for-print-right').style.height = rect.height + 'px';
  }

  setMapSize();

  $(window).resize(function () {
    setMapSize();
  });
});