sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/ColorPalettePopover"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ColorPalettePopover) {
        "use strict";

        var guessRow;
        var colorCode = ['white','black','yellow','red','green','blue'];
        var vBt;
        var oColorPalettePopoverMinDefautButton;
        var btPressed;
        var btPressedId;
        var breakCode = [];
        var guessTableCols = [];

        return Controller.extend("pt.deploy.game.ui5mastermind.controller.MainView", {

            onInit: function () {
                // init variables
                this.initialize();
                // set the board game
                this.buildBoardGame();
                // get the code
                this.getRandomCode();
                //this.getSpecificCode(); // Just for test purposes!!!
            },

            initialize: function(){
                guessRow = 7;
                guessTableCols = [];
                breakCode = [];
            },

            buildBoardGame: function() {
				// Get Vertical Box object
				var vMainVBox = this.getView().byId("idScrMainVBox");

                var vHBox;
                var vIco;

                var self = this;

                // LINES
                for(var i=0; i<8; i++){
                    if(i === 0){
                        vHBox = new sap.m.HBox({
                            id : 'idHBx' + i.toString()
                        }).addStyleClass("sapUiSmallMarginBottom");
                    }else{
                        vHBox = new sap.m.HBox({
                            id : 'idHBx' + i.toString()
                        }).addStyleClass("sapUiTinyMarginBottom");
                    }
                    vMainVBox.addItem(vHBox);

                    // COLUMNS
                   for(var b=0; b<4; b++){
                       var btID = 'idBt' + i.toString() + b.toString();
                        vBt = new sap.m.Button({
                            id : btID,
                            icon : '',
                            color : '#000000'
                        }).addStyleClass("roundClass").addStyleClass("sapUiTinyMarginBegin");

                        vBt.attachPress( function(oEvent){ 
                            self.onBtPress(oEvent);
                        });

                        vHBox.addItem(vBt);
                    }

                    // check if it's the first LINE and skip the result icons
                    if(i==0){
                        continue;
                    };

                    // RESULT COLUMN
                    var vHBoxSmall;
                    var vVBoxSmall;

                    vVBoxSmall = new sap.m.VBox({
                        id : 'idVBxSm' + i.toString()
                    }).addStyleClass("sapUiTinyMarginTop").addStyleClass("sapUiSmallMarginBegin");
                    
                    vHBox.addItem(vVBoxSmall);
                    
                    for(var t=0; t<2; t++){
                        vHBoxSmall = new sap.m.HBox({
                            id : 'idHBxSm' + i.toString() + t.toString(),
                        });
                        
                        vVBoxSmall.addItem(vHBoxSmall);

                        for(var r=0; r<2; r++){
                            vIco = new sap.ui.core.Icon({
                                id : 'idIcon' + i.toString() + t.toString() + r.toString(),
                                src : 'sap-icon://circle-task'
                                });
                            
                            vHBoxSmall.addItem(vIco);
                        }
                    }

                }

                var vHBoxBtRefresh = new sap.m.HBox({
                    id : 'idHBxBtRefresh',
                    alignItems : sap.m.FlexAlignItems.Center
                }).addStyleClass("sapUiLargeMarginTop"); 

                vMainVBox.addItem(vHBoxBtRefresh);

                var vBtRefresh = new sap.m.Button({
                    id : 'btIdRefresh',
                    text : 'Refresh',
                }).addStyleClass("sapUiTinyMarginBegin");

                vBtRefresh.attachPress( function(oEvent){ 
                    self.onBtRefreshPress(oEvent);
                });

                vHBoxBtRefresh.addItem(vBtRefresh);
            },

            onClearBoardGame: function(oEvent){
                // LINES
                for(var i=0; i<8; i++){
                    // COLUMNS
                   for(var b=0; b<4; b++){
                       var btId = 'idBt' + i.toString() + b.toString();
                       var oButton = sap.ui.getCore().getElementById(btId);
                       oButton.removeStyleClass(oButton.aCustomStyleClasses[2]);
                    }

                    // check if it's the first LINE and skip the result icons
                    if(i==0){
                        continue;
                    };

                    // RESULT COLUMN
                    for(var t=0; t<2; t++){
                        for(var r=0; r<2; r++){
                            var icoId = 'idIcon' + i.toString() +  t.toString() + r.toString();
                            var oIcon = sap.ui.getCore().getElementById(icoId);
                            oIcon.setSrc('sap-icon://circle-task');
                        }
                    }
                }
            },

            onBtRefreshPress: function(oEvent){
                // init variables
                this.initialize();
                // clear board game
                this.onClearBoardGame();
                // get the code
                this.getRandomCode();
            },

            onBtPress: function(oEvent){
                btPressedId = oEvent.getParameter("id");
                // Check if it arrived to the first line (the code break line)
                if(guessRow === 0){
                    return;
                }
                // Check if the pressed button belongs to the current row
                if (btPressedId.substring(4,5) != guessRow){
                    return;
                };
                btPressed = oEvent.getSource();
                
                if (!oColorPalettePopoverMinDefautButton) {
                    oColorPalettePopoverMinDefautButton = new ColorPalettePopover("oColorPalettePopoverMinDef", {
                        showDefaultColorButton: false,
                        showMoreColorsButton: false,
                        colors: colorCode, // ["black", "white", "red", "yellow", "green", "blue"],
                        colorSelect: function (oEvent){
                            // Style class is an array so we have to remove and add this style
                            btPressed.removeStyleClass(btPressed.aCustomStyleClasses[2])
                            btPressed.addStyleClass(oEvent.getParameter("value") + "BtColor");
                            // Update guess columns array
                            guessTableCols[btPressedId.substring(5,6)] = oEvent.getParameter("value");
                            // Check if line is complete
                            var lvComplete = true;
                            for(var i=0; i<4; i++){
                                if(guessTableCols[i] === undefined ){
                                    lvComplete = false;
                                }
                            }
                            if(lvComplete === true){ //(guessTableCols.length === 4){
                                // If it's completed check rules
                                var lvResult = [];
                                var breakCodeAux = breakCode.slice();

                                // Check black conditions
                                for(i=0; i<4; i++){
                                    if(guessTableCols[i] === breakCodeAux[i] ){
                                        lvResult[i] = 'B'; // Black
                                        breakCodeAux[i] = '';
                                    }
                                }  
                                // Check white conditions
                                for(i=0; i<4; i++){
                                    if(lvResult[i] != 'B'){
                                        for(var t=0; t<4; t++){
                                            if(guessTableCols[i] === breakCodeAux[t] ){
                                                lvResult[i] = 'W'; // White
                                                breakCodeAux[t] = '';
                                                break;
                                            }
                                        }
                                    }
                                }  

                                // Check WIN or LOSS
                                var vWin_bl = true;
                                if(lvResult.length === 4){
                                    for(i=0; i<4; i++){
                                        if(lvResult[i] != 'B' ){
                                            vWin_bl = false;
                                        }
                                    } 
                                }else{
                                    vWin_bl = false;
                                }

                                // Set icons with result (shuffled)
                                var ico;
                                var count = 0;
                                for(i=0; i<2; i++){
                                    for(t=0; t<2; t++){
                                        var lvPath = 'idIcon' + guessRow.toString() + i.toString() + t.toString();
                                        ico = sap.ui.getCore().getElementById(lvPath);
                                        if(lvResult[count] === 'B'){
                                            ico.setSrc('sap-icon://sys-enter-2');
                                        }else if(lvResult[count] === 'W'){
                                            ico.setSrc('sap-icon://sys-enter');
                                        }else{

                                        }
                                        count = count + 1; 
                                    }
                                }

                                // WIN condition
                                if(vWin_bl === true){
                                    for(i=0; i<4; i++){
                                    var btResult = sap.ui.getCore().getElementById('idBt0' + i.toString());
                                    btResult.addStyleClass(breakCode[i] + "BtColor");
                                    }
                                    guessRow = 1;
                                    sap.m.MessageBox.information("Congratulations! You break the secret code!");
                                }else if(guessRow === 1){
                                    for(i=0; i<4; i++){
                                        var btResult = sap.ui.getCore().getElementById('idBt0' + i.toString());
                                        btResult.addStyleClass(breakCode[i] + "BtColor");
                                    }
                                    sap.m.MessageBox.information("You didn't accomplish to break the secret code! Try next time!");
                                }

                                // Update guess row
                                guessRow = guessRow - 1;

                                // Clear guess table cols to start next row
                                guessTableCols = [];

                                // Clear result control
                                lvResult = [];
                                
                            }
                        }
                    });
                }
                oColorPalettePopoverMinDefautButton.openBy(oEvent.getSource());
            },

            getRandomCode: function(){
                var result;
                for(var i=0; i<4; i++){
                    result = this.getRandomNumber(5);
                    breakCode[i] = colorCode[result];
                }
            },

            // Just for test purposes
            getSpecificCode: function(){
                var result;
//              ["black", "white", "red", "yellow", "green", "blue"]                
                breakCode[0] = "white";
                breakCode[1] = "white";
                breakCode[2] = "black";
                breakCode[3] = "yellow";
//                for(var i=0; i<4; i++){
//                    breakCode[i] = colorCode[i];
//                }
            },

            getRandomNumber: function(max){
				return Math.floor(Math.random() * max);
			}
              
        });
    });
