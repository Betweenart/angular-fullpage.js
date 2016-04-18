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
                scope.internalControl.moveTo = function (index) {
                    $.fn.fullpage.moveTo(index);
                };

                /**
                 *  Original content
                 */
                var pageIndex,
                    slideIndex;

                function rebuild() {
                    destroyFullPage();

                    angular.element(element).fullpage(sanatizeOptions(scope.options));
                }

                function destroyFullPage() {
                    if ($.fn.fullpage.destroy) {
                        $.fn.fullpage.destroy('all');
                    }
                }

                function sanatizeOptions(options) {
                    /*options.onLeave = function(page, next, direction){
                     pageIndex = next;
                     };*/

                    options.onSlideLeave = function (anchorLink, page, slide, direction, next) {
                        pageIndex = page;
                        slideIndex = next;
                    };

                    options.afterRender = function () {
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

                    return options;
                }

                function watchNodes() {
                    return element[0].getElementsByTagName('*').length;
                }

                scope.$watch(watchNodes, rebuild);

                scope.$watch('options', rebuild, true);

                element.on('$destroy', destroyFullPage);
            }
        })

})();
