//Captura de elementos en el HTML.
const primerOctante = document.getElementById('primerOctante');
const segundoOctante = document.getElementById('segundoOctante');
const tercerOctante = document.getElementById('tercerOctante');
const cuartoOctante = document.getElementById('cuartoOctante');
const mascaraSubred = document.getElementById('mascaraSubred');
const bitsSubred = document.getElementById("bitsMascaraSubred");
const divPunto = document.getElementById('punto');
let arraySubredes = [];
let arrayHostsSubred = [];
//
const validarMascaraSubred = () => {
    let direccion = convertirADecimal(primerOctante, segundoOctante, tercerOctante, cuartoOctante)
    let direccionBinaria = obtenerDireccionBinDeDecimal(direccion)
    let arrayDireccion = direccionBinaria.split("1")

    let mascaraDecimal = obtenerDireccionMascara(document.getElementById('mascaraSubred').value)
    let mascaraBinaria = obtenerDireccionBinDeDecimal(mascaraDecimal)
    let arrayMascara = mascaraBinaria.split("1")
    let sout = arrayDireccion[arrayDireccion.length - 1].length >=  arrayMascara[arrayMascara.length - 1].length;

    return sout;
}



//Valores constantes.
const TAMANIO_DIRECCION = 32;
const DIRECCIONES_RESERVADAS = 2;

//Funciones de acción para los elementos del HTML.
function calcularResultado() {
    if(validarIp(primerOctante.value, segundoOctante.value, tercerOctante.value, cuartoOctante.value, mascaraSubred.value) && (parseInt(mascaraSubred.value) + parseInt(bitsSubred.value)) <= 31) {
        
        if(validarMascaraSubred()) {
        
            var direccionRed = calcularDireccionRed(primerOctante.value, segundoOctante.value, tercerOctante.value, cuartoOctante.value, mascaraSubred.value);
            document.getElementById('ipRedRespuesta').innerHTML = direccionRed;

            let direccionBroadcast = calcularDireccionBroadcast(direccionRed, mascaraSubred.value);
            document.getElementById('broadcastRespuesta').innerHTML = direccionBroadcast;

            let totalDireccionesHost = calcularTotalDireccionesHost(mascaraSubred.value);

            document.getElementById("cantidadSubredesRespuesta").innerHTML = 2**parseInt(bitsSubred.value) - 2;

            document.getElementById("cantidadHostSubredRespuesta").innerHTML = obtenerCantidadHostSubred();
            //Llenando la tabla.
            document.getElementById('direccionRedTabla').innerHTML = direccionRed;
            document.getElementById('direccionBroadcastTabla').innerHTML = direccionBroadcast;
            
            arraySubredes = obtenerSubredes();
            mostrarDatosSubredes(arraySubredes, obtenerCantidadHostSubred());
            
            let list = document.getElementById("idDatalistSubredes");
            let listPosicion = document.getElementById("idDatalistSubredesPosicion");
            let listCantidadHosts = document.getElementById("idDatalistSubredesCantidadHosts");
            listCantidadHosts.innerHTML = "";
            list.innerHTML = "";
            listPosicion.innerHTML = "";
            for (let index = 0; index < arraySubredes.length; index++) {
                list.innerHTML += `<option value="${arraySubredes[index]}">  </option>`;
                listPosicion.innerHTML += `<option value="${index + 1}">  </option>`;
                listCantidadHosts.innerHTML += `<option value="${arraySubredes[index]}">  </option>`;
            }

            

            if(parseInt(mascaraSubred.value, 10) < 31) {
                document.getElementById('direccionHostInicioTabla').innerHTML = calcularDireccionHostEnPosicion(1, direccionRed); //Encuentra la dirección del primer host.
                document.getElementById('direccionHostFinTabla').innerHTML = calcularDireccionHostEnPosicion(totalDireccionesHost, direccionRed); //Encuentra la dirección del último host.

                
            } else {
                document.getElementById('listadoDirecciones').innerHTML = ''; //Limpia la lista de cualquier valor previo calculado.
                document.getElementById('direccionHostInicioTabla').innerHTML = "No disponible"; //En una máscara de subred de 31 bits sólo se pueden establecer dos direcciones: red y broadcast.
                document.getElementById('direccionHostFinTabla').innerHTML = "No disponible"; //En una máscara de subred de 31 bits sólo se pueden establecer dos direcciones: red y broadcast.
            }
        } else {
            alert(`La máscara de red no es válida para la IP ingresada, por favor revisala e intenta de nuevo.`);
        }

    } else {
        alert(`La IP o máscara de red ingresada no es correcta, por favor revisala e intenta de nuevo.\nNOTA: el tamaño de la máscara y los bits para red no pueden exceder 31 bits y, en la red cada octeto entre 0 y 255.`);
    }
}

