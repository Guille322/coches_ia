class Capa {

    neuronas = [];

    getNumNeuronas() {
        return this.neuronas.length;
    }

    getNeurona(index) {
        return this.neuronas[index];
    }

    constructor(num_neuronas, funcionDeActivacion = FuncionesDeActivacion.lineal) {
        for (let i = 0; i < num_neuronas; i++) {
            this.neuronas.push(new Neurona(funcionDeActivacion));
        }
    }

    addNeurona(neurona) {
        this.neuronas.push(neurona);
    }

    setNeurona(index, neurona) {
        this.neuronas[index] = neurona;
    }

    getResultado(...inputs) {
        const num_neuronas = this.getNumNeuronas();
        if (inputs.length != num_neuronas) return 0;
        let suma = 0;
        for (let i = 0; i < num_neuronas; i++) {
            suma += inputs[i] * this.neuronas[i].getPeso();
        }
        return suma;
    }

    getCopy() {
        const num_neuronas = this.getNumNeuronas();
        const newCapa = new Capa(num_neuronas, this.funcionDeActivacion);
        for (let i = 0; i < num_neuronas; i++) {
            newCapa.setNeurona(i, this.getNeurona(i).getCopy());
        }
        return newCapa;
    }

}