document.addEventListener('DOMContentLoaded', init);
function init() {
    //---------------------Metodo antiguo para consumir una api - (linea 2 - 32)------------------------------------
    /*const sfw = document.querySelector(".selectSFW");
    const nsfw = document.querySelector(".selectNSFW");
    
    const botonVerSFW = document.getElementById('botonVerSFW');
    const botonVerNSFW = document.getElementById('botonVerNSFW');
    
    //Como consumir API: https://www.youtube.com/watch?v=2Xm9P_tXtK8
    //URL de la API : https://api.waifu.pics
    const xhr = new XMLHttpRequest();
    
    function onRequestHandler(){
        if(this.readyState == 4 && this.status == 200){
            const data = JSON.parse(this.response);
            //Obtener valor de un Json: https://es.stackoverflow.com/questions/9478/c%C3%B3mo-puedo-leer-un-campo-espec%C3%ADfico-dentro-de-un-objeto-json-que-se-encuentra-e
            //console.log(data['url']);
            document.getElementById("campoImage").src = data['url']; 
            document.getElementById("campoLink").href = data['url']; 
        }
    }
    function mostrarImageSFW(){
        xhr.addEventListener("load", onRequestHandler);
        xhr.open("GET", 'https://api.waifu.pics/sfw/'+sfw.value);
        xhr.send();
    }
    function mostrarImageNSFW(){   
        xhr.addEventListener("load", onRequestHandler);
        xhr.open("GET", 'https://api.waifu.pics/nsfw/'+nsfw.value);
        xhr.send();
    }
    botonVerSFW.addEventListener('click', mostrarImageSFW);
    botonVerNSFW.addEventListener('click', mostrarImageNSFW);*/

    //---------------------Metodo con async y fetch para consumir una api - (linea 36 - 69)------------------------------------

    /** Categoria*/
    const sfw = document.querySelector("#selectSFW");
    const nsfw = document.querySelector("#selectNSFW");

    /** Botones para mostrar la imagen */
    const botonVerSFW = document.querySelector('#botonVerSFW');
    const botonVerNSFW = document.querySelector('#botonVerNSFW');

    /**Imagen */
    const image = document.querySelector("#campoImage");

    const btnLink = document.querySelector("#btn-link");
    const btnFavorite = document.querySelector("#btn-favorite");
    const iconFavorite = btnFavorite.firstChild;

    //botonVerSFW.addEventListener('click', cargarLink(sfw.value)); ERROR: Hacerlo de esta manera, ejecuta la funcion cargarlink() sin presionar el boton 
    botonVerSFW.addEventListener('click', function(e) {
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
        if(iconFavorite.classList.contains("fa-regular")){
            iconFavorite.classList.remove("fa-regular");
            iconFavorite.classList.add("fa-solid")
            

        }else{
            iconFavorite.classList.remove("fa-solid");
            iconFavorite.classList.add("fa-regular")
        }
    })

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
                
                //Esperamos que la imagen este completamente cargada paro mostrar el boton de descarga 
                image.onload = function () {
                    document.querySelector("#container-tools").classList.add("visible-tools");
                }
                
                
                btnLink.setAttribute("href",urlImage);

                iconFavorite.classList.remove("fa-solid");
                iconFavorite.classList.add("fa-regular")


            }

        } catch (error) {
            console.log(error);
        }

    }
    


    /**Mostraremos la lista de categorias de acuerdo al tipo de elija*/
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