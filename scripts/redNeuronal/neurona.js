class Neurona {

    sesgo = 0;
    pesos = [];
    //deltas = [];
    //deltasAnteriores = [];
    //gradiente = 0;
    funcionDeActivacion = null;

    constructor(funcionDeActivacion = FuncionesDeActivacion.lineal) {
        this.setRandomSesgo();
        this.funcionDeActivacion = funcionDeActivacion;
    }

    setSesgoNull() {
        this.sesgo = null;
    }

    setRandomSesgo() {
        this.sesgo = random(-1, 1);
    }

    setSesgo(sesgo) {
        this.sesgo = sesgo;
    }

    getSesgo() {
        return this.sesgo;
    }

    getPeso(index) {
        return this.pesos[index];
    }

    setPeso(index, value) {
        this.pesos[index] = value;
    }

    setRandomPeso(index) {
        this.pesos[index] = random(-1, 1);
    }

    addPeso(peso) {
        this.pesos.push(peso);
    }

    getNumPesos() {
        return this.pesos.length;
    }

    getPesos() {
        return this.pesos;
    }

    addRandomPeso(peso) {
        this.pesos.push(random(-1, 1));
    }

    getResultado(resultadoNeuronaAnterior) {
        return this.funcionDeActivacion(resultadoNeuronaAnterior + this.sesgo);
    }

    getCopy() {
        const newNeurona = new Neurona(this.funcionDeActivacion);
        for (let i = 0; i < this.getNumPesos(); i++) {
            newNeurona.addPeso(this.getPeso(i));
        }
        newNeurona.setSesgo(this.sesgo);
        return newNeurona;
    }

}