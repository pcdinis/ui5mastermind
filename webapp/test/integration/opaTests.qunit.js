/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require(["pt/deploy/game/ui5mastermind/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
