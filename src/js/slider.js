import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import { FreeMode } from "swiper/modules";

document.addEventListener("DOMContentLoaded", function (){
    if (document.querySelector('.slider')) {
        const opciones = {
             slidesPerView: 1,
             spaceBetween: 15,
             FreeMode: true,
             navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 30
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 40
                }
             }
            }
            Swiper.use([Navigation, FreeMode]);
            new Swiper('.slider', opciones)
        
    }
});