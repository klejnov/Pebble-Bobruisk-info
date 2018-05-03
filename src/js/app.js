var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');

// Construct the app glance slice object
var CurrentTime = new Date();
CurrentTime.setMinutes(CurrentTime.getMinutes() + 5);
console.log(CurrentTime);



var appGlanceSlices = [{
    "layout": {
        "subtitleTemplateString": "Pogoda i kursi valut"
    },
    "expirationTime": CurrentTime
  }];

function appGlanceSuccess(appGlanceSlices, appGlanceReloadResult) {
    console.log('SUCCESS!');
    console.log(CurrentTime);
}

function appGlanceFailure(appGlanceSlices, appGlanceReloadResult) {
    console.log('FAILURE!');
}



// Loading Window Weather
var WindowWeather = new UI.Window({
    status: true,
    scrollable: true
});

var loadingBg = new UI.Rect({
    position: new Vector2(0, 0),
    size: new Vector2(144, 168), // full width and height of pebble window
    backgroundColor: 'clear', // in-built colours
});

var icoWeather = new UI.Image({
    position: new Vector2(0, 8),
    size: new Vector2(144, 50),
    image: 'images/cloud-reload.png'
});

var loadingTemperature = new UI.Text({
    position: new Vector2(0, 60),
    size: new Vector2(144, 35),
    text: '',
    font: 'GOTHIC_28_BOLD',
    color: 'white',
    textOverflow: 'wrap',
    textAlign: 'center',
    backgroundColor: 'clear'
});

var loadingInfo = new UI.Text({
    position: new Vector2(0, 90),
    size: new Vector2(144, 190),
    text: '',
    font: 'GOTHIC_18', // in-built font
    color: 'white',
    textOverflow: 'wrap',
    textAlign: 'center',
    backgroundColor: 'clear'
});


// Loading Window Currency
var WindowCurrency = new UI.Window({
    status: true,
    scrollable: true
});

var loadingCurrencyBg = new UI.Rect({
    position: new Vector2(0, 0),
    size: new Vector2(144, 168), // full width and height of pebble window
    backgroundColor: 'clear', // in-built colours
});

var loadingTitleCurrency = new UI.Text({
    position: new Vector2(0, 0),
    size: new Vector2(144, 25),
    text: '',
    font: 'GOTHIC_18',
    color: 'white',
    textOverflow: 'wrap',
    textAlign: 'center',
    backgroundColor: 'red'
});

var loadingValueCurrency = new UI.Text({
    position: new Vector2(0, 25),
    size: new Vector2(144, 75),
    text: '',
    font: 'GOTHIC_24_BOLD',
    color: 'white',
    textOverflow: 'wrap',
    textAlign: 'center',
    backgroundColor: 'green'
});

var loadingUpdateCurrency = new UI.Text({
    position: new Vector2(0, 100),
    size: new Vector2(144, 20),
    text: '',
    font: 'GOTHIC_14',
    color: 'white',
    textOverflow: 'wrap',
    textAlign: 'center',
    backgroundColor: 'blue'
});

var loadingTitleCurrency_nbrb = new UI.Text({
    position: new Vector2(0, 120),
    size: new Vector2(144, 25),
    text: 'НАЦ.БАНК РБ',
    font: 'GOTHIC_18',
    color: 'white',
    textOverflow: 'wrap',
    textAlign: 'center',
    backgroundColor: 'red'
});

var loadingValueCurrency_nbrb = new UI.Text({
    position: new Vector2(0, 145),
    size: new Vector2(144, 75),
    text: '',
    font: 'GOTHIC_24_BOLD',
    color: 'white',
    textOverflow: 'wrap',
    textAlign: 'center',
    backgroundColor: 'green'
});

