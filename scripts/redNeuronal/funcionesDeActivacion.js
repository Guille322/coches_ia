class FuncionesDeActivacion {

    static sigmoide(x) {
        return 1 / (1 + Math.exp(-x));
    }
    
    static relu(x) {
        return x < 0 ? 0 : x;
    }

    static lineal(x) {
        return x;
    }

}