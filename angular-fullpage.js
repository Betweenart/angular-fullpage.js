(function () {
    'use strict';

    angular
        .module('fullPage.js', [])
        .directive('fullPage', fullPage);

    // inject functions
    fullPage.$inject = ['$timeout'];

    /**
     * @name fullPage
     * @desc <full-page> directive
     */
    function fullPage($timeout) {
        return {
            restrict: 'A',
            scope: {
                options: '=',
                control: '='
            },
            link: link
        };

        /**
         * @name link
         * @desc fullPage directive Link
         * @type {Function}
         */
        function link(scope, element) {
            /**
             *  Mapping fullPage.js methods
             */
            scope.internalControl = scope.control || {};
            scope.internalControl.moveSectionUp = function () {
                $.fn.fullpage.moveSectionUp();
            };
            scope.internalControl.moveSectionDown = function () {
                $.fn.fullpage.moveSectionDown();
            };
            scope.internalControl.moveTo = function (index) {
                $.fn.fullpage.moveTo(index);
            };
            scope.internalControl.silentMoveTo = function (section, slide) {
                $.fn.fullpage.silentMoveTo(section, slide);
            };
            scope.internalControl.moveSlideRight = function () {
                $.fn.fullpage.moveSlideRight();
            };
            scope.internalControl.moveSlideLeft = function () {
                $.fn.fullpage.moveSlideLeft();
            };

            /**
             *  Original content
             */
            var pageIndex,
                slideIndex,
                reBuild,
                destroyFullPage,
                sanatizeOptions,
                watchNodes;

            reBuild = function () {
                destroyFullPage();

                angular.element(element).fullpage(sanatizeOptions(scope.options));
            };

            destroyFullPage = function destroyFullPage() {
                if ($.fn.fullpage.destroy) {
                    $.fn.fullpage.destroy('all');
                }
            };

            sanatizeOptions = function (options) {
                var sanitizedOptions = options || {};
                sanitizedOptions.onLeave = function (page, nextIndex, direction) {
                    pageIndex = nextIndex;

                    // pass the user set method from options
                    if (angular.isFunction(options.onLeave)) {
                        options.onLeave(page, nextIndex, direction);
                    }
                };

                sanitizedOptions.onSlideLeave = function (anchorLink, page, slide, direction, next) {
                    pageIndex = page;
                    slideIndex = next;
                };

                sanitizedOptions.afterRender = function () {
                    //We want to remove the HREF targets for navigation because they use hashbang
                    //They still work without the hash though, so its all good.
                    if (options && options.navigation) {
                        $('#fp-nav').find('a').removeAttr('href');
                    }

                    if (pageIndex) {
                        $timeout(function () {
                            $.fn.fullpage.silentMoveTo(pageIndex, slideIndex);
                        });
                    }
                };

                //if we are using a ui-router, we need to be able to handle anchor clicks without 'href="#thing"'
                $(document).on('click', '[data-menuanchor]', function () {
                    $.fn.fullpage.moveTo($(this).attr('data-menuanchor'));
                });

                return sanitizedOptions;
            };

            watchNodes = function () {
                return element[0].getElementsByTagName('*').length;
            };

            scope.$watch(watchNodes, reBuild);

            scope.$watch('options', reBuild, true);

            element.on('$destroy', destroyFullPage);
        }
    }

})();
