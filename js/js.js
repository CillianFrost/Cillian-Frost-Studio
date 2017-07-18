$(document).ready(function() {
  var clipboard;
  $(function() {
    var containerSelector, firstTabLinkSelector, getAnchor, hide, hideAllTabPanels, select, show, tabListItemSelector, tabListSelector, tabPanelSelector, tabSelector, unselect;
    containerSelector = '[data-tab-wrapper]';
    tabListSelector = '[data-tablist]';
    tabListItemSelector = '[data-tablist] > li';
    tabSelector = '[data-tablist] > li > a';
    tabPanelSelector = '[data-tabpanel]';
    getAnchor = function($element) {
      return $element.attr('href').substring(1);
    };
    show = function($element) {
      return $element.attr('aria-hidden', null);
    };
    hide = function($element) {
      return $element.attr('aria-hidden', 'true');
    };
    hideAllTabPanels = function($element) {
      return hide($element.closest(containerSelector).find(tabPanelSelector));
    };
    select = function($element) {
      return $element.attr({
        'aria-selected': true,
        'tabindex': '0'
      });
    };
    unselect = function($element) {
      return $element.attr({
        'tabindex': '-1',
        'aria-selected': null
      });
    };
    $(tabListSelector).attr('role', 'tablist');
    $(tabListItemSelector).attr('role', 'presentation');
    $(tabPanelSelector).attr('role', 'tabpanel');
    $(tabSelector).each(function(_, element) {
      $(element).attr({
        'role': 'tab',
        'tabindex': '-1',
        'aria-controls': getAnchor($(element))
      });
    });
    $(tabListSelector).attr('role', 'tablist');
    firstTabLinkSelector = tabListItemSelector + ':first-child a';
    select($(firstTabLinkSelector));
    $(tabPanelSelector + ' > *:first-child').attr({
      'tabindex': '0'
    });
    hide($(tabPanelSelector + ':not(:first-of-type)'));
    $(tabSelector).on('keydown', function(event) {
      var $original, $target, leftArrow, rightArrow;
      $original = $(event.target);
      leftArrow = 37;
      rightArrow = 39;
      switch (event.keyCode) {
        case leftArrow:
          $target = $(event.target).parents(tabListItemSelector).prev().children(tabSelector);
          break;
        case rightArrow:
          $target = $(event.target).parents(tabListItemSelector).next().children(tabSelector);
          break;
        default:
          $target = false;
          break;
      }
      if ($target.length) {
        unselect($original);
        select($target).focus();
        hideAllTabPanels($(event.target));
        show($('#' + getAnchor($(document.activeElement))));
      }
    });
    $(tabSelector).on('click', function(event) {
      event.preventDefault();
      unselect($(tabSelector));
      select($(event.target));
      hideAllTabPanels($(event.target));
      show($('#' + getAnchor($(event.target))));
    });
  });
  clipboard = new Clipboard('.copy');
  clipboard.on('success', function(e) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);
    e.clearSelection();
  });
  return clipboard.on('error', function(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
  });
});
