sap.ui.define([
	"sap/ui/core/Component",
	"sap/m/Button",
	"sap/m/Bar",
	"sap/m/MessageToast"
], function (Component, Button, Bar, MessageToast) {

	return Component.extend("com.demo.demoshellplugin.Component", {

		metadata: {
			"manifest": "json"
		},

		init: function () {
			//var rendererPromise = this._getRenderer();
			var oRendererExt = jQuery.sap.getObject("sap.ushell.renderers.fiori2.RendererExtensions");
			//Add Language Buttons
			this.addLanguageButtons(oRendererExt);
		},

		addLanguageButtons: function (oRendererExt) {

			var toolbar = new sap.m.Toolbar({
				content: [
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						icon: $.sap.getModulePath("com.demo.demoshellplugin", "/images/de.png"),
						text: "German",
						press: jQuery.proxy(function () {
							this.updateUrl("de");
						}, this)
					}),
					new sap.m.Button({
						icon: $.sap.getModulePath("com.demo.demoshellplugin", "/images/uk.png"),
						text: "English",
						press: jQuery.proxy(function () {
							this.updateUrl("en");
						}, this)
					})
				]
			});
			oRendererExt.addSubHeader(toolbar);
		},

		updateUrl: function (sLanguage) {
			var currentUrl = window.location.href;

			if (currentUrl.indexOf('sap-language') > 0) {
				currentUrl = currentUrl.replace(/(sap-language=)[^\&]+/, '$1' + sLanguage);
			} else {
				currentUrl = window.location.origin + "/" + window.location.search + "&sap-language=" + sLanguage + window.location.hash;
			}

			window.location.href = currentUrl;
		},

		/**
		 * Returns the shell renderer instance in a reliable way,
		 * i.e. independent from the initialization time of the plug-in.
		 * This means that the current renderer is returned immediately, if it
		 * is already created (plug-in is loaded after renderer creation) or it
		 * listens to the &quot;rendererCreated&quot; event (plug-in is loaded
		 * before the renderer is created).
		 *
		 *  @returns {object}
		 *      a jQuery promise, resolved with the renderer instance, or
		 *      rejected with an error message.
		 */
		_getRenderer: function () {
			var that = this,
				oDeferred = new jQuery.Deferred(),
				oRenderer;

			that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
			if (!that._oShellContainer) {
				oDeferred.reject(
					"Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
			} else {
				oRenderer = that._oShellContainer.getRenderer();
				if (oRenderer) {
					oDeferred.resolve(oRenderer);
				} else {
					// renderer not initialized yet, listen to rendererCreated event
					that._onRendererCreated = function (oEvent) {
						oRenderer = oEvent.getParameter("renderer");
						if (oRenderer) {
							oDeferred.resolve(oRenderer);
						} else {
							oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
						}
					};
					that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
				}
			}
			return oDeferred.promise();
		}
	});
});