function calcularDireccionesHostsCantidad(){
    let direccion = document.getElementById("idSubredesCantidadHosts");
    let cantidadHosts = document.getElementById("idCantidadHosts");
    let hosts = document.getElementById("idCantidadHostsRespuesta");
    hosts.innerHTML = "";

    let subred = direccion.value;
    let cantidad = parseInt(cantidadHosts.value, 10);
    let maximoPermitido = 2**(32 - parseInt(mascaraSubred.value) - parseInt(bitsSubred.value)) - 2;

    if (cantidad >= 0 && cantidad <= maximoPermitido){
        for (let index = 1; index <= cantidad; index++) {
            let host = calcularDireccionHostEnPosicion(index, subred)
            hosts.innerHTML += host + " - ";
        }
    }
    else { 
        alert("La cantidad de hosts supera la cantidad máxima de direcciones." ); 
    }
    
}

function calcularHostSubredEspecifica(){
    let hostEspecifico = document.getElementById("idSubredHostPosicion");
    let host = parseInt(hostEspecifico.value);
    document.getElementById('ipHostRespuesta').innerHTML = arrayHostsSubred[host - 1];
}

function mostrarDatosHostSubred(){
    let listHosts = document.getElementById("idDatalistHostPosicion");
    listHosts.innerHTML = "";
    for (let index = 0; index < arrayHostsSubred.length; index++) {
        listHosts.innerHTML += `<option value="${index + 1}">  </option>`;
    }
}

function calcularDireccionSubredHost (){
    let direccion = document.getElementById("ipHostASubred");
    let ip = direccion.value;
    ip = ip.split(".");
    let mascaraAdaptada = parseInt(mascaraSubred.value, 10) + parseInt(bitsSubred.value, 10);
    
    let direccionSubred = calcularDireccionRed(ip[0], ip[1], ip[2], ip[3], mascaraAdaptada);

    let respuestaSubred = document.getElementById("ipHostASubredRespuesta");
    respuestaSubred.innerHTML = direccionSubred;
}

function determinarMismaSubred(){
    let direccionIp1 = document.getElementById("ipHostPrimeraComparar");
    let direccionIp2 = document.getElementById("ipHostSegundaComparar");
    let ip1 = direccionIp1.value;
    let ip2 = direccionIp2.value;

    ip1= ip1.split(".");
    ip2 = ip2.split(".");

    let mascaraAdaptada = parseInt(mascaraSubred.value, 10) + parseInt(bitsSubred.value, 10);
    let direccionSubred1 = calcularDireccionRed(ip1[0], ip1[1], ip1[2], ip1[3], mascaraAdaptada);
    let direccionSubred2 = calcularDireccionRed(ip2[0], ip2[1], ip2[2], ip2[3], mascaraAdaptada);

    let desicion = document.getElementById("ipHostComparar");
    if (direccionSubred1 === direccionSubred2){
        desicion.innerHTML = "La Subred coincide: " + direccionSubred1;
    }
    else{
        desicion.innerHTML = "La Subred No coincide: " + direccionSubred1 + " : " + direccionSubred2;
    }
}

