/**
 * angular-ui-notification - Angular.js service providing simple notifications using Bootstrap 3 styles with css transitions for animating
 * @author Alex_Crack
 * @version v0.0.5
 * @link https://github.com/alexcrack/angular-ui-notification
 * @license MIT
 */
angular.module("ui-notification",[]),angular.module("ui-notification").value("uiNotificationTemplates","angular-ui-notification.html"),angular.module("ui-notification").factory("Notification",["$timeout","uiNotificationTemplates","$http","$compile","$templateCache","$rootScope","$injector","$sce",function(t,e,i,n,a,o,l,r){var s=10,c=10,u=10,f=10,m=5e3,p=[],d=function(l,d){"object"!=typeof l&&(l={message:l}),l.template=l.template?l.template:e,l.delay=angular.isUndefined(l.delay)?m:l.delay,l.type=d?d:"",i.get(l.template,{cache:a}).success(function(e){var i=o.$new();if(i.message=r.trustAsHtml(l.message),i.title=r.trustAsHtml(l.title),i.t=l.type.substr(0,1),i.delay=l.delay,"object"==typeof l.scope)for(var a in l.scope)i[a]=l.scope[a];var m=function(){for(var t=0,e=0,i=s,n=p.length-1;n>=0;n--){var a=p[n],o=parseInt(a[0].offsetHeight),l=parseInt(a[0].offsetWidth);r+o>window.innerHeight&&(i=s,e++,t=0);var r=i+(0===t?0:u),m=c+e*(f+l);a.css("top",r+"px"),a.css("right",m+"px"),i=r+o,t++}},d=n(e)(i);d.addClass(l.type),d.bind("webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd click",function(t){t=t.originalEvent||t,("click"===t.type||"opacity"===t.propertyName&&t.elapsedTime>=1)&&(d.remove(),p.splice(p.indexOf(d),1),m())}),angular.isNumber(l.delay)&&t(function(){d.addClass("killed")},l.delay),angular.element(document.getElementsByTagName("body")).append(d),p.push(d),t(m)}).error(function(t){throw new Error("Template ("+l.template+") could not be loaded. "+t)})};return d.config=function(t){s=t.top?t.top:s,u=t.verticalSpacing?t.verticalSpacing:u},d.primary=function(t){this(t,"primary")},d.error=function(t){this(t,"error")},d.success=function(t){this(t,"success")},d.info=function(t){this(t,"info")},d.warning=function(t){this(t,"warning")},d.clearAll=function(){var t=angular.element(document.getElementsByClassName("ui-notification"));t&&angular.forEach(t,function(t){t.remove()})},d}]),angular.module("ui-notification").run(["$templateCache",function(t){t.put("angular-ui-notification.html",'<div class="ui-notification"><h3 ng-show="title" ng-bind-html="title"></h3><div class="message" ng-bind-html="message"></div></div>')}]);
