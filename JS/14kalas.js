class Casa{
    constructor(){
        this.reservada = false;
    }
}

const casaEnAlquiler = new Casa();

class Inquilino{
    constructor(nombre, apellido, edad, dni, telefono, esTitular){
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = parseInt(edad);
        this.dni = parseInt(dni);
        this.telefono = parseInt(telefono);
        this.esTitular = esTitular;
    }
    reservar(){
        casaEnAlquiler.reservada = true;
    }
    cancelarReserva(){
        casaEnAlquiler.reservada = false;
    }
}

const proximosInquilinos = [];

let miFormulario = $("#formulario");
$("#formulario").on("submit", validacionFormulario);


function validacionFormulario(e){
    e.preventDefault();
    let nombre = $("#nombre").val();
    let apellido = $("#apellido").val();
    let edad = $("#edad").val();
    let dni = $("#dni").val();
    let telefono = $("#telefono").val();
    
    let esTitular = $("#esTitular").val();
    
    if ($("#esTitular").is(":checked")){
        esTitular = true;
    } else{
        esTitular = false;
    }
    
    proximosInquilinos.push(new Inquilino(nombre, apellido, edad, dni, telefono, esTitular));
    
    localStorage.setItem('inquilinos', JSON.stringify(proximosInquilinos));

    miFormulario.trigger("reset");
    

}

//Recuperando datos del localStorage

function recuperar() {
    let listadoInquilinosParse = JSON.parse(localStorage.getItem('inquilinos'));

    console.log(listadoInquilinosParse);
    if(listadoInquilinosParse){
        if(listadoInquilinosParse.length > 0){

        listadoInquilinosParse.forEach(el => proximosInquilinos.push(el))
        casaReservada();
        listadoInquilinos();
        nombreTitular();
        menoresDeEdad();
        proximosInquilinosOrdenadoPorEdad();
    }
    }
    

}

recuperar()


console.log(proximosInquilinos);

// Definición de algunas funciones de consulta

function casaReservada(){
    if(proximosInquilinos != []){
        casaEnAlquiler.reservada = true;
    } else{
        casaEnAlquiler.reservada = false;
    }
    console.log("¿La casa está reservada? " + casaEnAlquiler.reservada);
}

function listadoInquilinos(){
        let listadoInquilinos = [];
        for(const inquilino of proximosInquilinos){
        listadoInquilinos.push(` ${inquilino.nombre} ${inquilino.apellido}`);
    }
        console.log("Listado de inquilinos:" + listadoInquilinos);
}


function nombreTitular(){
    const titularReserva = (proximosInquilinos.find(inquilino => inquilino.esTitular===true));
    console.log(titularReserva);
    console.log(`El titular de la reserva es ${titularReserva.nombre} ${titularReserva.apellido}`);
}


function menoresDeEdad(){
    const listaMenores = proximosInquilinos.filter(inquilino => inquilino.edad<18);
    if(listaMenores != "" ){
    console.log("Los menores de la reserva son: ")
    for(let menores of listaMenores){
            console.log(`- ${menores.nombre} ${menores.apellido} (${menores.edad} años)`)}
    } else {
        console.log("En esta reserva no hay menores de edad")
    }
}


function proximosInquilinosOrdenadoPorEdad(){
    let proximosInquilinosOrdenado =
        proximosInquilinos.sort(function (a,b){
            if(a.edad > b.edad){
                return 1
            }
            if(a.edad < b.edad){
                return -1
            }
            return 0;
        });
    console.log("Listado de inquilinos ordenados por edad: ")
    for(const inquilino of proximosInquilinosOrdenado){
        console.log(`${inquilino.nombre} ${inquilino.apellido} (${inquilino.edad} años)`);
    }
}

//Generación de elementos en el DOM y aplicación de funcionalidad al botón eliminar

let divInquilinos = $("#divInquilinos");
let botonInquilinos = $("#botonInquilinos")


    botonInquilinos.on('click', function(){
    if(divInquilinos.children().length == 0) {
    proximosInquilinos.forEach((inquilino, indice) =>{
        console.log(proximosInquilinos);
        $("#divInquilinos").append(
            `<div class="card text-black bg-secondary mb-3" id="inquilino${indice}"
                <div class="card-body" id="cardBody">
                    <h5 class="card-title">${inquilino.nombre} ${inquilino.apellido}</h5>
                    <p class="card-text">Edad: ${inquilino.edad} años</p>
                    <p class="card-text">DNI: ${inquilino.dni}</p>
                    <p class="card-text">Teléfono: ${inquilino.telefono}</p>
                    <button class="btn btn-danger" id="boto${indice}">Borrar</button>
                </div>
            </div>`
        );        
                $(`#boto${indice}`).on('click', () => {


                $(`#inquilino${indice}`).remove()
                proximosInquilinos.splice(indice, 1)
                localStorage.setItem('inquilinos', JSON.stringify(proximosInquilinos))
            
                Toastify({
                    text: `❌ El inquilino ${inquilino.nombre} ${inquilino.apellido} ha sido eliminado`,
                    className: "inquilinoEliminado",
                    style: {
                    background: "red",
                    }
                }).showToast();

            })       
        })
        
    } else {
        parrafoError.innerText = "El listado de inquilinos ya se encuentra actualizado"
    }
    })



let botonIngresarInquilino =$("#ingresarInquilino")