function mostrarDatosSubredes (arraySubredes, cantidadMaxima){
    let direccionMinima;
    let direccionMaxima;
    let broadcast;
    let table = document.getElementById("idTablaSubredes");
    inicializarTablaSubredes();
    for (let index = 0; index < arraySubredes.length; index++) {
        broadcast = calcularDireccionHostEnPosicion(cantidadMaxima + 1, arraySubredes[index]);
        direccionMinima = calcularDireccionHostEnPosicion(1, arraySubredes[index]);
        direccionMaxima = calcularDireccionHostEnPosicion(cantidadMaxima, arraySubredes[index]);
        agregarSubredTabla (arraySubredes[index], direccionMinima, direccionMaxima, broadcast);
    }
}

function calcularSubredEspecifica(){
    let direccionSubred = document.getElementById("idSubredEspecifica");
    let cantidadMaxima = obtenerCantidadHostSubred();

    broadcast = calcularDireccionHostEnPosicion(cantidadMaxima + 1, direccionSubred.value);
    direccionMinima = calcularDireccionHostEnPosicion(1, direccionSubred.value);
    direccionMaxima = calcularDireccionHostEnPosicion(cantidadMaxima, direccionSubred.value);

    agregarSubredEspecificaTabla(direccionSubred.value, direccionMinima, direccionMaxima, broadcast);
}

function calcularSubredEspecificaPosicion(){
    let idPosicion = document.getElementById("idSubredEspecificaPosicion");
    let posicion = parseInt(idPosicion.value);
    let cantidadMaxima = obtenerCantidadHostSubred();

    broadcast = calcularDireccionHostEnPosicion(cantidadMaxima + 1, arraySubredes[posicion - 1]);
    direccionMinima = calcularDireccionHostEnPosicion(1, arraySubredes[posicion - 1]);
    direccionMaxima = calcularDireccionHostEnPosicion(cantidadMaxima, arraySubredes[posicion - 1]);

    llenarListadoDirecciones(arraySubredes[posicion - 1], cantidadMaxima);
    mostrarDatosHostSubred();
    agregarSubredEspecificaTablaPosicion(arraySubredes[posicion - 1], direccionMinima, direccionMaxima, broadcast);
}

const agregarSubredEspecificaTablaPosicion = (subred, minima, maxima, broadcast) => {
    let tabla = document.getElementById("rangoDireccionesSubredPosicion");

    let subredTabla = document.getElementById("direccionSubredTablaPosicion");
        subredTabla.innerHTML = subred;

        let broadcastTabla = document.getElementById("direccionBroadcastTablaSubredPosicion");
        broadcastTabla.innerHTML = broadcast;

        let direccionInicioTabla = document.getElementById("direccionHostInicioTablaSubredPosicion");
        direccionInicioTabla.innerHTML = minima;

        let direccionFinalTabla = document.getElementById("direccionHostFinTablaSubredPosicion");
        direccionFinalTabla.innerHTML = maxima;
}

const agregarSubredEspecificaTabla = (subred, minima, maxima, broadcast) => {
    let tabla = document.getElementById("rangoDireccionesSubred");

    let subredTabla = document.getElementById("direccionSubredTabla");
        subredTabla.innerHTML = subred;

        let broadcastTabla = document.getElementById("direccionBroadcastTablaSubred");
        broadcastTabla.innerHTML = broadcast;

        let direccionInicioTabla = document.getElementById("direccionHostInicioTablaSubred");
        direccionInicioTabla.innerHTML = minima;

        let direccionFinalTabla = document.getElementById("direccionHostFinTablaSubred");
        direccionFinalTabla.innerHTML = maxima;
}

const agregarSubredTabla = (subred, minima, maxima, broadcast) => {
        let table = document.getElementById("idTablaSubredes");
 
        let template = `
                <tr>
                    <td>${subred}</td>
                    <td>${minima}</td>
                    <td>${maxima}</td>
                    <td>${broadcast}</td>
                </tr>`;
        table.innerHTML += template;
}

