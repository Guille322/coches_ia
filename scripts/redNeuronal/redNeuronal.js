class RedNeuronal {

    capas = [];

    tasaDeAprendizaje = 0.1;
    
    errorMaximoPermitido = 0.2;

    constructor() {

    }

    getNumCapas() {
        return this.capas.length; 
    }

    getCapa(index) {
        return this.capas[index];
    }

    addCapaSinModificaciones(capa) {
        this.capas.push(capa);
    }

    addCapa(capa) {
        this.addCapaSinModificaciones(capa);
        const num_capas = this.getNumCapas();
        if (num_capas === 1) {
            const num_neuronas = capa.getNumNeuronas();
            for (let i = 0; i < num_neuronas; i++) {
                capa.getNeurona(i).setSesgoNull();
            }
        }
        if (num_capas < 2) return;
        const capaPonerPesos = this.getCapa(num_capas - 2);
        const num_neuronas = capa.getNumNeuronas();
        const num_neuronas_capa_a_poner_pesos = capaPonerPesos.getNumNeuronas();
        let neurona = null;
        for (let i = 0; i < num_neuronas_capa_a_poner_pesos; i++) {
            neurona = capaPonerPesos.getNeurona(i);
            for (let j = 0; j < num_neuronas; j++) {
                neurona.addRandomPeso();
            }
        }
    }

    addCapas(...capas) {
        for (let i = 0; i < capas.length; i++) {
            this.addCapa(capas[i]);
        }
    }

    predict(...inputs) {
        if (Array.isArray(inputs)) {
            inputs = inputs[0];
        }
        const num_capas = this.getNumCapas() - 1;
        let resultadosCapaAnterior = inputs;
        for (let i = 0; i < num_capas; i++) {
            let capa = this.getCapa(i);
            let neuronasCapa = capa.getNumNeuronas();
            let siguienteCapa = this.getCapa(i + 1);
            let neuronasSiguienteCapa = siguienteCapa.getNumNeuronas();
            const auxResultados = [];
            for (let j = 0; j < neuronasSiguienteCapa; j++) {
                let suma = 0;
                //console.log("--------------------");
                for (let k = 0; k < neuronasCapa; k++) {
                    suma += resultadosCapaAnterior[k] * capa.getNeurona(k).getPeso(j);
                    //console.log(resultadosCapaAnterior[k] + " * " + capa.getNeurona(k).getPeso(j));
                }
                suma = siguienteCapa.getNeurona(j).getResultado(suma);
                //console.log("= " + suma);
                auxResultados.push(suma);
            }
            resultadosCapaAnterior = auxResultados;
        }
        return resultadosCapaAnterior;
    }

    getCopy() {
        const num_capas = this.getNumCapas();
        const newRedNeuronal = new RedNeuronal();
        for (let i = 0; i < num_capas; i++) {
            newRedNeuronal.addCapaSinModificaciones(this.getCapa(i).getCopy());
        }
        return newRedNeuronal;
    }

    cruzar(otraRedNeuronal) {
        const newRedNeuronal = this.getCopy();
        const num_capas = newRedNeuronal.getNumCapas();
        for (let i = 0; i < num_capas; i++) {
            const capa = newRedNeuronal.getCapa(i);
            const num_neuronas = capa.getNumNeuronas();
            for (let j = 0; j < num_neuronas; j++) {
                const neurona = capa.getNeurona(j);
                const otraRedNeuronal_Neurona = otraRedNeuronal.getCapa(i).getNeurona(j);
                if (i != num_capas - 1) {
                    const num_pesos = neurona.getNumPesos();
                    const pesos = neurona.getPesos();
                    for (let k = 0; k < num_pesos; k++) {
                        if (randomInt(1,2) === 1) {
                            neurona.setPeso(k, otraRedNeuronal_Neurona.getPeso(k));
                        }
                    }
                }
                if (i != 0) {
                    if (randomInt(1,2) === 1) {
                        neurona.setSesgo(otraRedNeuronal_Neurona.getSesgo());
                    }
                }
            }
        }
        return newRedNeuronal;
    }

    mutar() {
        const newRedNeuronal = this.getCopy();
        const num_capas = newRedNeuronal.getNumCapas();
        for (let i = 0; i < num_capas; i++) {
            const capa = newRedNeuronal.getCapa(i);
            const num_neuronas = capa.getNumNeuronas();
            for (let j = 0; j < num_neuronas; j++) {
                const neurona = capa.getNeurona(j);
                if (i != num_capas - 1) {
                    const num_pesos = neurona.getNumPesos();
                    const pesos = neurona.getPesos();
                    for (let k = 0; k < num_pesos; k++) {
                        if (randomInt(1,4) === 1) {
                            neurona.setRandomPeso(k);
                        }
                    }
                }
                if (i != 0) {
                    if (randomInt(1,4) === 1) {
                        neurona.setRandomSesgo();
                    }
                }
            }
        }
        return newRedNeuronal;
    }

    errorTotal(salida, salidasEsperada) {
        //console.log("Salida -> " + salida, "Salida esperada -> " + salidasEsperada);
        let resultado = 1/2 * Math.pow((salidasEsperada - salida), 2);
        //console.error(resultado);
        return resultado;
    }

    // https://theneuralblog.com/forward-pass-backpropagation-example/
    // https://hmkcode.com/ai/backpropagation-step-by-step/
    entrenar(entradas, salidasEsperadas) {
        let error = 10;
        while (error >= this.errorMaximoPermitido) {
            for (let i = 0; i < entradas.length; i++) {
                console.log(entradas[i]);
                console.log("->");
                const salidas = this.predict(entradas[i]);
                let errorTotal = 0;
                for (let j = 0; j < salidas.length; j++) {
                    console.log(salidas[j]);
                    errorTotal += this.errorTotal(salidas[j], salidasEsperadas[j]);
                }
                console.log("--------\n--------\n--------\n");
            }
            break;
        }
    }

    backpropagation() {
        const num_capas = newRedNeuronal.getNumCapas();
        for (let i = 0; i < num_capas; i++) {
            const capa = newRedNeuronal.getCapa(i);
            const num_neuronas = capa.getNumNeuronas();
            for (let j = 0; j < num_neuronas; j++) {
                const neurona = capa.getNeurona(j);
                neurona.sesgo += this.tasaDeAprendizaje * neurona.gradiente;
                const num_pesos = neurona.getNumPesos();
                for (let k = 0; k < num_pesos; k++) {
                    ///neurona.deltas[k] = this.tasaDeAprendizaje * neurona.gradiente * (this.capas[i-1] ? this.capas[i-1]._neurons[k].input : input[k]);
                }
            }
        }
    }
    
}