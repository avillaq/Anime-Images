document.addEventListener('DOMContentLoaded', init);
function init() {

    //--------------------- Fetch para consumir una api ------------------------------------

    /** Categoria*/
    const sfw = document.querySelector("#selectSFW");
    const nsfw = document.querySelector("#selectNSFW");

    /** Botones para mostrar la imagen */
    const botonVerSFW = document.querySelector('#botonVerSFW');
    const botonVerNSFW = document.querySelector('#botonVerNSFW');

    /**Imagen */
    const image = document.querySelector("#campoImage");

    /**Iconos de contactos */
    const btnLink = document.querySelector("#btn-link");
    const btnFavorite = document.querySelector("#btn-favorite");
    const iconFavorite = btnFavorite.firstChild;

    botonVerSFW.addEventListener('click', function(e) {
        /**Si no estas conectado a internet, muestra un mensaje */
        if(!navigator.onLine){
            Swal.fire({
                icon: 'warning',
                title: 'No Internet Connection',
                background:"#485761",
                color: '#fff',
                showConfirmButton: false
              })
        }else{
            e.preventDefault();
            cargarLink('sfw', sfw.value)
        }
    });
    botonVerNSFW.addEventListener('click', function(e) {
        /**Si no estas conectado a internet, muestra un mensaje */
        if(!navigator.onLine){
            Swal.fire({
                icon: 'warning',
                title: 'No Internet Connection',
                background:"#485761",
                color: '#fff',
                showConfirmButton: false
              })
        }else{
            e.preventDefault();
            cargarLink('nsfw', nsfw.value)
        }
    });

    btnFavorite.addEventListener("click", function(e) {
        e.preventDefault();
        /**Intercalamos entre corazon sin relleno y relleno, para el boton de favorito (corazon) */
        if(iconFavorite.classList.contains("fa-regular")){
            iconFavorite.classList.remove("fa-regular");
            iconFavorite.classList.add("fa-solid")
        }else{
            iconFavorite.classList.remove("fa-solid");
            iconFavorite.classList.add("fa-regular")
        }
    })

    /*Evento para mostrar mensaje de con informacion del proyecto */
    document.getElementById("btn-about").addEventListener("click", function () {
        Swal.fire({
            html: `<div class="container-footer" id="container-footer">
            <div class="container-about">
                <h3>Sobre el Proyecto</h3>    
                <p>¡Bienvenidos a mi proyecto! Aqui podrás disfrutar de imágenes de anime aleatorias obtenidas de una API .Este proyecto fue una gran oportunidad para aplicar mis conocimientos en programación, y espero que disfrutes  este sitio tanto como yo disfruté creándolo.</p>
            </div>
            <div class="container-media">
                <a target="_blank" href="https://github.com/avillaq" class="btn-media"><i class="fa-brands fa-github"></i></a>
                <a target="_blank" href="https://www.facebook.com/profile.php?id=100008164993137" class="btn-media"><i class="fa-brands fa-facebook"></i></a>
                <a target="_blank" href="mailto:villafuertequispealex@gmail.com" class="btn-media"><i class="fa-brands fa-google-plus"></i></a>
            </div>
            <div class="container-copyright">
                <small>&copy;2023 <span>Alexander</span> - All Rights Reserved</small>
            </div>
        </div>`,
        background:"#485761",
        showConfirmButton: false
        })

    });

    //Referencia : https://www.youtube.com/watch?v=PNr8-JDMinU
    const cargarLink = async (type, tag) => {
        try {
            //Ocultamos la imagen de bienvenida
            document.querySelector("#img-welcome").style.display="none";

            const respuesta = await fetch('https://api.waifu.pics/' + type + '/' + tag);
            //console.log(respuesta);

            if (respuesta.status === 200) {
                const datos = await respuesta.json();
                const urlImage = datos.url;
                
                //Añadimos la url a la imagen y se empieza a cargar
                image.src = urlImage;
                
                //Esperamos que la imagen este completamente cargada para mostrar los botones de : link, favorito, Acerca de... 
                image.onload = function () {
                    document.querySelector("#container-tools").classList.add("visible-tools");
                }
                
                /** Añadimos la url de la imagen al boton de link */
                btnLink.setAttribute("href",urlImage);

                /**Si el boton de favorito fue rellenada, con esto nos aseguramos que la siguiente imagen no tenga relleno*/
                iconFavorite.classList.remove("fa-solid");
                iconFavorite.classList.add("fa-regular")
            }

        } catch (error) {
            console.log(error);
        }

    }

    /**Mostraremos la lista de categorias de acuerdo al tipo (sfw o nsfw) de elija*/
    const typeSFW = document.querySelector("#typeSFW");
    const typeNSFW = document.querySelector("#typeNSFW");
    const container_sfw = document.querySelector("#container-sfw");
    const container_nsfw = document.querySelector("#container-nsfw");

    typeSFW.addEventListener('click', function(e){
       
        if(!typeSFW.classList.contains("selected")){
            typeSFW.classList.add("selected");
            typeNSFW.classList.remove("selected");

            container_sfw.classList.add("visible");
            container_nsfw.classList.remove("visible");
        }
    })
    typeNSFW.addEventListener('click', function(e){
        if(!typeNSFW.classList.contains("selected")){
            typeNSFW.classList.add("selected");
            typeSFW.classList.remove("selected");

            container_nsfw.classList.add("visible");
            container_sfw.classList.remove("visible");
        }
    })
}