const obtenerSubredes = () => {
    let y = parseInt(bitsSubred.value);
    let x = 32 - ( parseInt(mascaraSubred.value) + y );
    let cadena = obtenerByteDeDecimal(primerOctante.value)  + obtenerByteDeDecimal(segundoOctante.value) + obtenerByteDeDecimal(tercerOctante.value) + obtenerByteDeDecimal(cuartoOctante.value);
    let cadenaHosts = cadena.substring(cadena.length - x, cadena.length);
    let arraySubredes = [];
    let end = cadena.length - x - y;
    cadena = cadena.substring(0, end);
    for(let i = 1; i <= (2**y) - 2; i++){
        let bin = parseInt(i, 10).toString(2);
        bin = completarCerosBinario(bin, y);
        
        let binario = cadena;
        binario += bin + cadenaHosts;

        binario = separarDireccionBinEnOctetos(binario);
        binario = obtenerDireccionDecimalDeBin(binario);
	    arraySubredes.push(binario);
    }
	return arraySubredes;
}

const completarCerosBinario = (numeroBinario, tamanio) => {
    let cont = 0;
    let ceros = "";
    while (cont < tamanio - numeroBinario.length) {
        ceros += 0;
        cont++;
    }
    return ceros += numeroBinario;
}

const obtenerCantidadHostSubred = () => {
    let bitsSubredInt = parseInt(bitsSubred.value);
    let bitsMascaraSubredInt = parseInt(mascaraSubred.value);
    return 2**(32 - (bitsSubredInt + bitsMascaraSubredInt) ) - 2;
}

//Funciones de cálculo.
//==============Inicio calcular dirección de red===============
const calcularDireccionRed = (primerOctanteIp, segundoOctanteIp, tercerOctanteIp, cuartoOctanteIp, tamanioMascara) => {
    let ip = primerOctanteIp+"."+segundoOctanteIp+"."+tercerOctanteIp+"."+cuartoOctanteIp;
    ip = obtenerDireccionBinDeDecimal(ip);
 
    ip = ip.replace(/\./g, ''); //Remueve los puntos de la dirección binaria.
    ip = ip.substr(0, parseInt(tamanioMascara, 10)); //Recupera los bits fijos de la dirección.

    let bitsRestantes = TAMANIO_DIRECCION - parseInt(tamanioMascara, 10);
    for(let i = 0; i < bitsRestantes; i++) {
        ip += "0"; //Completa la dirección poniendo 0 en los bits restantes.
    }

    ip = separarDireccionBinEnOctetos(ip);
    ip = obtenerDireccionDecimalDeBin(ip);
 
    return ip;
}
//================Fin calcular dirección de red================

//==============Inicio calcular máscara de subred==============
const obtenerDireccionMascara = (tamanioMascara) => {
    let mascaraCadena = "";

    for(let indice = 0; indice < TAMANIO_DIRECCION; indice++) {
        if(indice != 0 && indice % 8 == 0)
            mascaraCadena += ".";

        if(indice < tamanioMascara) 
            mascaraCadena += "1";
        else
            mascaraCadena += "0";
    }

    mascaraCadena = obtenerDireccionDecimalDeBin(mascaraCadena);
    return mascaraCadena;
}
//==============Fin calcular máscara de subred==============

//===========Inicio calcular broadcast de la red============
const calcularDireccionBroadcast = (direccionRed, tamanioMascaraSubred) => {
    ipCadena = obtenerDireccionBinDeDecimal(direccionRed);

    let indice = parseInt(tamanioMascaraSubred, 10); //Asigna el total de bits de la máscara.
    indice += (indice - 1)/8; //Le suma los puntos (.) que hay hasta esa cantidad de bits. EJ: indice = 16 = 11111111.11111111.0.0 -> hasta el 16 hay 1 punto.

    for(indice; indice < ipCadena.length; indice++) {
        if(ipCadena.charAt(indice) != ".") {
            ipCadena = replaceAt(ipCadena, indice, "1");
        }
    }
    ipCadena = obtenerDireccionDecimalDeBin(ipCadena);

    return ipCadena;
}

