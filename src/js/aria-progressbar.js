/*
 * # MIT License

Copyright (c) 2017 Davide Trisolini

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory); //AMD
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery')); //CommonJS
  } else {
    factory(jQuery, window);
  }
}(function ($, window) {
  'use strict';

  var pluginName = 'ariaProgressbar', // the name of the plugin
    tmp = '<div class="{c1}"><div class="{c2}" role="progressbar"></div></div>',
    a = {
      aVNow: 'aria-valuenow',
      aVTxt: 'aria-valuetext',
      aVMin: 'aria-valuemin',
      aVMax: 'aria-valuemax',
      dPg: 'data-progress',
      dPgTxt: 'data-progresstext',
      t: 'true',
      f: 'false'
    },
    win = $(window);

  //-----------------------------------------
  // The actual plugin constructor
  function AriaProgressbar(element, userSettings) {
    var self = this;

    self.settings = $.extend({}, $.fn[pluginName].defaultSettings, userSettings);
    self.element = $(element);
    self.template = tmp;
    self.value = null;
    self.valuePercent = null;
    self.valueText = null;

    //init form
    self.init();
  };


  // Avoid Plugin.prototype conflicts
  $.extend(AriaProgressbar.prototype, {
    init: function () {
      var self = this,
        element = self.element,
        settings = self.settings;

      //create template string
      self.template = self.template.replace('{c1}', settings.progressClass);
      self.template = self.template.replace('{c2}', settings.progressBarClass);

      //inject html into page
      element.append(self.template);

      //get progress and progress__bar element
      self.progress = element.find('.' + settings.progressClass.split(' ')[0]);
      self.progressbar = element.find('.' + settings.progressBarClass);

      //add attributes
      self.progressbar
        .attr(a.aVMin, '0')
        .attr(a.aVMax, settings.maxVal);

      //trigger custom event on window for authors to listen for
      win.trigger(pluginName + '.initialised', [self]);
    },
    destroy: function () {
      var self = this,
        settings = self.settings;

      self.progress.fadeOut(settings.destroyFadeOutSpeed, function () {
        self.progress.remove();
      });

      //trigger custom event on window for authors to listen for
      win.trigger(pluginName + '.destroy', [self]);
    },
    update: function (value) {
      var self = this,
        settings = self.settings;

      self.value = value;
      self.valueText = settings.textLabel.replace('{X}', value);
      self.valuePercent = (value * 100.0)/settings.maxVal;

      //update valuenow attribute and with of bars
      self.progressbar
        .attr(a.aVNow, value)
        .css('width', self.valuePercent + '%');

      //update valuetext attribute
      if (settings.textLabel) {
        self.progressbar
          .attr(a.aVTxt, self.valueText);
      }

      //update attribute data-progress
      self.progress
        .attr(a.dPg, value)
        .attr(a.dPgTxt, self.valueText);

      //trigger custom event on window for authors to listen for
      win.trigger(pluginName + '.updated', [self]);

      //destroy the widget if the task is completed
      if (self.value >= settings.maxVal) {
        setTimeout(function () {
          self.destroy();
        }, settings.destroyDelay);
      }
    },
    //-------------------------------------------------------------
    //Method caller
    //-------------------------------------------------------------
    methodCaller: function (methodName, methodArg) {
      var self = this;

      switch (methodName) {
      case 'update':
        self.update(methodArg);
        break;
      case 'destroy':
        self.destroy();
        break;
      }
    }
  });


  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function (userSettings, methodArg) {
    return this.each(function () {
      var self = this;
      /*
       * If following conditions matches, then the plugin must be initialsied:
       * Check if the plugin is instantiated for the first time
       * Check if the argument passed is an object or undefined (no arguments)
       */
      if (!$.data(self, 'plugin_' + pluginName) && (typeof userSettings === 'object' || typeof userSettings === 'undefined')) {
        $.data(self, 'plugin_' + pluginName, new AriaProgressbar(self, userSettings));
      } else if (typeof userSettings === 'string') {
        $.data(self, 'plugin_' + pluginName).methodCaller(userSettings, methodArg);
      }
    });
  };


  $.fn[pluginName].defaultSettings = {
    progressClass: 'progress',
    progressBarClass: 'progress__bar',
    maxVal: 100,
    textLabel: '{X} percent completed',
    destroyDelay: 300,
    destroyFadeOutSpeed: 300
  };
}));
