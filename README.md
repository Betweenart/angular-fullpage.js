
## Inspired by, forked and enhanced:

## ! Still testing to make it stable ;)

[angular-fullPage.js](https://github.com/hellsan631/angular-fullpage.js) Angular Directive
[fullPage.js](https://github.com/alvarotrigo/fullPage.js) Mother of the directive ;P
====

Make sure to include both this directive and fullPage.js. This package isn't a replacement.

_index.html_
```html
<!-- Included dependancies:
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.5/angular.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="vendor/fullpage.js/jquery.fullPage.min.js"></script>
-->

<script src="vendor/angular-fullpage.js/angular-fullpage.min.js"></script>
```

In your angular modules, include the Directive

_app.module.js_
```js
angular
  .module('app', [
    'fullPage.js'
    ...
  ]);
```

Add your standard [fullPage.js structure](https://github.com/alvarotrigo/fullPage.js/#required-html-structure),
along with the attribute full-page

_someView.html_
```html
<div full-page>
    <div class="section">Some section</div>
    <div class="section">Some section</div>
    <div class="section">Some section</div>
    <div class="section">Some section</div>
</div>
```

### Options

If you'd like to add some options to the fullpage, just include them in an object in your controller, and add the options attribute to your html.

_someViewController.js_
```js
function MainController(){

  var _this = this;

  _this.mainOptions = {
    sectionsColor: ['#1bbc9b', '#4BBFC3', '#7BAABE'],
    navigation: true,
    navigationPosition: 'right'
    scrollingSpeed: 1000
  }

}
```

_someView.html_
```html
<div full-page options="vm.someOptions">
    <div class="section">Some section</div>
    <div class="section">Some section</div>
    <div class="section">Some section</div>
</div>
```

[You can even make them dynamic.](http://hellsan631.github.io/angular-fullpage.js/#/dynamic)
