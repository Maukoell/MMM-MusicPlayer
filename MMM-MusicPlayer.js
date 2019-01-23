Module.register("MMM-MusicPlayer",{	
	defaults: {
		playButtonPIN: 10,
        	nextButtonPIN: 12,
        	clickDelay: 500,
        	musicPath = "/home/pi/MagicMirror/modules/MMM-MusicPlayer/music",		
	},	
	start: function() {
		this.sendSocketNotification("BUTTON_CONFIG", this.config);
		Log.info('Starting module: ' + this.name);
	}
});