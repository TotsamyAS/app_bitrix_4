ymap.ready(init)
function init(){
    let myMap = new ymaps.Map('map',{
        center: [60, 30]
    },{
    searchControlProvider: 'yandex#search'
    })
    let request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        // readyState 4 означает, что загрузка завершена
        if (this.readyState == 4 && this.status == 200) {
            let companies = JSON.parse(this.responseText);

            for (const company of Object.values(companies)) {
                let object = ymaps.geocode(`$company['ADDRESS'][0]['PROVINCE'], ${comp['ADDRESS'][0]['CITY']}, ${comp['ADDRESS'][0]['ADDRESS_1']}`)
                object.then(function(res){
                    let coordinates = res
                        .getObjects
                        .properties
                        ._data
                        .metaDataProperty
                        .GeocoderResponseMetaData
                        .Point
                        .coordinates
                    myMap
                        .geoObjects
                        .add(new ymaps.Placemark(
                        [coordinates[1], coordinates[0]],
                         {balloonContent: `<strong>${comp['TITLE']}</strong>` + '\n' + `${comp['ADDRESS'][0]['PROVINCE']}, ${comp['ADDRESS'][0]['ADDRESS_1']}`}, ));

                })
            }
        }
    }
}