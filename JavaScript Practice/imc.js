// function calcularImc(altura, peso) {
//     return peso/(altura**2);
// }

// let imc = calcularImc(1.7, 50);
// console.log(imc.toFixed(2)); //toFixed(2) para que sean 2 decimales nomás.


//ARROW FUNCTION: //NO TIENE GRACIA HECHA ASI IGUAL, ES LO MISMO QUE UNA FUNCION BASICAMENTE
// let imcc = (altura, peso) => peso/(altura**2);
// console.log(imcc(1.7, 50).toFixed(2));


//ANONIMA: //NO TIENE GRACIA HECHA ASI IGUAL, ES LO MISMO QUE UNA FUNCION BASICAMENTE
let imccc = function (altura, peso) {
    return peso/(altura**2)
}
console.log(imccc(1.7, 50).toFixed(2));

var prompt = require('prompt-sync')();
var n1 = prompt('Ingresa un valor ');
var n2 = prompt('Ingresa otro valor ');
console.log(imccc(n1, n2).toFixed(2));