function replaceAt(cadena, indice, valorNuevo) {
    if(typeof cadena === 'string' && (indice > 0 && indice < cadena.length)) {
        return ""+cadena.substr(0,indice) + valorNuevo + cadena.substr(indice + 1, cadena.length);
    } else {
        return cadena;
    }
}
//============Fin calcular broadcast de la red==============

//=============Inicio calcular bits de la red===============
const calcularBitsRed = (tamanioMascara) => {
    //El número de bits para identificar la red es el mismo que el tamaño de la máscara en formato simplificado.
    return tamanioMascara;
}
//==============Fin calcular bits de la red=================

//=============Inicio calcular bits de hosts================
const calcularBitsHost = (tamanioMascara) => {
    return 32 - parseInt(tamanioMascara, 10);
}
//===============Fin calcular bits de hosts=================

//=======Inicio calcular total direcciones para hosts=======
const calcularTotalDireccionesHost = (tamanioMascara) => {
    let bitsHost = 32 - parseInt(tamanioMascara, 10);
    return (2 ** bitsHost) - DIRECCIONES_RESERVADAS;
}
//=========Fin calcular total direcciones para hosts========

//=====Inicio calcular direccion de host en una posición====
const calcularDireccionHostEnPosicion = (posicion, direccionRed) => {
    let direccionBinAux = obtenerDireccionBinDeDecimal(direccionRed);
    direccionBinAux = direccionBinAux.replace(/\./g, '');  //Elimina los puntos que hay en la dirección IP binaria.

    let posicionBin = parseInt(posicion, 10).toString(2);

    direccionBinAux = direccionBinAux.substr(0, TAMANIO_DIRECCION - posicionBin.length);
    direccionBinAux = direccionBinAux + posicionBin;
    direccionBinAux = separarDireccionBinEnOctetos(direccionBinAux);

    return obtenerDireccionDecimalDeBin(direccionBinAux);
}
//======Fin calcular direccion de host en una posición======

//=====Inicio calcular direcciones de host disponibles======
const llenarListadoDirecciones = (direccionIp, totalDirecciones) => {
    document.getElementById('listadoDirecciones').innerHTML = '';

    for (let i = 1; i <= parseInt(totalDirecciones, 10) && i <= 1000; i++) {
        let item = document.createElement('li');
        arrayHostsSubred.push(calcularDireccionHostEnPosicion(i, direccionIp));
        item.appendChild(document.createTextNode(arrayHostsSubred[arrayHostsSubred.length - 1]));

        console.log(arrayHostsSubred[arrayHostsSubred.length - 1])
        document.querySelector('#listadoDirecciones').appendChild(item);
    }
}
//======Fin calcular direcciones de host disponibles========

//=============Inicio generar IP aleatoria==================
const generarIpAleatoria = () => {
    //Seteo los input de IP y máscara con valores aleatorios válidos.
    primerOctante.value = obtenerNumeroAleatorio(0, 256);
    segundoOctante.value = obtenerNumeroAleatorio(0, 256);
    tercerOctante.value = obtenerNumeroAleatorio(0, 256);
    cuartoOctante.value = obtenerNumeroAleatorio(0, 256);
    mascaraSubred.value = obtenerNumeroAleatorio(1, 32);

    calcularResultado();
}
//==============Fin generar IP aleatoria====================

