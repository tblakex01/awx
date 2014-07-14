/*********************************************
 *  Copyright (c) 2014 AnsibleWorks, Inc.
 *
 * HostPieChart.js
 *
 * file for the host status pie chart
 *
 */

'use strict';

angular.module('HostPieChartWidget', ['RestServices', 'Utilities'])
    .factory('HostPieChart', ['$rootScope', '$compile',
            //'Rest', 'GetBasePath', 'ProcessErrors', 'Wait',
        function ($rootScope, $compile){
            //, Rest, GetBasePath, ProcessErrors) {
            return function (params) {

                var scope = params.scope,
                    target = params.target,
                    dashboard = params.dashboard,
                    html, element, data,
                    canvas, context, winHeight, available_height;

                html = "<div class=\"graph-container\">\n";

                html +="<div class=\"row\">\n";
                html += "<div id=\"job-status-title\" class=\"h6 col-xs-8 text-center\"><b>Host Status</b></div>\n";
                html += "</div>\n";

                html +="<div class=\"row\">\n";
                html += "<div class=\"host-pie-chart text-center\"><svg></svg></div>\n";
                html += "</div>\n";

                html += "</div>\n";



                element = angular.element(document.getElementById(target));
                element.html(html);
                $compile(element)(scope);

                if(dashboard.hosts.total+dashboard.hosts.failed>0){
                    data = [
                        {
                            "label": "Successful",
                            "color": "#00aa00",
                            "value" : dashboard.hosts.total
                        } ,
                        {
                            "label": "Failed",
                            "color" : "#aa0000",
                            "value" : dashboard.hosts.failed
                        }
                    ];

                    nv.addGraph(function() {
                        var width = $('.graph-container').width(), // nv.utils.windowSize().width/3,
                        height = $('.graph-container').height(), //nv.utils.windowSize().height/5,
                        chart = nv.models.pieChart()
                          .margin({top: 5, right: 75, bottom: 40, left: 85})
                          .x(function(d) { return d.label; })
                          .y(function(d) { return d.value; })
                          .showLabels(true)
                          .color(['#00aa00', '#aa0000']);

                        chart.pie.pieLabelsOutside(true).labelType("percent");

                        d3.select(".host-pie-chart svg")
                            .datum(data)
                            .attr('width', width)
                            .attr('height', height)
                            .transition().duration(350)
                            .call(chart);
                        nv.utils.windowResize(chart.update);
                        scope.$emit('WidgetLoaded');
                        return chart;
                    });
                }
                else{
                    winHeight = $(window).height();
                    available_height = winHeight - $('#main-menu-container .navbar').outerHeight() - $('#count-container').outerHeight() - 93;
                    $('.graph-container:eq(1)').height(available_height/2);
                    $('.host-pie-chart svg').replaceWith('<canvas id="circlecanvas" width="100" height="100"></canvas>');

                    canvas = document.getElementById("circlecanvas");
                    context = canvas.getContext("2d");
                    context.arc(50, 50, 50, 0, Math.PI * 2, false);
                    //context.beginPath();
                    context.globalAlpha = 0.4;
                    context.fillStyle = '#A9A9A9';
                    context.fill();
                    context.lineWidth = 1;
                    context.strokeStyle = '#1778c3';
                    context.stroke();
                    scope.$emit('WidgetLoaded');
                }
            };
        }
    ]);
