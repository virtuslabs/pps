window.onload = async () => {
    let currentYear = new Date().getFullYear()
    document.getElementById("copyright-year").innerText = currentYear.toString()
    let path = window.location.pathname
    if(path.includes("projects.html")){
        console.log(path)
        let gallery = document.getElementById("gallery")
        let galleryCarousel = document.getElementById("gallery-carousel")
        let inner = galleryCarousel.querySelector("div")
        // let inner = projectsCarousel.querySelector("div")
        let res = await fetch("/manifest.json")
        if(res.ok){
            let manifest = await res.json()
            let images = manifest["images"]
            for(let i=0;i<images.length;i++){
                let item = document.createElement("div")
                item.classList.add("col-12")
                item.classList.add("col-sm-6")
                item.classList.add("col-lg-3")
                let imageElm = document.createElement("img")
                imageElm.classList.add("w-100")
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
        }
    }
}