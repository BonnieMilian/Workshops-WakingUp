var app = angular.module('WakingUp', ['ionic', 'ionic-datepicker', 'ionic-timepicker']);
app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl'
  });

  $stateProvider.state('alarm', {
      url: '/alarm',
      templateUrl: 'templates/alarm.html',
      controller: 'AlarmCtrl'
  });

  $urlRouterProvider.otherwise('/home');
});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.cordova && window.cordova.InAppBrowser) {
      window.open = window.cordova.InAppBrowser.open;
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

app.config(function ($ionicConfigProvider, ionicDatePickerProvider) {
	var datePickerObj = {
	  setLabel: 'Ok',
	  todayLabel: 'Hoy',
	  closeLabel: 'Cerrar',
	  mondayFirst: false,
	  inputDate: new Date(),
	  weeksList: ["D", "L", "M", "M", "J", "V", "S"],
	  monthsList: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
	  templateType: 'popup',
	  showTodayButton: true,
	  dateFormat: 'dd MMM yyyy',
	  closeOnSelect: false,
	  from: new Date(2015, 8, 1)
	};

	ionicDatePickerProvider.configDatePicker(datePickerObj);
	$ionicConfigProvider.tabs.position('bottom');
});

app.config(function ($ionicConfigProvider, ionicTimePickerProvider) {
  var timePickerObj = {
    inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
    format: 12,
    step: 1,
    setLabel: 'Ok',
    closeLabel: 'Cerrar'
  };
  ionicTimePickerProvider.configTimePicker(timePickerObj);
});