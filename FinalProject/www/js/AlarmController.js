angular.module('WakingUp').controller('AlarmCtrl', function($scope, $window, $location, ionicTimePicker, ionicDatePicker) {  
    var clock, datepick;
    var particle = new Particle();
    
    $scope.timerData = {
        clock: 0,
        datepk: 0,
        alarms: []
    };

    $scope.optionlabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    $scope.options = {};
    $scope.options.index = 2;

    $scope.initPickers = function(){
        $scope.timerData.clock = new Date();
        $scope.timerData.datepk = new Date();

        clock = {
            callback: function (val) {
                if (typeof (val) === 'undefined') {
                    console.log('Time not selected');
                } else {
                    $scope.timerData.clock = new Date(val * 1000);
                    //console.log('Selected epoch is : ', val, 'and the time is ', $scope.timerData.clock.getUTCHours(), 'H :', $scope.timerData.clock.getUTCMinutes(), 'M');
                }
            },
        };

        datepick = {
            callback: function (val) {
                $scope.timerData.datepk = new Date(val);
                //console.log('Return value from the datepicker popup is : ' + val, $scope.timerData.datepk);
            },
            from: new Date(2016, 1, 1),
            to: new Date(2020, 11, 31),
            inputDate: new Date(),
            mondayFirst: false,
            disableWeekdays: [0],
            closeOnSelect: false,
            templateType: 'popup'
        };
    };

    $scope.chooseTime = function(){
        ionicTimePicker.openTimePicker(clock);
    };

    ionicTimePicker.openTimePicker(clock);
    
    $scope.chooseDate = function(){
        ionicDatePicker.openDatePicker(datepick);
    };

    $scope.createAlarm = function(){
        //console.log($scope.timerData.datepk.getFullYear() + " year " + $scope.timerData.datepk.getMonth() + " month " + $scope.timerData.datepk.getDate() + " day");
        //console.log($scope.timerData.clock.getHours() + 6 + " hour " + $scope.timerData.clock.getMinutes() + " minutes " + $scope.timerData.clock.getSeconds() + " seconds");
        var timealarm = new Date(
                    $scope.timerData.datepk.getFullYear(),
                    $scope.timerData.datepk.getMonth(),
                    $scope.timerData.datepk.getDate(),
                    $scope.timerData.clock.getHours() + 6,
                    $scope.timerData.clock.getMinutes(),
                    $scope.timerData.clock.getSeconds(),
                    0);
        var timemilis = timealarm.getTime() - new Date().getTime();

        console.log(timemilis);
        $scope.timerData.alarms.push({
            timing: timealarm.toDateString() + " " + timealarm.toTimeString(),
            milis: timemilis,
            alarm: setTimeout( function(){
                console.log("Alarma!! :D");
                var func = particle.callFunction(
                    { deviceId: '20003d000447343233323032',
                    name: 'Alarm',
                    argument: '' + $scope.options.index + 1,
                    auth: 'a581cc93a9e938d1334c095ce80fdbeae750d5ec'
                });

                func.then(
                function(data) {
                    console.log('Function called succesfully:', data);
                }, function(err) {
                    console.log('An error occurred:', err);
                });
            }, timemilis),
            key: $scope.timerData.alarms.length + 1
        });
        //console.log($scope.timerData.alarms);
    }.bind(null, $scope.timerData.clock, $scope.timerData.datepk);
});