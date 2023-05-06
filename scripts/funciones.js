function random(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(random(min, max + 1));
}

function getIndexArrayMaxValue(array) {
    return array.indexOf(Math.max(...array));
}

function getMejorRedCocheGuardado(capas) {
    capas = capas["capas"];

    const redGuardada = new RedNeuronal();

    for (let i = 0; i < capas.length; i++) {
        const neuronas = capas[i]["neuronas"];
        const capa = new Capa(neuronas.length, FuncionesDeActivacion.lineal);
        capa.neuronas = [];
        for (let j = 0; j < neuronas.length; j++) {
            const neurona = new Neurona();
            neurona.pesos = neuronas[j].pesos;
            neurona.sesgo = neuronas[j].sesgo;
            capa.neuronas.push(neurona);
        }
        redGuardada.capas.push(capa);
    }
    return redGuardada;

}