mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: campground.geometry.coordinates,
    zoom: 13
});

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offser:25})
            .setHTML(
                `<h5>${campground.title}</h5> <p>${campground.location}</p>`
            )
    )
    .addTo(map);
    
    map.addControl(new mapboxgl.NavigationControl());