var menu = new UI.Menu({
    backgroundColor: 'black',
    textColor: 'white',
    highlightBackgroundColor: 'blue',
    highlightTextColor: 'white',
    sections: [{
        title: 'Меню',
        items: [{
            title: 'Погода',
            subtitle: 'В Бобруйске сейчас...',
            icon: 'images/weather_icon.png'
    }, {
            title: 'Курсы валют',
            icon: 'images/exchange_rates.png'
    }]
  }]
});


menu.show();
updateWeather();


menu.on('select', function (e) {

    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');

    if (e.itemIndex === 0) {

        updateWeather();
        // Add background and text elements to the window
        WindowWeather.add(loadingBg);
        WindowWeather.add(icoWeather);
        WindowWeather.add(loadingTemperature);
        WindowWeather.add(loadingInfo);

        // Show the window
        WindowWeather.show();

        // main.show();
    } else if (e.itemIndex === 1) {
        updateCurrency();

        WindowCurrency.add(loadingCurrencyBg);
        WindowCurrency.add(loadingTitleCurrency);
        WindowCurrency.add(loadingValueCurrency);
        WindowCurrency.add(loadingUpdateCurrency);

        WindowCurrency.add(loadingTitleCurrency_nbrb);
        WindowCurrency.add(loadingValueCurrency_nbrb);

        console.log('Открыто меню курсов валют');

        // Show the window
        WindowCurrency.show();
    } else {
        console.log('Открыто другое меню');
    }

});

function updateWeather() {
    // Trigger a reload of the slices in the app glance
    Pebble.appGlanceReload(appGlanceSlices, appGlanceSuccess, appGlanceFailure);

    loadingInfo.text('');
    icoWeather.image('images/cloud-reload.png');
    loadingTemperature.text('Обновление');
    // Получаем json из API
    ajax({
            url: 'http://klejnov.bobr.by:81/pebble_weather.php?weather=show',
            type: 'json'
        },
        function (data) {

            loadingTemperature.text(data.info);

        //Заменим подпись меню при старте на текущую температуру
            var section = {
                title: 'Меню',
                items: [{
                    title: 'Погода',
                    subtitle: data.info,
                    icon: 'images/weather_icon.png'
                        }, {
                    title: 'Курсы валют',
                    icon: 'images/exchange_rates.png'
                            }]
            };
            menu.section(0, section);

            console.log('success: ' + data.info);
        },
        function (error) {
            // Failure!
            console.log('Failed data: ' + JSON.stringify(error));
        }
    );

    ajax({
            url: 'https://www2.bobr.by/api/weather/forecast',
            type: 'json'
        },
        function (data) {
            loadingInfo.text(data.currentData.summary + '\nВлажность: ' + data.currentData.humidity + ' %' + '\nТочка росы: ' + data.currentData.dewPoint + ' °C' + '\nВетер: ' + data.currentData.windSpeed + ' м/с' + '\nПорывы ветра: ' + data.currentData.windGust + ' м/с' + '\nДавление: ' + data.currentData.pressure + ' мм рт. ст.' + '\nУФ индекс: ' + data.currentData.uvIndex + '' + '\nОзоновый слой: ' + data.currentData.ozone * 0.01 + ' мм.');

            if (data.currentData.icon == 'clear-day') {
                icoWeather.image('images/ic_weather_clear_day.png');
            } else if (data.currentData.icon == 'clear-night') {
                icoWeather.image('images/ic_weather_clear_night.png');
            } else if (data.currentData.icon == 'cloudy') {
                icoWeather.image('images/ic_weather_cloudy.png');
            } else if (data.currentData.icon == 'partly-cloudy-day') {
                icoWeather.image('images/ic_weather_partly_cloudy_day.png');
            } else if (data.currentData.icon == 'partly-cloudy-night') {
                icoWeather.image('images/ic_weather_partly_cloudy_night.png');
            } else if (data.currentData.icon == 'rain') {
                icoWeather.image('images/ic_weather_rain.png');
            } else if (data.currentData.icon == 'sleet') {
                icoWeather.image('images/ic_weather_sleet.png');
            } else if (data.currentData.icon == 'snow') {
                icoWeather.image('images/ic_weather_snow.png');
            } else if (data.currentData.icon == 'wind') {
                icoWeather.image('images/ic_weather_wind.png');
            } else {
                icoWeather.image('images/ic_weather_no_icon.png');
            }
            console.log('success: ' + data.currentData.summary);
            console.log('Иконка погоды: ' + data.currentData.icon);
        },
        function (error) {
            // Failure!
            console.log('Failed data: ' + JSON.stringify(error));
        }
    );
}

