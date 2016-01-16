$.fn.stars = function(options) {
    var defaults = {
        stars: 5,
        onChange: function () {}
    };

    var methods = {
        destroy: function () {
            var $this = $(this);

            if ($this.data('created-stars') == 1) {
                $this
                    .attr('type', 'text')
                    .data('created-stars', null)
                    .next()
                    .remove();
            }
        }
    };

    return this.each(function () {
        if (!options || typeof options == 'object') {
            options = $.extend(defaults, options);

            var $this = $(this);
            var $container = $('<span></span>').addClass('stars-container');

            var drawActiveStars = function () {
                var $stars = $container.find('.star').removeClass('hover');

                for (var i = 0; i < $this.val(); i++) {
                    $stars.eq(i).addClass('hover');
                }
            };

            var resetActiveStars = function () {
                $container.find('.star').removeClass('hover');
            };

            var starHovered = function () {
                var $elem = $(this);

                resetActiveStars();

                while ($elem.is('.star')) {
                    $elem.addClass('hover');
                    $elem = $elem.prev();
                }
            };

            var starClicked = function () {
                var value = $(this).index() + 1;

                $this.val(value);
                options.onChange(value);
            };

            for (i = 0; i < options.stars; i++) {
                var $star = $('<span class="star">★</span>');

                $star.hover(
                    starHovered,
                    resetActiveStars
                );

                $star.click(starClicked);

                $container.append($star);
            }

            $container.mouseout(drawActiveStars);

            $this.attr('type', 'hidden');
            $this.after($container);
            $this.data('created-stars', 1);

            $this.on('change', drawActiveStars);

            drawActiveStars();
        } else {
            if (methods.hasOwnProperty(options)) {
                methods[options].call(this);
            }
        }
    });
};