//===============Inicio limpiar campos======================
const limpiarCampos = () => {
    document.getElementById('primerOctante').value = '';
    document.getElementById('segundoOctante').value = '';
    document.getElementById('tercerOctante').value = '';
    document.getElementById('cuartoOctante').value = '';
    document.getElementById('mascaraSubred').value = '';

    document.getElementById('mascaraRespuesta').innerHTML = '';
    document.getElementById('broadcastRespuesta').innerHTML = '';
    document.getElementById('bitsRedRespuesta').innerHTML = '';
    document.getElementById('bitsHostRespuesta').innerHTML = '';
    document.getElementById('direccionesHostRespuesta').innerHTML = '';

    document.getElementById('direccionRedTabla').innerHTML = '###.###.###';
    document.getElementById('direccionBroadcastTabla').innerHTML = '###.###.###';
    document.getElementById('direccionHostInicioTabla').innerHTML = '###.###.###';
    document.getElementById('direccionHostFinTabla').innerHTML = '###.###.###';

    document.getElementById('listadoDirecciones').innerHTML = '';
}
//=================Fin limpiar campos=======================
const convertirADecimal = (primerOctante, segundoOctante, tercerOctante, cuartoOctante)=>{ 
     return primerOctante.value + "." + segundoOctante.value + "." + tercerOctante.value + "." + cuartoOctante.value;
}
//===============Inicio funciones comunes===================
const validarIp = (primerOctanteIp, segundoOctanteIp, tercerOctanteIp, cuartoOctanteIp, tamanioMascara) => {
    primerOctanteIp = parseInt(primerOctanteIp, 10);
    segundoOctanteIp = parseInt(segundoOctanteIp, 10);
    tercerOctanteIp = parseInt(tercerOctanteIp, 10);
    cuartoOctanteIp = parseInt(cuartoOctanteIp, 10);
    tamanioMascara = parseInt(tamanioMascara, 10);

    return (primerOctanteIp >= 0 && primerOctanteIp <= 255) && (segundoOctanteIp >= 0 && segundoOctanteIp <= 255) 
        && (tercerOctanteIp >= 0 && tercerOctanteIp <= 255) && (cuartoOctanteIp >= 0 && cuartoOctanteIp <= 255)
        && (tamanioMascara >= 1 && tamanioMascara < 32);
}

const obtenerDireccionDecimalDeBin = (cadenaBin) => {
    let octantes = cadenaBin.split(".");

    return obtenerDecimalDeByte(octantes[0])+"."+obtenerDecimalDeByte(octantes[1])+"."+obtenerDecimalDeByte(octantes[2])+"."+obtenerDecimalDeByte(octantes[3]);
}

const obtenerDireccionBinDeDecimal = (cadenaDec) => {
    let octantes = cadenaDec.split(".");

    return obtenerByteDeDecimal(octantes[0])+"."+obtenerByteDeDecimal(octantes[1])+"."+obtenerByteDeDecimal(octantes[2])+"."+obtenerByteDeDecimal(octantes[3]);
}

const obtenerByteDeDecimal = (cadenaDec) => {
    //Concatena el binario del decimal con los 8 bits en cero y retorna la subcadena de 8 bits contando desde el final.
    return ("00000000" + parseInt(cadenaDec, 10).toString(2)).substr(-8);
}

const obtenerDecimalDeByte = (cadenaBin) => {
    return parseInt(cadenaBin, 2).toString(10);
}

const separarDireccionBinEnOctetos = (direccionBin) => {
    let direccionBinAux = "";

    for(let indice = 0; indice < direccionBin.length; indice++) {
        if(indice != 0 && indice % 8 === 0)
            direccionBinAux = direccionBinAux + ".";
            
        direccionBinAux += direccionBin.charAt(indice);
    }

    return direccionBinAux;
}

const obtenerNumeroAleatorio = (min, max) => {
    //Número entero en el intervalo [min, max)
    let numero = parseInt(Math.random() * (max - min) + min, 10);
    console.log("Numero aleatorio " + numero);
    return numero;
}

function inicializarTablaSubredes(){
    let table = document.getElementById("idTablaSubredes");
 
    table.innerHTML = `
            <tr>
            <th>Subred</th>
            <th>Direccion Minima</th>
            <th>Direccion Maxima</th>
            <th>Direccion De Broadcast</th>
            </tr>`;
}
//================Fin funciones comunes=====================
