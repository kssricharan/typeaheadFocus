/**
 * created by Yohai Rosen.
 * https://github.com/yohairosen
 * email: yohairoz@gmail.com
 * twitter: @distruptivehobo
 *
 * https://github.com/yohairosen/typeaheadFocus.git
 * Version: 0.0.1
 * License: MIT
 */

angular.module('typeahead-focus', [])
    .directive('typeaheadFocus', function () {
      return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {

          // Array of keyCode values for arrow keys
          const ARROW_KEYS = [37,38,39,40];

          // keyCodes for tab, enter & esc
          const HOT_KEYS = [9, 13, 27];

          function manipulateViewValue(e) {
            /* we have to check to see if the arrow keys were in the input because if they were trying to select
             * a menu option in the typeahead, this may cause unexpected behavior if we were to execute the rest
             * of this function
             */
            if( ARROW_KEYS.indexOf(e.keyCode) >= 0 )
              return;

            // stop executing when we already have a value and "hot key" pressed
            // to allow normal behaviour like moving to next input field
            if (ngModel.$viewValue && HOT_KEYS.indexOf(e.keyCode) >= 0) {
              return;
            }

            var viewValue = ngModel.$viewValue;

            //restore to null value so that the typeahead can detect a change
            if (ngModel.$viewValue == ' ') {
              ngModel.$setViewValue(null);
            }

            //force trigger the popup
            ngModel.$setViewValue(' ');

            //set the actual value in case there was already a value in the input
            ngModel.$setViewValue(viewValue || ' ');
          }

          /* trigger the popup on 'click' because 'focus'
           * is also triggered after the item selection.
           * also trigger when input is deleted via keyboard
           */
          element.bind('click keyup', manipulateViewValue);

          //compare function that treats the empty space as a match
          scope.$emptyOrMatch = function (actual, expected) {
            if (expected === ' ') {
              return true;
            }
            return partialCaseInsensitiveMatch(actual, expected);
          };

          // Angular's default partial match comparator implementation
          function partialCaseInsensitiveMatch(actual, expected) {
            if (angular.isUndefined(actual)) {
              // No substring matching against `undefined`
              return false;
            }
            if ((actual === null) || (expected === null)) {
              // No substring matching against `null`; only match against `null`
              return actual === expected;
            }
            if (angular.isObject(expected) || (angular.isObject(actual) && !hasCustomToString(actual))) {
              // Should not compare primitives against objects, unless they have custom `toString` method
              return false;
            }

            actual = angular.lowercase('' + actual);
            expected = angular.lowercase('' + expected);
            return actual.indexOf(expected) !== -1;
          }

          function hasCustomToString(obj) {
            return angular.isFunction(obj.toString) && obj.toString !== Object.prototype.toString;
          }
        }
      };
    });
