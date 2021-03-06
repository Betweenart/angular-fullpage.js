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
        var directive = {
            restrict: 'A',
            scope: {
                options: '=',
                control: '='
            },
            link: link
        };
        return directive;

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
                /*sanitizedOptions.onLeave = function (page, nextIndex, direction) {
                 pageIndex = nextIndex;

                 // pass the user set method from options

                 };*/

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

            // watch if elements were added
            watchNodes = function () {
                return element[0].getElementsByClassName('*').length;
            };

            // angular rendering elements makes it rebuild many times
            // this should be called only if new elements are added
            // - reBuild can be called from outside with internalControl
            //scope.$watch(watchNodes, reBuild);

            scope.$watch('options', reBuild, true);

            element.on('$destroy', destroyFullPage);
        }
    }

})();
