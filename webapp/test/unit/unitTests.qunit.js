/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ptdeploy.game./ui5mastermind/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
