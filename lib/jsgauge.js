/**
 * jsgauge.js
 *
 *
 * @license MIT
 * @version 0.1
 * @author  B. van Wetten
 * @updated 2017-06-30
 * @link    https://github.com/QNimbus/jsGauge.git
 *
 *
 */

"use strict";

// Protecting global scope and ensuring $ alias works within our scope
! function ($) {
	$.fn.jsGauge = function (options) {
		const undef = void 0;
		const pi = Math.PI;
		const radians = pi / 180;
		var configItems = [
			"id",
			"fill",
			"percent",
			"used",
			"total",
			"size",
			"prepend",
			"append",
			"theme",
			"color",
			"background_style",
			"width",
			"style",
			"stripe",
			"scale",
			"scale_style",
			"animationstep",
			"speed",
			"smooth_animation",
			"animate_gauge_colors",
			"animate_text_colors",
			"label",
			"label_color",
			"text",
		];
		var defaultConfig = $.extend({
			id: "",
			fill: undef,
			percent: 0,
			used: undef,
			total: undef,
			size: 100,
			prepend: "",
			append: "",
			theme: "Red-Gold-Green",
			color: undef,
			background_style: "RGBa(0,0,0,0.6)",
			width: 3,
			style: "Full",
			scale: false,
			scale_style: "RGBa(0,0,0,0.6)",
			stripe: "0",
			animationstep: 0.1,
			speed: 5,
			smooth_animation: true,
			animate_gauge_colors: false,
			animate_text_colors: false,
			label: undef,
			label_color: "Black"
		}, options);

		// Apply code to all mathced elements
		return this.each(function () {
			// Initialize variables that are 'global' to this instance of jsGauge
			var config = {};
			var gaugeElement = $(this);		// Gauge element
			var targetValue;				// Target value of gauge
			var currentValue;				// Current value of gauge
			var animationStepIncrement		// Increment of each animation step
			var canvasElement;
			// var canvasContext;
			var xCoord; // Gauge x-coord
			var yCoord; // Gauge y-coord
			var radius; // Gauge radius
			var gaugeRadians;
			var style;
			var stopAngle;
			var startAngle;
			var startAngleFill;
			var rotation;

			function getColorByTheme(percentage) {
				var color;
				// percentage || (percentage = 1e-14);
				switch (config.theme.toLowerCase()) {
					case "red-gold-green": {
						percentage >= 0 && (color = "#d90000"),
							percentage > 10 && (color = "#e32100"),
							percentage > 20 && (color = "#f35100"),
							percentage > 30 && (color = "#ff8700"),
							percentage > 40 && (color = "#ffb800"),
							percentage > 50 && (color = "#ffd900"),
							percentage > 60 && (color = "#dcd800"),
							percentage > 70 && (color = "#a6d900"),
							percentage > 80 && (color = "#69d900"),
							percentage > 90 && (color = "#32d900");
						break;
					};
					case "green-gold-red": {
						percentage >= 0 && (color = "#32d900"),
							percentage > 10 && (color = "#69d900"),
							percentage > 20 && (color = "#a6d900"),
							percentage > 30 && (color = "#dcd800"),
							percentage > 40 && (color = "#ffd900"),
							percentage > 50 && (color = "#ffb800"),
							percentage > 60 && (color = "#ff8700"),
							percentage > 70 && (color = "#f35100"),
							percentage > 80 && (color = "#e32100"),
							percentage > 90 && (color = "#d90000");
						break;
					};
					case "white": {
						color = "#000";
						break;
					};
					default:
					case "black": {
						color = "#fff";
						break;
					}
				}
				return color
			}

			function addLabel(elem, size, label) {
				$("<b></b>").appendTo(elem).html(label).css({
					"font-size": size + "px",
					"line-height": config.size + (5 * size) + "px",
					color: config.label_color,
				})
			}

			function addSpanElement(elem) {
				$("<span></span>").appendTo(elem).css({
					"line-height": config.size + "px",
					"font-size": .22 * config.size + "px",
					color: config.animate_text_colors == "1" ? config.fgcolor : "",
				});
			}

			function getDataFields(elem) {
				$.each(configItems, function (prop, value) {
					config[value] = elem.data(value) !== undef ? elem.data(value) : $(defaultConfig).attr(value);
				});
			}

			function draw() {
				// Prepare canvas for drawing
				var canvasContext = canvasElement.getContext("2d");
				canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
				drawGaugeBackground(canvasContext);
				config.scale && drawScale(canvasContext);
				drawGauge(canvasContext);

				// Enf of first time initialization
				gaugeElement.data("initialized", true);
			}

			// The update method
			function updateGauge(elapsedTime) {
				// Abort if there is nothing to do
				if (currentValue > 0 && currentValue === targetValue) return;
				// How far have we moved at that time?					
				var diff = gaugeElement.data("deltaValue");
				var curr = Math.abs(currentValue - gaugeElement.data("startValue"));
				var progress = diff > 0 ? curr / diff : 1;
				var increment = animationStepIncrement;

				if (config.smooth_animation) {
					increment *= Math.sin((progress * 180) * radians) + 0.01;
				}
				// Factor in the speed of the animation
				increment *= config.speed;
				// Are we incrementing or decrementing?
				increment *= (currentValue < targetValue ? 1 : -1);

				if (currentValue < targetValue) {
					currentValue = Math.min(currentValue + increment, targetValue);
				} else if (currentValue > targetValue) {
					currentValue = Math.max(currentValue + increment, targetValue);
				}
				// Update the gauge
				draw();

				if (currentValue !== targetValue) {
					// Schedule update to be called just before the next repaint					
					requestAnimationFrame(updateGauge);
				}
			}

			function drawLineAlongScale(canvasContext, angle, width = 1, style, offset = 1, length = 5) {
				var _x1, _x2, _y1, _y2;
				var l = length / 100;
				var offset1 = offset - (config.width / config.size) * 2.5 - (length / 100);
				var offset2 = offset - (config.width / config.size) * 2.5;

				canvasContext.save();

				// Draw start line
				_x1 = _x2 = Math.cos(angle);
				_y1 = _y2 = Math.sin(angle);
				_x1 *= (radius * offset1), _x1 += xCoord;
				_y1 *= (radius * offset1), _y1 += yCoord;
				_x2 *= (radius * offset2), _x2 += xCoord;
				_y2 *= (radius * offset2), _y2 += yCoord;

				canvasContext.beginPath();
				canvasContext.moveTo(_x1, _y1);
				canvasContext.lineTo(_x2, _y2);
				canvasContext.setLineDash([]);
				canvasContext.strokeStyle = config.scale_style;
				canvasContext.lineWidth = width;
				canvasContext.lineCap = "square";
				canvasContext.stroke();

				canvasContext.restore();
			}

			function drawScale(canvasContext) {
				var width = Math.max(config.size / 250, 1);
				var spacing = (stopAngle - startAngle) / 10;
				for (var i = 0; i <= 10; i++) {
					drawLineAlongScale(canvasContext, startAngle + (i * spacing) + rotation, i % 5 === 0 ? width * 3 : width);
				}
			}

			function drawGaugeBackground(canvasContext) {
				canvasContext.save();

				// Draw actual gauge background				
				canvasContext.beginPath();
				canvasContext.arc(xCoord, yCoord, radius, startAngle, stopAngle, false);
				canvasContext.strokeStyle = config.background_style;
				canvasContext.lineWidth = config.width < 1 || isNaN(config.width) ? config.size / 20 : config.width;
				config.stripe > 0 ? canvasContext.setLineDash([config.stripe], 1) : canvasContext.lineCap = "round";
				// If the canvas needs to be filled, apply the fill
				if (config.fill !== undef) {
					canvasContext.fillStyle = config.fill;
					canvasContext.fill()
				}
				canvasContext.stroke(); // Draw it			

				canvasContext.restore();
			}

			function drawGauge(canvasContext) {
				var color;
				var gaugeValueDisplay = $("SPAN", "#" + config.id);
				var displayValue = (config.used && config.total) ? currentValue * config.total / 100 : currentValue;
				var content = config.text !== undef ? config.text : Math.floor(parseInt(displayValue)).toString();

				canvasContext.save();

				gaugeValueDisplay.html("<s>" + config.prepend + content + "</s>" + "<u>" + config.append + "</u>");

				// Check if we want to animate the gauge or gauge text and determine color
				// This gets overriden if 'data-color' is set to a fixed color
				if (!config.color) {
					color = config.animate_gauge_colors ? getColorByTheme(currentValue) : color = getColorByTheme(targetValue);
					if (config.animate_text_colors) {
						gaugeValueDisplay.css({
							color: getColorByTheme(currentValue)
						})
					} else {
						gaugeValueDisplay.css({
							color: getColorByTheme(targetValue)
						})
					}
				} else {
					color = config.color;
					gaugeValueDisplay.css({
						color: color
					})
				}
				config.fgcolor = color;

				// Draw the filled part of the gauge
				if (currentValue > 0) {
					canvasContext.beginPath();
					canvasContext.arc(xCoord, yCoord, radius, startAngleFill, gaugeRadians * (currentValue / 100) + startAngleFill, false);
					canvasContext.lineWidth = config.width < 1 || isNaN(config.width) ? config.size / 20 : config.width;
					config.stripe > 0 ? canvasContext.setLineDash([config.stripe], 1) : canvasContext.lineCap = "round";
					canvasContext.strokeStyle = config.fgcolor;
					canvasContext.stroke(); // Draw it
				}

				canvasContext.restore();
			}

			// Copy "id" attribute to "data-id" attribute
			$(this).attr("data-id", $(this).attr("id"));

			// Main script
			var main = function () {
				// Get config from data-* fields		
				getDataFields(gaugeElement);

				// Draw jsGauge label
				if (config.label !== undef) {
					addLabel(gaugeElement, config.size / 13, config.label);
				}
				
				// Fetch or prepare container div
				if (gaugeElement.data("initialized") !== true) {
					gaugeElement.addClass("gaugeMeter");
					// Add span for gauge content
					addSpanElement(gaugeElement);
					// Initialize canvas & canvas context
					canvasElement = $("<canvas></canvas>").attr({
						width: config.size,
						height: config.size
					}).appendTo(gaugeElement)[0];
				} else {
					var id = gaugeElement.attr("id");
					canvasElement = $(`#${id} > canvas`).get(0);
				}

				xCoord = canvasElement.width / 2;
				yCoord = canvasElement.height / 2;
				radius = (360 * config.percent * radians, canvasElement.width / 2.5);
				style = gaugeElement.data("style");

				// Determine target percentage
				if (config.total !== undef && config.used !== undef) {
					// Use a 'total' and 'used' value to calculate percentage
					var total = config.total / 100;
					targetValue = parseFloat(config.used / total);
				} else if (config.percent !== undef) {
					// Use a fixed percentage to draw gauge
					targetValue = parseFloat(config.percent);
				} else {
					targetValue = parseFloat(defaultConfig.percent);
				}

				if (gaugeElement.data("newValue") === undef) {
					currentValue = config.animationstep === 0 ? targetValue : 0;
				} else {
					currentValue = gaugeElement.data("newValue");
				}
				gaugeElement.data("startValue", currentValue);
				gaugeElement.data("newValue", targetValue);
				gaugeElement.data("deltaValue", Math.abs(targetValue - currentValue));
				animationStepIncrement = Math.max(gaugeElement.data("deltaValue") / 100, config.animationstep);

				switch (style ? style.toLowerCase() : undef) {
					case "dial":
					case "arc": {
						stopAngle = 2.195 * pi;
						startAngle = 0.805 * pi;
						gaugeRadians = stopAngle - startAngle;
						startAngleFill = 0.805 * pi;
						rotation = 0;
						break;
					}
					case "semi":
					case "half": {
						stopAngle = 2 * pi;
						startAngle = pi;
						gaugeRadians = stopAngle - startAngle;
						startAngleFill = pi;
						rotation = 0;
						break;
					}
					default:
					case "circle":
					case "full": {
						stopAngle = 2 * pi;
						startAngle = 0;
						gaugeRadians = 2 * pi;
						startAngleFill = 1.5 * pi;
						rotation = -90 * radians;
						break;
					}
				}
				// Kickstart the animation
				window.requestAnimationFrame(updateGauge);
			}();
		});
	}
}(jQuery);