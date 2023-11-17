function loadProjects(){
    // let path = window.location.pathname
    // if(path.includes("projects.html")){
        // console.log(path)
        let gallery = document.getElementById("gallery")
        let galleryCarousel = document.getElementById("gallery-carousel")
        let inner = galleryCarousel.querySelector("div")
        // let inner = projectsCarousel.querySelector("div")
        fetch("/manifest.json")
        .then(res => res.json())
        .then(manifest => {
            // let manifest = data.json()
            let images = manifest["images"]
            for(let i=0;i<images.length;i++){
                let item = document.createElement("div")
                item.classList.add("col-12")
                item.classList.add("col-sm-6")
                item.classList.add("col-lg-3")
                let imageElm = document.createElement("img")
                imageElm.classList.add("w-100")
                imageElm.classList.add("mt-4")
                imageElm.classList.add("img-fluid")
                imageElm.src = images[i]
                imageElm.setAttribute("data-bs-target", "#gallery-carousel")
                imageElm.setAttribute("data-bs-slide", i)
                item.appendChild(imageElm)
                gallery.appendChild(item)
                let carouselItem = document.createElement("div")
                let carouselImage = document.createElement("img")
                carouselImage.src = images[i]
                carouselItem.classList.add("carousel-item")
                carouselImage.classList.add("d-block")
                carouselImage.classList.add("w-100")
                carouselItem.appendChild(carouselImage)
                if(i == 0){
                    carouselItem.classList.add("active")
                }
                inner.appendChild(carouselItem)
            }
            htmx.process(gallery)
            htmx.process(galleryCarousel)
        })
    // }
}
function loadMap(){
    var map = L.map("map").setView([34.501876, -82.016902], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    var popup = L.popup()
    .setLatLng([34.501876, -82.016902])
    .setContent("Laurens, SC 29360")
    .openOn(map);
}
// https://maps.google.com/maps?ll=34.501876,-82.016902&z=14&t=m&hl=en-US&gl=US&mapclient=embed&q=Laurens%20South%20Carolina%2029360
window.onload = async () => {
    let currentYear = new Date().getFullYear()
    document.getElementById("copyright-year").innerText = currentYear.toString()
    
}

htmx.on("htmx:load", function(evt) {
    console.log(evt)
    if (evt.target.id === "gallery-modal"){
        loadProjects()
    } else if (evt.target.id === "contact-us"){
        loadMap()
    }
});