function suma(a,b){ 
    if (typeof a === 'number' && typeof b === 'number') { //PODÍA USAR isNaN()
        let resultadoSuma = a+b;
        console.log("resultadoSuma = ", resultadoSuma);
        return resultadoSuma; 
    } else {
        console.log("No se pudo ejecutar la suma porque los parámetros no son números.");
    }
}

//ANONIMA 
// let resultSuma = function (a,b) {
//     return a+b;
// }
// console.log(resultSuma(8,1));

//ARROW function 
// let resultSuma = (a,b) => a+b;
// console.log(resultSuma(8,8));

function resta(a,b){ 
    if (typeof a === 'number' && typeof b === 'number') {
        let resultadoResta = a-b;
        console.log("resultadoResta = ", resultadoResta);
        return resultadoResta; 
    } else {
        console.log("No se pudo ejecutar la resta porque los parámetros no son números.");
    }
}

function multiplicacion(a,b){ 
    if (typeof a === 'number' && typeof b === 'number') {
        let resultadoMultiplicacion = a*b;
        console.log("resultadoMultiplicacion = ", resultadoMultiplicacion);
        return resultadoMultiplicacion; 
    } else {
        console.log("No se pudo ejecutar la multiplicación porque los parámetros no son números.");
    }
}

function division(a,b){ 
    if (typeof a === 'number' && typeof b === 'number') {
        if(b != 0){
            let resultadoDivision = a/b;
            console.log("resultadoDivision = ", resultadoDivision);
            return resultadoDivision;
        } else {
            console.log("No se pudo ejecutar la división porque el divisor es 0.");    
        }
    } else {
        console.log("No se pudo ejecutar la división porque los parámetros no son números.");
    }
}

// let resultadoSuma = suma(5,2);
// let resultadoResta = resta(5,2);
// let resultadoMultiplicacion = multiplicacion(5,2);
// let resultadoDivision = division(5,2);

function calcular(operando1, operando2, op) {
    return op(operando1, operando2);
}

//let resultado = calcular(5,2,suma);


function calcularConSwitch(operando1, operando2, op) {
    switch(op){
        case "suma":
            return suma(operando1, operando2);
            break;
        case "resta":
            return resta(operando1, operando2);
            break;
        case "multiplicación":
            return multiplicacion(operando1, operando2);
            break;
        case "division":
            return division(operando1, operando2);
            break;
        default:
            console.log("la operación ingresada no es válida"); 
    }
}

let resultadoConSwitch = calcularConSwitch(5,1,"division"); //puedo agregar null, undefined.
