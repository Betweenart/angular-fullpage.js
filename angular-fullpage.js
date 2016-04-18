(function (angular) {
    'use strict';

    angular
        .module('fullPage.js', [])
        .directive('fullPage', function ($timeout) {
            return {
                restrict: 'A',
                scope: {
                    options: '=',
                    control: '='
                },
                link: link
            };


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

                /**
                 *  Original content
                 */
                var pageIndex,
                    slideIndex;

                function reBuild() {
                    destroyFullPage();

                    angular.element(element).fullpage(sanatizeOptions(scope.options));
                }

                function destroyFullPage() {
                    if ($.fn.fullpage.destroy) {
                        $.fn.fullpage.destroy('all');
                    }
                }

                function sanatizeOptions(options) {
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
                }

                function watchNodes() {
                    return element[0].getElementsByTagName('*').length;
                }

                scope.$watch(watchNodes, reBuild);

                scope.$watch('options', reBuild, true);

                element.on('$destroy', destroyFullPage);
            }
        })

})();
