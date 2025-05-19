if(document.querySelector('#mapa')) {

    const lat = 4.6492643;
    const lng = -74.0798208;
    const zoom = 16;
    var map = L.map('mapa').setView([lat, lng], zoom);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([lat, lng]).addTo(map)
        .bindPopup(`
            <h2 class="mapa__heading">DevWebCamp</h2>
            <p class="mapa__texto">Movistar Arena</p>
            
            `)
        .openPopup();
 }