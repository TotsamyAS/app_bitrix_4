ymaps.ready(init);

function init(){
    // стили для карты
    const mapContainer = document.getElementById('map');
    mapContainer.style.width = '100%';
    mapContainer.style.height = '600px';

    let myMap = new ymaps.Map('map', {
        center: [59.94, 30.31], // координаты Санкт-Петербурга
        zoom: 10
    }, {
        searchControlProvider: 'yandex#search'
    });

    let request = new XMLHttpRequest();

    request.onreadystatechange = function() {
//        readyState 4 означает, что элемент полностью загружен
        if (this.readyState == 4 && this.status == 200) {
            let companies = JSON.parse(this.responseText);
            console.log('Получены компании:', companies); // для отладки

            for (const company of Object.values(companies)) {

                if (company['ADDRESS']) {
                    ymaps.geocode(company['ADDRESS']).then(function(res){
                        let firstGeoObject = res.geoObjects.get(0);

                        if (firstGeoObject) {
                            // добалвяем координаты
                            let coordinates = firstGeoObject.geometry.getCoordinates();
                            // добавляем метку на карту по координатам
                            myMap.geoObjects.add(new ymaps.Placemark(
                                coordinates,
                                {
                                    balloonContent: `<strong>${company['TITLE']}</strong><br>${company['ADDRESS']}`
                                },
                                {
                                    preset: 'islands#blueDotIcon'
                                }
                            ));

                            console.log('Добавлена метка:', company['TITLE'], coordinates);
                        } else {
                            console.warn('Не удалось найти координаты для:', company['ADDRESS']);
                        }
                    }).catch(function(error) {
                        console.error('Ошибка геокодирования:', error, 'для адреса:', company['ADDRESS']);
                    });
                }
            }
        } else if (this.readyState == 4) {
            // если статус загрузки не 200
            console.error('Ошибка загрузки данных:', this.status, this.statusText);
        }
    };
    // получаем тут json компаний для отображения их на карте
    request.open("GET", "company_list/");
    request.send();
}