function updateWeatherHome() {
    console.log('Длинное нажатеи');
}

function updateCurrency() {

    loadingTitleCurrency.text('ПОКУПКА  |  ПРОДАЖА');
    loadingUpdateCurrency.text('Обновление');

    // Получаем json из API
    ajax({
            url: 'http://klejnov.bobr.by:81/pebble_weather.php?currency=show',
            type: 'json'
        },
        function (data) {

            loadingValueCurrency.text(data.usd_buy + ' $ ' + data.usd_sell + '\n' + data.eur_buy + ' € ' + data.eur_sell + ' \n ' + data.rub_buy + ' P ' + data.rub_sell);
            loadingUpdateCurrency.text('Обновлено в: ' + data.update);

            console.log('success: ' + data.update);
        },
        function (error) {
            // Failure!
            console.log('Failed data: ' + JSON.stringify(error));
        }
    );

  
    // Получаем json из API
    ajax({
            url: 'http://www.nbrb.by/API/ExRates/Rates?Periodicity=0',
            type: 'json'
        },
        function (data) {

            var usd_nbrb = data[4].Cur_OfficialRate;
            var eur_nbrb = data[5].Cur_OfficialRate;
            var rub_nbrb = data[16].Cur_OfficialRate;

            loadingValueCurrency_nbrb.text('$ ' + usd_nbrb + '\n' + ' € ' + eur_nbrb + ' \n ' + ' P ' + rub_nbrb);

            console.log('Нац.банк USD сегодня: ' + data[4].Cur_OfficialRate + 'дата: ' + data[4].Date);
        },
        function (error) {
            // Failure!
            console.log('Failed data: ' + JSON.stringify(error));
        }
    );
  
      // Сгенерируем завтрашнюю дату
  var nextDayNbrb = new Date();
  nextDayNbrb.setDate(nextDayNbrb.getDate() - 2);
  nextDayNbrb = (nextDayNbrb).toJSON();
  console.log('Дата: ' + nextDayNbrb);
  
  
  // Получаем json из API
    ajax({
            url: 'http://www.nbrb.by/API/ExRates/Rates?onDate=' + nextDayNbrb + '&Periodicity=0',
            type: 'json'
        },
        function (data) {
          
            var usd_nbrb_next = data[4].Cur_OfficialRate;
            var eur_nbrb_next = data[5].Cur_OfficialRate;
            var rub_nbrb_next = data[16].Cur_OfficialRate;
          
            loadingValueCurrency_nbrb.text('$ ' + usd_nbrb_next + '\n' + ' € ' + eur_nbrb_next + ' \n ' + ' P ' + rub_nbrb_next);

            console.log('Нац.банк USD завтра: ' + data[4].Cur_OfficialRate + 'дата: ' + data[4].Date);
        },
        function (error) {
            // Failure!
            console.log('Failed data: ' + JSON.stringify(error));
        }
    );
  
//   if (flag) {
//     console.log('Курсы за сегодня');
//   } else {
//     console.log('Курсы за сегодня и завтра');
//   }
}

// реакция на нажатие кнопки select 
WindowWeather.on('click', 'select', updateWeather);
WindowCurrency.on('click', 'select', updateCurrency);
// реакция на долгое нажатие select 
WindowWeather.on('longClick', 'select', updateWeatherHome);

//updateWeather();

console.log('Отработано');
