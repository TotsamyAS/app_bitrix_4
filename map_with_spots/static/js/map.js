ymaps.ready(init);

function init(){
    // Добавляем стили для карты
    const mapContainer = document.getElementById('map');
    mapContainer.style.width = '100%';
    mapContainer.style.height = '600px';

    let myMap = new ymaps.Map('map', {
        center: [59.94, 30.31], // Центр на Санкт-Петербург
        zoom: 10
    }, {
        searchControlProvider: 'yandex#search'
    });

    let request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let companies = JSON.parse(this.responseText);
            console.log('Получены компании:', companies); // для отладки

            for (const company of Object.values(companies)) {

                if (company['ADDRESS']) {
                    ymaps.geocode(company['ADDRESS']).then(function(res){
                        let firstGeoObject = res.geoObjects.get(0);

                        if (firstGeoObject) {
                            let coordinates = firstGeoObject.geometry.getCoordinates();

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
            console.error('Ошибка загрузки данных:', this.status, this.statusText);
        }
    };

    request.open("GET", "company_list/");
    request.send();
}