$("#ingresarInquilino").on('click', () =>{
    Toastify({
        text: "🙋¡Inquilino ingresado con éxito!",
        className: "inquilinoExitoso",
        style: {
        background: "green",
        }
    }).showToast();
})


// animaciones

$("h1").prepend(`
    <img id="logo" src="./img/logo.jpg" alt="logo">
`)

$("#logo").css("width", "100px")
        .slideUp(1200)
        .delay(500)
        .slideDown(1200)

$("#botonInquilinos").click(() => {
    let div = $("div");
    div.animate({opacity: '0.4'}, "slow");
    div.animate({opacity: '1'}, "slow");
})


//disponibilidad


let formDisponibilidad = $("#formDisponibilidad")
$("#formDisponibilidad").on("submit", validacionForm);

function validacionForm(e){
    e.preventDefault();

    let entrada = $("#fecha_entrada").val()
    let entradaLocalDate= entrada.split("-").reverse().join("-")
    let salida = $("#fecha_salida").val()
    let salidaLocalDate= salida.split("-").reverse().join("-")
    let reservadaHasta = "2022-02-01"

    if(entrada){
            if(entrada < reservadaHasta){
                $("#mensaje").append(
                    `<p> La casa no se encuentra disponible para reservas durante el ${entradaLocalDate} y el ${salidaLocalDate}, por favor ingresá otra fecha. </p>
                    <a href="index.html">
                        <button id="volverAIntentarlo"> Volver a intentarlo </button>
                    </a>
                    `)
                
                $("#h2Disponibilidad").hide();
                $("#formDisponibilidad").hide();


        } else{
            $("#mensaje").append(
                `<p> ¡Tenemos disponibilidad en la fecha seleccionada!🎉 </p>
                <p> Te invitamos a leer los pasos a continuación para realizar la reserva </p>
                <button id="continuar"> Continuar </button>
                `
            )

            $("#h2Disponibilidad").fadeOut("slow");
            $("#formDisponibilidad").fadeOut("slow");

            $('#continuar').on("click", () =>{
                $("#form").fadeIn("slow");
                $("#inquilinosCargados").fadeIn("slow");
                $("#sectionFinalizar").fadeIn("slow");
                $("#mensaje").hide();

                $("#pasos").prepend(
                    `
                    <div id="fechaSeleccionada" class="fechaSeleccionada">
                        <h5>Fecha seleccionada:</h5>
                        <h6>Desde: ${entradaLocalDate}</h6>
                        <h6>Hasta: ${salidaLocalDate}</h6>
                    </div>
                    `
                )
            })
        }

    } else {
        $("#mensaje").append(
            `<br>
            <p> Por favor, ingresá una fecha válida.</p>
            <a href="index.html">
                <button id="volverAIntentarlo"> Volver a intentarlo </button>
            </a>
            `
        )

        $("#h2Disponibilidad").hide();
        $("#formDisponibilidad").hide();
        $("#botonDisponbilidad").hide();

    }

formDisponibilidad.trigger("reset");
}

// botón dark mode

let darkMode;

if(localStorage.getItem('darkMode')) {
    darkMode = localStorage.getItem('darkMode');
} else{
    darkMode = "light";
}

localStorage.setItem('darkMode', darkMode)

$(()=>{
    if(localStorage.getItem('darkMode') == "dark"){
        $("header").addClass("darkMode")
        $("body").addClass("darkMode")
        $("#btnDarkMode").hide();
        $("#btnLightMode").show();
    } else {
        $("#btnLightMode").hide();
    }

    $("#btnDarkMode").click(()=>{
        $("#btnDarkMode").hide();
        $("#btnLightMode").show();
        $("header").addClass("darkMode")
        $("body").addClass("darkMode")
        localStorage.setItem('darkMode', "dark")
    })

    $("#btnLightMode").click(()=>{
        $("#btnDarkMode").show();
        $("#btnLightMode").hide();
        $("header").removeClass("darkMode")
        $("body").removeClass("darkMode")
        localStorage.setItem('darkMode', "light")
        
    })

})


//Finalizar - AJAX

$("#sectionFinalizar").on('click', (e) => {
    if(proximosInquilinos.length == 0){
        e.preventDefault();
        $("#sectionFinalizar").append(
            `
            <p id="alerta"> Debés ingresar al menos un inquilino </p>
            `)
    }

    else{
        $('#buttonFinalizar').on('click', () =>{
            $.post("https://jsonplaceholder.typicode.com/posts", JSON.stringify(proximosInquilinos), function(data, estado) {
                console.log(data, estado);
        
                if(estado === "success"){
                    $("#divFinalizar").append( `
                    <section>
                        <h3>🎉 ¡Reserva exitosa! 🎉</h3>
                        <br> <br>
                        <p class="p1 finalizar">A la brevedad nos pondremos en contacto para coordinar la seña y confirmar la reserva.</p>
                        <input type="button" class="btn-volver" value="Volver" onclick="location.reload()"/>
                        </section>
                    `)
        
                    $("#sectionDisponibilidad").hide("slow");
                    $("#form").hide("slow");
                    $("#inquilinosCargados").hide("slow");
                    $("#buttonFinalizar").hide("slow");
                    $("#alerta").hide("slow");
        
                    localStorage.removeItem('inquilinos');
                    
                }
        
            })
        })
        
        $('#buttonVolver').on('click', () =>{
            location.reload();
        })
    }
})




