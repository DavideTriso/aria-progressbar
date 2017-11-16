# ARIA PROGRESSBAR

## About

simple jQuery plugin for user-friendly and accessible progressbars. [Go to demo page](https://davidetriso.github.io/aria-progressbar/) or [check on npm](https://www.npmjs.com/package/t-aria-progressbar).

* User-friendly and accessible
* Less than 2KB (minified).
* Compatible with amd and require.js

## Dependencies

**jQuery**

Developed and tested with jQuery 3.2.1


## Settings / Options

Name | Default | Type | Description
-----|---------|------|-------------
progressClass | progress | string | The class of the progressbar wrapper.
progressBarClass | progress__bar | string | The class of the progressbars.
maxVal | 100 | int | The maximum value of the progressbar (task % = 100% - task completed!).
textLabel | {X} percent completed | string | String used to generate a user-readable version of the progress value (see [https://www.w3.org/TR/wai-aria-1.1/#aria-valuetext](https://www.w3.org/TR/wai-aria-1.1/#aria-valuetext) for more informatioins) (`{X}` will be automatically replaced with the current progress value).
destroyDelay | 300 | int >= 0 | Interval in ms: Delay the call of `destroy()` when task is complete and progress is 100% (the time is needed to complete the CSS transition of the progressbar).
destroyFadeOutSpeed | 300 | int >= 0 | Speed of jQuery fade-out animation, performed when `destroy()` is called, before removing the element from DOM.

## Installation

Download the package from **GitHub** and get the compiled files from the `dist` folder.

The plugin is also available on **npm**:
```
npm install t-aria-progressbar
```


## Usage

1. Include the JS script **aria-progressbar.js** - or the minified production script **aria-progressbar.min.js**-  in the head or the body of your HTML file.
2. Include the CSS file  **aria-progressbar.css** in the head of your HTML file or include the SCSS files in your project.
3. Initialise the widget within an inline script tag, or in an external JS file.


### JS: Initialise

Initialise the plugin as follows:

```javascript
$('#progress-container').ariaProgressbar({
  option1: value1,
  option2: value2
});
```

## Methods

The plugin supports following methods: `update`, `destroy`.

### Update:

To update a progressbar call `ariaProgressbar` and pass **'update'** as first parameter and the value indicating the current task progress as second parameter.
If the progress value  is indeterminate, simply do not perform any call to the `update` method. By not calling `update` the attribute `aria-valuenow` will be omitted and the widget will conform the requirements of the WAI-ARIA specification.
For more infos check (https://www.w3.org/TR/wai-aria/roles#progressbar)[https://www.w3.org/TR/wai-aria/roles#progressbar]).

```javascript
$('#my-progressbar').ariaProgressbar('update', 10);
```

### Destroy

The destroy method removes the progressbar from DOM. The method is **automatically called from the widget**, when the progress value passed to `update` is equal to `maxVal`.
If, for any reason, the widget must be removed before the task is completed (e.g. user interrupts process), or in the case the progress value is indetermined, then use the `destroy` method to remove the widget:

```javascript
$('#my-progressbar').ariaProgressbar('destroy');
```

## Custom events

This plugin triggers the following events:

* **ariaProgressbar.initialised** after the progressbar is initialised.
* **ariaProgressbar.updated** when the progressbar is updated.
* **ariaProgressbar.destroy** when the progressbar is remvoed from DOM, e.g. destroyed.

The custom events are triggered on window and return the progressbar data object as argument.

```javascript
//add event listener  
$(window).on('ariaProgressbar.initialised', function(event, el){
  //perform an action
  el.progressbar.addClass('my-custom-class');
});
```

## LICENSE

This project is licensed under the terms of the **MIT license**.

See [LICENSE.md](LICENSE.md) for detailed informations.
