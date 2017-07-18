$(document).ready ->

  $ ->
    containerSelector   = '[data-tab-wrapper]'
    tabListSelector     = '[data-tablist]'
    tabListItemSelector = '[data-tablist] > li'
    tabSelector         = '[data-tablist] > li > a'
    tabPanelSelector    = '[data-tabpanel]'

    getAnchor = ($element) ->
      $element.attr('href').substring 1

    show = ($element) ->
      $element.attr 'aria-hidden', null

    hide = ($element) ->
      $element.attr 'aria-hidden', 'true'

    hideAllTabPanels = ($element) ->
      hide $element.closest(containerSelector).find(tabPanelSelector)

    select = ($element) ->
      $element.attr
        'aria-selected': true
        'tabindex': '0'

    unselect = ($element) ->
      $element.attr
        'tabindex': '-1'
        'aria-selected': null

    $(tabListSelector).attr 'role', 'tablist'
    $(tabListItemSelector).attr 'role', 'presentation'
    $(tabPanelSelector).attr 'role', 'tabpanel'
    # Setup: Wire up the anchors and their target tabPanels
    $(tabSelector).each (_, element) ->
      $(element).attr
        'role': 'tab'
        'tabindex': '-1'
        'aria-controls': getAnchor($(element))
      return
    # Setup: Set the tablist
    $(tabListSelector).attr 'role', 'tablist'
    # Setup: Select the first tab
    firstTabLinkSelector = tabListItemSelector + ':first-child a'
    select $(firstTabLinkSelector)
    # Setup: Make each tabPanel focusable
    $(tabPanelSelector + ' > *:first-child').attr 'tabindex': '0'
    # Setup: Hide all panels besides the first
    hide $(tabPanelSelector + ':not(:first-of-type)')
    # When focused, left and right arrow keys cycle active tab
    $(tabSelector).on 'keydown', (event) ->
      $original = $(event.target)
      leftArrow = 37
      rightArrow = 39
      switch event.keyCode
        when leftArrow
          $target = $(event.target).parents(tabListItemSelector).prev().children(tabSelector)
        when rightArrow
          $target = $(event.target).parents(tabListItemSelector).next().children(tabSelector)
        else
          $target = false
          break
      if $target.length
        unselect $original
        select($target).focus()
        hideAllTabPanels $(event.target)
        show $('#' + getAnchor($(document.activeElement)))
      return
    # Show the associated panel when clicking on a tab
    $(tabSelector).on 'click', (event) ->
      event.preventDefault()
      unselect $(tabSelector)
      select $(event.target)
      hideAllTabPanels $(event.target)
      show $('#' + getAnchor($(event.target)))
      return
    return

  clipboard = new Clipboard('.copy')
  
  clipboard.on 'success', (e) ->
    console.info 'Action:', e.action
    console.info 'Text:', e.text
    console.info 'Trigger:', e.trigger
    e.clearSelection()
    return

  clipboard.on 'error', (e) ->
    console.error 'Action:', e.action
    console.error 'Trigger:', e.trigger
    return  