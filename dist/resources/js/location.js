'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

$(function () {
  var activeVariableTemperature = 'tmax';
  var activeVariablePrecipitation = 'pcpn';
  var activeVariableDerived = 'hdd';

  // get city, state from state url
  $('#default-city-state').text(window.ce.ce('getLocationPageState')['city']);
  $('#default-city-county').text(window.ce.ce('getLocationPageState')['county']);
  $('#cards-search-input').val(window.ce.ce('getLocationPageState')['city']);

  // enable custom selction boxes
  enableCustomSelect('download-select');
  enableCustomSelect('stations-select');
  enableCustomSelect('varriable-select');
  enableCustomSelect('chartmap-select');
  enableCustomSelect('time-select');
  enableCustomSelect('presentation-select');

  // init slider
  initSlider();

  // valid monlthly varriables
  // monlthly timeperoid is only valud for limitited varriables
  // to dissable those varriabls from the user we use this constant
  var validMonthly = ['tmax', 'tmin', 'pcpn'];

  // function to enable downloads (images and data)
  $('.download-select li a').click(function (e) {
    var downloadAction = $(this).attr('rel');

    // capture what we are downloading
    switch (downloadAction) {
      case 'download-image':
        // download image
        window.tempChart.download_image(this, 'graph.png');
        break;
      case 'download-observed-data':
        window.tempChart.download_hist_obs_data(this);
        break;
      case 'download-historical-modeled-data':
        window.tempChart.download_hist_mod_data(this);
        break;
      case 'download-projected-modeled-data':
        window.tempChart.download_proj_mod_data(this);
        break;
      case 'download-interpreting':
        break;
      default:
        window.tempChart.download_image(this, 'graph.png');
    }
  });

  // update select text
  function setSelectFromButton(target) {
    var innerText = target.html().trim();
    var val = target.attr('val');
    var selector = target.attr('sel');

    $('#' + selector).text(innerText);
    $('#' + selector).attr('rel', val);
  }

  // eanbles time chart, map click events
  $('#chartmap-wrapper').click(function (e) {
    var target = $(e.target);

    // toggle button visual state
    toggleButton($(target));

    // change select pulldowns for resposnive mode
    setSelectFromButton(target);
  });

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

      // update chart frequency value
      updateFrequency(val);

      // update chart frequency slider based on timeperiod
      updateFrequencySlider(val);

      // change select pulldowns for resposnive mode
      setSelectFromButton(target);
    }
  });

  // in repsonsive mode the time is a pulldown this eanbles the change of the timeperiod
  // to update the chart
  $('#time-select-vis').bind('cs-changed', function (e) {
    var target = $(e.target);
    var notDisabled = !target.hasClass('btn-default-disabled');
    if (notDisabled) {
      var val = $('#time-select-vis').attr('rel');

      // toggle button visual state
      toggleButton($('.btn-' + $('#time-select-vis').attr('rel')));

      // update chart frequency slider based on timeperiod
      updateFrequency(val);

      // update chart frequency slider based on timeperiod
      updateFrequencySlider(val);
    }
  });

  // adds a click event to turn off chart layers aka what you
  // see on the chart
  $('#legend-wrapper').click(function (e) {
    var target = $(e.target);

    // update the chart layers
    updateChartLayers(target);
  });

  // adds a click event to change the presentation the chart
  // from actual to anomaly
  $('#presentation-wrapper').click(function (e) {
    var target = $(e.target);
    var val = target.attr('val');

    // toggle button visual state
    toggleButton(target);

    // updates the chart for actual to anomaly
    updatePresentation(val);

    // updates the select pulldown for repsonsive mode
    setSelectFromButton(target);
  });

  // in repsonsive mode the presentation is a pulldown this eanbles the change of the presentation
  // to update the chart
  $('#presentation-select-vis').bind('cs-changed', function (e) {
    var val = $('#presentation-select-vis').attr('rel');

    // toggle button visual state
    toggleButton($('.btn-' + $('#presentation-select-vis').attr('rel')));

    // updates the button for when leaving repsonsive mode (small screen)
    updatePresentation(val);
  });

  // adds time perioid click
  $('#monthly-select-wrapper').click(function (e) {
    var target = $(e.target);
    var val = target.attr('val');

    // toggle button visual state
    toggleButton(target);

    // change time period
    updateTimePeriod(val);
  });

  // binds update of chart varriable to change of selector
  $('#varriable-select-vis').bind('cs-changed', function (e) {
    // update the chart based on char varriable
    window.tempChart.update({
      variable: $('#varriable-select-vis').attr('rel')
    });

    // update the text
    updateTitle($('#varriable-select-vis').text());

    // disable varriablles if they are valid time period
    var isvalid = jQuery.inArray($('#varriable-select-vis').attr('rel'), validMonthly);
    if (isvalid < 0) {
      $('[val="monthly"]').addClass('btn-default-disabled');
      $('[val="monthly"]').removeClass('btn-default');
    } else {
      $('[val="monthly"]').removeClass('btn-default-disabled');
      $('[val="monthly"]').addClass('btn-default');
    }
  });

  // this function changes chart layers based on what the user
  // clicks on
  function updateChartLayers(target) {
    target.toggleClass('selected');
    var allItems = $(target).parent().children();

    // map all buttons and get the val from html val attribute
    var valid = allItems.map(function () {
      var elAttribute = $(this).attr('val');
      var obj = _extends({}, this);
      obj[elAttribute] = $(this).hasClass('selected');
      return obj;
    });

    // flatten the array
    var merged = Object.assign.apply(Object, valid);
    var scenario = true;

    // check scenarios

    // both rcp45 & rcp85
    if (merged.rcp45 && merged.rcp85) {
      scenario = 'both';
    }

    // rcp45
    if (merged.rcp45 && !merged.rcp85) {
      scenario = 'rcp45';
    }

    // rcp86
    if (!merged.rcp45 && merged.rcp85) {
      scenario = 'rcp85';
    }

    // Neihter rcp45 & rcp85
    if (!merged.rcp45 && !merged.rcp85) {
      scenario = '';
    }

    // set historical
    var histmod = merged.hist_mod;
    var histobs = merged.histobs;

    // update chart
    window.tempChart.update({
      scenario: scenario,
      histmod: histmod,
      histobs: histobs
    });
  }

  // this function forces a map legend button to be selcted css class
  function forceSlected(selector) {
    $(selector).addClass('selected');
  }

  // this function firce a map legend to be "un selected" css class
  function forceUnSlected(selector) {
    $(selector).removeClass('selected');
  }

  // this function Updates the chart title.
  function updateTitle(chartText) {
    $('#default-chart-map-varriable').html(chartText);
  }

  // this function dissables varriables when monthly period is selected
  function validVarrablesDisable() {
    $('#varriable-select-wrapper .default-select-option').each(function () {
      var attribute = $(this).attr('rel');
      var isvalid = jQuery.inArray(attribute, validMonthly);
      if (isvalid < 0) {
        $(this).addClass('default-select-option-disabled');
        $(this).removeClass('default-select-option');
      }
    });
  }

  // this function enables varriables when annual period is selected
  function validVarrablesEnable() {
    $('#varriable-select-wrapper .default-select-option-disabled').each(function () {
      var attribute = $(this).attr('rel');
      $(this).removeClass('default-select-option-disabled');
      $(this).addClass('default-select-option');
    });
  }

  // update slider dispaly
  // monthly uses choice buttons
  // anuall uses slider of years 1950-2099
  function updateFrequencySlider(targetval) {
    switch (targetval) {
      case 'annual':
        annualSliderOn();
        monthlySelectOff();
        validVarrablesEnable();
        break;
      case 'monthly':
        monthlySelectOn();
        annualSliderOff();
        validVarrablesDisable();
        break;
      default:
        annualSliderOn();
        monthlySelectOff();
        validVarrablesEnable();
    }
  }

  // this function changes the frequency for the charts
  function updateFrequency(targetval) {
    window.tempChart.update({
      frequency: targetval,
      variable: $('#varriable-select-vis').attr('rel'),
      histobs: true
    });
    forceSlected('.btn-histobs');
  }

  // this function changes the presentation (anomaly,actual) for the charts
  function updatePresentation(targetval) {
    window.tempChart.update({
      presentation: targetval
    });
  }
  // this function changes the time period for monthly chart centered on 2025, 2050, 2075
  function updateTimePeriod(targetval) {
    window.tempChart.update({
      timeperiod: targetval
    });
  }

  // function changes button to selected
  function toggleButton(selector) {
    toggleAllButtonsOff(selector.get());
    $(selector).addClass('btn-default-selected');
  }

  // function changes button to selected
  function toggleAllButtonsOff(btnElem) {
    var parentElem = btnElem[0].parentElement;
    var elems = parentElem.childNodes;
    elems.forEach(function (elem) {
      if (elem instanceof Element) {
        elem.classList.remove('btn-default-selected');
        elem.classList.add('btn-default');
      }
    });
  }

  // function enables custom selection dropdown from a li element
  function enableCustomSelect(uniqueSelector) {
    var $styledSelect = $('.select.' + uniqueSelector + ' div.select-styled');

    // if disabled exit and do not enable pulldown
    if ($styledSelect.hasClass('disabled')) {
      return null;
    }

    // enable click and show options
    $styledSelect.click(function (e) {
      e.stopPropagation();
      $('.select.' + uniqueSelector + ' div.select-styled.active').not(this).each(function () {
        $(this).removeClass('active').next('ul.select-options').hide();
      });
      $(this).toggleClass('active').next('ul.select-options').toggle();
    });

    // get list tiems so we can add user interactions
    var $list = $('.select.' + uniqueSelector + ' ul');
    var $listItems = $('.select.' + uniqueSelector + ' ul').children('li');

    // enable click for options
    $listItems.click(function (e) {

      // check if disabled exit if it is
      if ($(this).hasClass('default-select-option-disabled')) {
        return null;
      }

      e.stopPropagation();

      // option item has href make it a element so links work
      var hrefAttr = $(this).attr('href');
      if ((typeof hrefAttr === 'undefined' ? 'undefined' : _typeof(hrefAttr)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && hrefAttr !== false) {
        $styledSelect.html('<a href="' + hrefAttr + '" rel="' + $(this).attr('rel') + '">' + $(this).text() + '</a>').removeClass('active');
      } else {
        $styledSelect.text($(this).text()).removeClass('active');
      }

      $styledSelect.attr('rel', $(this).attr('rel'));

      // option item has icon add it
      var iconAttr = $(this).attr('icon');
      if ((typeof iconAttr === 'undefined' ? 'undefined' : _typeof(iconAttr)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && iconAttr !== false) {
        // Element has this attribute
        var icon = '<i class="' + iconAttr + '"></i>';
      } else {
        var icon = '';
      }

      $styledSelect.prepend(icon);
      $list.hide();
      // trigger custom event so we know the user changed or selected an item
      $styledSelect.trigger('cs-changed');
    });

    // hide pulldown when user clicks anywhere outside of selected area
    $(document).click(function () {
      $styledSelect.removeClass('active');
      $list.hide();
    });
  }
  // This function will be called whenever the user changes the x-scale in the graph.
  function xrangesetmon() {
    // Force the slider thumbs to adjust to the appropriate place
    $("#slider-range").slider("option", "values", [0, 1]);
  }

  // this function sets the xrangeset
  function xrangeset(min, max) {
    // Force the slider thumbs to adjust to the appropriate place
    var sliderElem = document.getElementById('slider-range');
    sliderElem.noUiSlider.set([min, max]);
  }

  function initSlider() {
    annualSliderOn();
    monthlySelectOff();

    var sliderElem = document.getElementById('slider-range');
    noUiSlider.create(sliderElem, _defineProperty({
      start: [20, 80],
      connect: true,
      range: {
        'min': 1950,
        'max': 2099
      },
      step: 1
    }, 'start', [1950, 2099]));

    // set slider on slide event
    sliderElem.noUiSlider.on('slide', function () {
      var values = sliderElem.noUiSlider.get();
      var minValue = parseInt(values[0]);
      var maxValue = parseInt(values[1]);
      $('#slider-value-high').text(maxValue);
      $('#slider-value-low').text(minValue);

      // update chart with new max min range
      return window.tempChart.setXRange(minValue, maxValue);
    });

    // update chart with default starting min max
    var values = sliderElem.noUiSlider.get();
    var minValue = parseInt(values[0]);
    var maxValue = parseInt(values[1]);
    $('#slider-value-high').text(maxValue);
    $('#slider-value-low').text(minValue);

    $('#monthly-select-wrapper').hide();
  }

  function annualSliderOn() {
    $('#annual-slider-wrapper').removeClass('d-none');
    $('#annual-slider-wrapper').addClass('d-flex-center');
  }

  function annualSliderOff() {
    $('#annual-slider-wrapper').addClass('d-none');
    $('#annual-slider-wrapper').removeClass('d-flex-center');
  }

  function monthlySelectOn() {
    $('#monthly-select-wrapper').removeClass('d-none');
    $('#monthly-select-wrapper').addClass('d-flex-center');
  }

  function monthlySelectOff() {
    $('#monthly-select-wrapper').addClass('d-none');
    $('#monthly-select-wrapper').removeClass('d-flex-center');
  }

  window.tempChart = climate_widget.graph({
    'div': "div#chart-123",
    'dataprefix': '/climate-explorer2-data/data',
    'font': 'Roboto',
    'responsive': true,
    'frequency': 'annual',
    'timeperiod': '2025',
    'county': window.ce.ce('getLocationPageState')['fips'],
    'variable': 'tmax',
    'scenario': 'both',
    'presentation': 'absolute',
    'pmedian': true,
    'hmedian': false,
    'histobs': false,
    'histmod': true,
    'xrangefunc': xrangeset(1950, 2099)
  });

  setTimeout(function () {
    window.tempChart.resize();
  }, 700);

  $(window).resize(function () {
    window.tempChart.resize();
  });
});