sap.ui.define([
	"sap/ui/test/Opa5",
	"pt/deploy/game/ui5mastermind/localService/mockserver"
], function (Opa5, mockserver) {
	"use strict";

	return Opa5.extend("pt.deploy.game.ui5mastermind.test.integration.arrangements.Startup", {

		iStartMyApp: function (oOptionsParameter) {
			var oOptions = oOptionsParameter || {};

			// start the app with a minimal delay to make tests fast but still async to discover basic timing issues
			oOptions.delay = oOptions.delay || 50;

			// configure mock server with the current options
			var oMockServerInitialized = mockserver.init(oOptions);

			this.iWaitForPromise(oMockServerInitialized);

			// start the app UI component
			this.iStartMyUIComponent({
				componentConfig: {
					name: "pt.deploy.game.ui5mastermind",
					async: true
				},
				hash: oOptions.hash,
				autoWait: oOptions.autoWait
			});
		}
	});
});
