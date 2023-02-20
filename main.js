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

    const sfw = document.querySelector("#selectSFW");
    const nsfw = document.querySelector("#selectNSFW");

    const botonVerSFW = document.getElementById('botonVerSFW');
    const botonVerNSFW = document.getElementById('botonVerNSFW');

    const btnDownload = document.querySelector("#btn-download");



    $btnDescargar = document.querySelector("#btnDescargar");
    //Referencia : https://www.youtube.com/watch?v=PNr8-JDMinU
    const cargarLink = async (type, tag) => {
        try {
            const respuesta = await fetch('https://api.waifu.pics/' + type + '/' + tag);
            //console.log(respuesta);

            if (respuesta.status === 200) {
                const datos = await respuesta.json();
                
                //Enlace a la imagen orignal
                document.getElementById("campoLink").href = datos.url;

                //Imagen
                document.getElementById("campoImage").src = datos.url;

                
                //Esperamos que la imagen este completamente cargada paro mostrar el boton de descarga 
                document.getElementById("campoImage").onload = function () {
                    document.querySelector("#container-download").classList.add("visible-download");
                }
                
                
                btnDownload.setAttribute("href",datos.url);
                btnDownload.setAttribute("download","imagen.png");

                
                console.log(datos.url);

            }

        } catch (error) {
            console.log(error);
        }

    }
    //botonVerSFW.addEventListener('click', cargarLink(sfw.value)); ERROR: Hacerlo de esta manera, ejecuta la funcion cargarlink() sin presionar el boton 
    botonVerSFW.addEventListener('click', () => {
        cargarLink('sfw', sfw.value)
    });
    botonVerNSFW.addEventListener('click', () => {
        cargarLink('nsfw', nsfw.value)
    });

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