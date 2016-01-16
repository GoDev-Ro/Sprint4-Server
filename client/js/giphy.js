$.fn.giphy = function(options) {
    var defaults = {};
    var methods = {
        destroy: function() {
            $(this).off('click', linkClicked);
        }
    };
    
    var $element = $('#giphy-container');
    
    var linkClicked = function() {
        var $this = $(this),
            text = encodeURIComponent($this.text()),
            apiUrl = 'http://api.giphy.com/v1/gifs/search?q=' + text + '&api_key=dc6zaTOxFJmzC';

        $.ajax(apiUrl).done(function(data) {
            if (data.meta.status !== 200) {
                return alert('Giphy API returned status: ' + data.meta.status);
            }
            
            if (!data.data.length) {
                return alert('No results found on Giphy');
            }
            
            var url = data.data[0].images.original.url;
            
            $element.show().html('<img src="' + url + '">');
        }).fail(function() {
            alert('Giphy API can not be reached');
        });

        return false;
    };
    
    if (!$element.length) {
        $element = $('<div id="giphy-container"></div>');
        $('body').append($element);
        
        $element.click(function() {
            $element.hide();
        });
        
        $element.on('click', 'img', function(e) {
            e.stopPropagation();
        });
    }

    return this.each(function () {
        if (!options || typeof options == 'object') {
            options = $.extend(defaults, options);

            $(this).on('click', linkClicked);
        } else {
            if (methods.hasOwnProperty(options)) {
                methods[options].call(this);
            }
        }
    });
};
