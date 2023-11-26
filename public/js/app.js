
const bucketURL = "https://parlpetrolserv.nyc3.cdn.digitaloceanspaces.com"
const emailURL = "https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-c050935f-c37b-4d8e-9147-0742507e06b1/sendgrid/pps-contact"

function populateCustomers(images){
    let galleryCarousel = document.getElementById("customer-carousel")
    let inner = galleryCarousel.querySelector("div")
    for(let i=0;i<images.length;i++){
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
    htmx.process(galleryCarousel)
}
function populateProjects(images){
    let gallery = document.getElementById("gallery")
    let galleryCarousel = document.getElementById("gallery-carousel")
    let inner = galleryCarousel.querySelector("div")
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
        imageElm.setAttribute("data-bs-slide-to", i)
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
}
function loadProjects(){
    // let path = window.location.pathname
    // if(path.includes("projects.html")){
        // console.log(path)
        // let inner = projectsCarousel.querySelector("div")
        return fetch("/manifest.json")
        .then(res => res.json())
        .then(manifest => {
            // let manifest = data.json()
            return manifest["images"]
            
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
function getImageURLS(key){
    let items = localStorage.getItem(key)
    if(items){
        return new Promise((resolve, reject) => {
            resolve(items.split(",").map(imageName => {return `${imageName}`}))
        })
    } else {
        return fetch(bucketURL)
        .then(res => res.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(xml => {
            let imageURLS = []
            let entries = xml.getElementsByTagName("Contents")
            for(let i =0;i<entries.length;i++){
                let imageName = entries[i].getElementsByTagName("Key")[0].textContent
                let size = parseInt(entries[i].getElementsByTagName("Size")[0].textContent)
                let imageURL = `${bucketURL}/${imageName}`
                if (imageName.includes(key) && size > 1000){
                    imageURLS.push(imageURL)
                }
            }
            localStorage.setItem(key, imageURLS)
            // console.log(imageURLS)
            return imageURLS
        })
    }
}
// https://maps.google.com/maps?ll=34.501876,-82.016902&z=14&t=m&hl=en-US&gl=US&mapclient=embed&q=Laurens%20South%20Carolina%2029360
window.onload = async () => {
    let currentYear = new Date().getFullYear()
    document.getElementById("copyright-year").innerText = currentYear.toString()
    // getImageURLS()
}
htmx.on("htmx:beforeSend", function(evt) {
    let path = window.location.pathname
    console.log(path)
    if(evt.target.id === "home" && path !== "/"){
        return false
    }
})

htmx.on("htmx:load", function(evt) {
    console.log(evt)
    // let scrollPxToTop = evt.target.scroll
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (evt.target.id === "gallery-modal"){
        // loadProjects().then(images =>{
        let key = "projects"
        getImageURLS(key).then(images => {
            console.log(images)
            populateProjects(images)
        })
    } else if (evt.target.id === "contact-us"){
        loadMap()
    }
})