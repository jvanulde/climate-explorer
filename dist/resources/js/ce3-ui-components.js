'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//  when we get stations in the map extent
// the addition of the new stations removes existing click events
// so we need to re add them
function reEnableSelectNewItems(uniqueSelector) {
  var $styledSelect = $('.select.' + uniqueSelector + ' div.select-styled');
  // if disabled exit and do not enable pulldown
  if ($styledSelect.hasClass('disabled')) {
    return null;
  }

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
    $styledSelect.attr('link', $(this).attr('link'));
    $styledSelect.attr('nav', $(this).attr('nav'));

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

    if ($(e.target).hasClass('disabled')) {
      return null;
    }

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
    $styledSelect.attr('link', $(this).attr('link'));
    $styledSelect.attr('nav', $(this).attr('nav'));

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

// update select text
function setSelectFromButton(target) {
  var innerText = target.html().trim();
  var val = target.attr('val');
  var selector = target.attr('sel');

  $('#' + selector).text(innerText);
  $('#' + selector).attr('rel', val);
}

//  TODO move this global functions so its not in two places
// this function removes existing paramaters of the key undefined
// and returns a new search param string.  We need to do this to avoid
// mulitple nav paramaters, which would causes issues with only using the first
// occurance of the nav parameter - aka we end up on the wrong page
function removeUrlParam(key) {
  var params = decodeURIComponent(window.location.search.substring(1)).split('&');
  var param = void 0;
  var newParams = [],
      href = window.location.href.split('?')[0];
  var i = void 0;

  if (window.hasOwnProperty('history') === false || window.history.replaceState === false) return;

  for (i = 0; i < params.length; i++) {
    param = params[i].split('=');

    if (param[0] === key) {
      continue;
    }

    newParams.push(encodeURIComponent(param[0]) + '=' + encodeURIComponent(param[1]));
  }

  if (params.length !== newParams.length) {
    return '?' + newParams.join('&');
  }

  return '?' + newParams.join('&');
}

// handles click of map/char choice button.
// requires the html element has a custom attributes:
// link - which is the element id for the hidden <a> element
// nav - contains the html page/ nav footer name
function handleChartMapClick(target) {
  var link = target.attr('link');
  var nav = target.attr('nav');
  var seachParams = removeUrlParam('nav');
  var url = '../' + nav + '/' + seachParams + '&nav=' + nav;
  $('#' + link).attr('href', url);
  $('#' + link).click();
  document.getElementById(link).click();
}

function forceResize() {
  var el = document; // This can be your element on which to trigger the event
  var event = document.createEvent('HTMLEvents');
  event.initEvent('resize', true, false);
  el.dispatchEvent(event);
}