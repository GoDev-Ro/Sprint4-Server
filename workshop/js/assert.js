/**
 * Usage
 * ------------------------------------------------------------------------
 * assert('Description of assertion', condition, boolWhetherToDebugOnFail);
 * ------------------------------------------------------------------------
 *
 * Example
 * ------------------------------------------------------------------------
 * assert('String "1" equals numeric 1', '1' == 1);
 * ------------------------------------------------------------------------
 */

(function() {
    var container = document.getElementById('assert-container');

    this.assert = function(what, condition, debug) {
        var li = document.createElement('li');

        container.appendChild(li);

        if (condition) {
            li.classList.add('success');
            what = '✓ ' + what;
        } else {
            li.classList.add('error');
            what = '✘ ' + what;
        }

        li.innerText = what;
        container.scrollTop = 999999;

        if (!condition) {
            if (debug) {
                debugger;
            } else {
                throw new Error('Execution stopped because of failed assertion');
            }
        }
    };

    if (!container) {
        container = document.createElement('ul');
        container.id = 'assert-container';
        container.classList.add('assertions');

        document.body.appendChild(container);
    }
})();