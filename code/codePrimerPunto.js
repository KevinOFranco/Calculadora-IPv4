//Captura de elementos en el HTML.
const primerOctante = document.getElementById('primerOctante');
const segundoOctante = document.getElementById('segundoOctante');
const tercerOctante = document.getElementById('tercerOctante');
const cuartoOctante = document.getElementById('cuartoOctante');
const mascaraSubred = document.getElementById('mascaraSubred');
const divPunto = document.getElementById('punto');

//Valores constantes.
const TAMANIO_DIRECCION = 32;
const DIRECCIONES_RESERVADAS = 2;

//Funciones de acción para los elementos del HTML.
function calcularResultado() {
    if(validarIp(primerOctante.value, segundoOctante.value, tercerOctante.value, cuartoOctante.value, mascaraSubred.value)) {
        let mascaraDecimal = obtenerDireccionMascara(document.getElementById('mascaraSubred').value);
        document.getElementById('mascaraRespuesta').innerHTML = mascaraDecimal;

        let direccionRed = calcularDireccionRed(primerOctante.value, segundoOctante.value, tercerOctante.value, cuartoOctante.value, mascaraSubred.value);
        let direccionBroadcast = calcularDireccionBroadcast(direccionRed, mascaraSubred.value);
        document.getElementById('broadcastRespuesta').innerHTML = direccionBroadcast;

        document.getElementById('bitsRedRespuesta').innerHTML = calcularBitsRed(mascaraSubred.value);

        let bitsHost = calcularBitsHost(mascaraSubred.value);
        document.getElementById('bitsHostRespuesta').innerHTML = bitsHost;

        let totalDireccionesHost = calcularTotalDireccionesHost(mascaraSubred.value);
        document.getElementById('direccionesHostRespuesta').innerHTML = totalDireccionesHost;

        //Llenando la tabla.
        document.getElementById('direccionRedTabla').innerHTML = direccionRed;
        document.getElementById('direccionBroadcastTabla').innerHTML = direccionBroadcast;
        if(parseInt(mascaraSubred.value, 10) < 31) {
            document.getElementById('direccionHostInicioTabla').innerHTML = calcularDireccionHostEnPosicion(1, direccionRed); //Encuentra la dirección del primer host.
            document.getElementById('direccionHostFinTabla').innerHTML = calcularDireccionHostEnPosicion(totalDireccionesHost, direccionRed); //Encuentra la dirección del último host.

            llenarListadoDirecciones(direccionRed, totalDireccionesHost);
        } else {
            document.getElementById('listadoDirecciones').innerHTML = ''; //Limpia la lista de cualquier valor previo calculado.
            document.getElementById('direccionHostInicioTabla').innerHTML = "No disponible"; //En una máscara de subred de 31 bits sólo se pueden establecer dos direcciones: red y broadcast.
            document.getElementById('direccionHostFinTabla').innerHTML = "No disponible"; //En una máscara de subred de 31 bits sólo se pueden establecer dos direcciones: red y broadcast.
        }

    } else {
        alert(`La IP o máscara de red ingresada no es correcta, por favor revisala e intenta de nuevo.\nNOTA: el tamaño de la máscara debe estar entre 1 y 31 y, en la red, cada octeto entre 0 y 255.`);
    }
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

        item.appendChild(document.createTextNode(calcularDireccionHostEnPosicion(i, direccionIp)));

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
//================Fin funciones comunes=====================
