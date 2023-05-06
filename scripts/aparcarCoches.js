const COCHES_POR_GENERACION = 700;

class AparcarCoches {

    generacion = 1;

    static NUM_CASILLAS = 8;
    coches = [];
    tablero = null;
    tableroDivs = null;
    intervalCambiarGeneracion = null;

    static VALORES_CASILLAS = {
        PLAZA_PARA_APARCAR: 0, 
        VACIO: 1,
        PLAZA_MINUSVALIDO: 2,
        DINERO: 3,
        PLAZA_LIBRE: 4,
        PLANTA: 5,
        PLAZA_CON_COCHE: 6,
        PLAZA_CON_EXPLOSION: 7,
        MI_COCHE: 8
    };

    addCoche(coche) {
        const div = document.createElement("div");
        div.classList.add("divPuntuacion");
        coche.setDivPuntuacion(div);
        divPuntuaciones.appendChild(div);
        coche.setTableros(this.tablero, this.tableroDivs);
        this.coches.push(coche);
    }

    addArrayRedesCoches(arrayRedesCoches) {
        for (let i = 0; i < arrayRedesCoches.length; i++) {
            //arrayCoches[i].restablecer();
            this.addCoche(new Coche(arrayRedesCoches[i]));
            
            //arrayCoches[i].setRedNeuronal();
        }
    }

    addCoches(number) {
        for (let i = 0; i < number; i++) {
            this.addCoche(new Coche());
        }
    }   

    bucleGeneracional() {
        
        /*
        if (this.intervalCambiarGeneracion != null) {
            clearInterval(this.intervalCambiarGeneracion);
        }
        this.intervalCambiarGeneracion = null;
        */
        const aparcarCoches = this;
        tituloGeneracion.innerHTML = "Generación " + aparcarCoches.generacion;
        btnSigGen.onclick = function() {
            aparcarCoches.generacion++;
            tituloGeneracion.innerHTML = "Generación " + aparcarCoches.generacion;
            //if (aparcarCoches.generacion > 1) return;
            const mejoresCoches = aparcarCoches.getMejoresCoches();
            const mejorCoche = mejoresCoches[0];
            const segundoMejorCoche = mejoresCoches[1];
            console.clear();
            console.log("Los dos mejores coches de la generación " + (aparcarCoches.generacion - 1) + " han sido:");
            console.log(mejorCoche);
            console.log(segundoMejorCoche);
            aparcarCoches.generarTableroAleatorio();
            const arrayCochesSiguienteGeneracion = [
                mejorCoche.getRedNeuronal().getCopy(),
                segundoMejorCoche.getRedNeuronal().getCopy()
            ]; 
            for (let i = 1; i < COCHES_POR_GENERACION; i++) {
                if (i < COCHES_POR_GENERACION/2) {
                    arrayCochesSiguienteGeneracion.push(mejorCoche.getRedNeuronal().cruzar(segundoMejorCoche.getRedNeuronal()));
                } else {
                    arrayCochesSiguienteGeneracion.push(mejorCoche.getRedNeuronal().mutar());
                }
            }
            aparcarCoches.addArrayRedesCoches(arrayCochesSiguienteGeneracion);
        }
        /*
        this.intervalCambiarGeneracion = setInterval(function() {
            //aparcarCoches.addCoches(1000);
            //aparcarCoches.addCoches(arrayCochesSiguienteGeneracion.length);
            //aparcarCoches.bucleGeneracional();
        }, 30000);
        */
    }

    constructor() {
        this.generarTableroAleatorio();
    }

    getMejoresCoches() {
        const mejoresCoches = this.coches.sort((coche1, coche2) => {
            const COCHE_1 = -1;
            const COCHE_2 = 1;
            

            //console.log(coche1.puntos, coche2.puntos);
            if (coche1.haGanado && !coche2.haGanado) {
                return COCHE_1;
            } else if (coche2.haGanado && !coche1.haGanado) {
                return COCHE_2;
            } 
            if (coche1.haPerdido && !coche2.haPerdido) {
                return COCHE_2;
            } else if (coche2.haPerdido && !coche1.haPerdido) {
                return COCHE_1;
            }
            if (coche1.dinero > coche2.dinero) {
                return COCHE_1;
            } else if (coche2.dinero > coche1.dinero) {
                return COCHE_2;
            }
            if (coche1.x != coche2.x && coche1.y != coche2.y) {
                if (coche1.x >= coche2.x && coche1.y >= coche2.y) {
                    return COCHE_1;
                } else if (coche2.x >= coche1.x && coche2.y >= coche1.y) {
                    return COCHE_2;
                }
            }
            if (coche1.puntos > coche2.puntos) {
                return COCHE_1;
            } else if (coche2.puntos > coche1.puntos) {
                return COCHE_2;
            }
            
            /*
            if (coche1.haGanado && !coche2.haGanado) {
                return COCHE_1;
            } else if (coche2.haGanado && !coche1.haGanado) {
                return COCHE_2;
            }
            
            
            /*
            
            */

            return COCHE_1;
        });
        /*
        for (let i = 0; i < mejoresCoches.length; i++) {
            //console.log(mejoresCoches[i]);
            mejoresCoches[i] = mejoresCoches[i].getRedNeuronal();
        }*/
        return mejoresCoches;
    }

    generarTableroAleatorio(arrayCochesSiguienteGeneracion = null) {
        /*const num_coches = this.coches.length;
        const cochesTemp = [];
        for (let i = 0; i < num_coches; i++) {
            if (arrayCochesSiguienteGeneracion != null && arrayCochesSiguienteGeneracion.includes(this.coches[i])) {
                //this.coches[i].restablecer();
                cochesTemp.push(this.coches[i]);
            } else {
                this.coches[i].destruir();
                this.coches[i] = null;
            }
        }
        this.coches = cochesTemp;*/
        divPuntuaciones.innerHTML = '';
        this.tablero = null;
        this.tableroDivs = null;
        areaJuego.innerHTML = '';
        this.tablero = [];
        this.tableroDivs = [];
        const arrayCaminoSeguro = this.getArrayCamino();
        for (let i = 0; i < AparcarCoches.NUM_CASILLAS; i++) {
            const array = [];
            const arrayDivs = [];
            for (let j = 0; j < AparcarCoches.NUM_CASILLAS; j++) {
                let valor;
                valor = this.getRandom(1, 6);
                if (i === 0 && j === 0) {
                    valor = AparcarCoches.VALORES_CASILLAS.VACIO;
                } else if (i === AparcarCoches.NUM_CASILLAS - 1 && j === AparcarCoches.NUM_CASILLAS - 1) {
                    valor = AparcarCoches.VALORES_CASILLAS.PLAZA_PARA_APARCAR;
                } else if (this.casillaEnCaminoSeguro(arrayCaminoSeguro, i, j)) {
                    switch(valor) {
                        case AparcarCoches.VALORES_CASILLAS.PLAZA_MINUSVALIDO: case AparcarCoches.VALORES_CASILLAS.PLAZA_CON_COCHE:
                            valor = AparcarCoches.VALORES_CASILLAS.PLAZA_LIBRE;
                            break;
                        case AparcarCoches.VALORES_CASILLAS.PLANTA: 
                            valor = AparcarCoches.VALORES_CASILLAS.VACIO;
                            break;
                    }
                }
                array.push(valor);
                const divCelda = this.GetDivAparcamiento(valor);
                areaJuego.appendChild(divCelda);
                arrayDivs.push(divCelda);
            }
            this.tablero.push(array);
            this.tableroDivs.push(arrayDivs);
        }
        //console.log(this.tablero);
    }

    casillaEnCaminoSeguro(arrayCaminoSeguro, i, j) {
        let sw = false;
        arrayCaminoSeguro.forEach(array => {
            if (array[0] == i && array[1] == j) {
                sw = true;
            }
        });
        return sw;
    }

    getArrayCamino() {
        const array = [];
        let x = 0;
        let y = 0;
        let num_casillas = AparcarCoches.NUM_CASILLAS - 1;
        while (true) {
            if (x === num_casillas && y === num_casillas) {
                break;
            }
            if (x === num_casillas) {
                y++;
            } else if (y === num_casillas) {
                x++;
            } else if (this.getRandom(1,2) === 1) {
                x++;
            } else {
                y++;
            }
            array.push([x, y]);
        }
        return array;
    }
    
    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    GetDivAparcamiento(valorCasilla) {
        const divAparcamiento = document.createElement('div');
        divAparcamiento.classList.add('aparcamiento');
        let title = null;
        switch(valorCasilla) {
            case AparcarCoches.VALORES_CASILLAS.VACIO:
                divAparcamiento.classList.remove('aparcamiento');
                divAparcamiento.classList.add('vacio');
                break;
            case AparcarCoches.VALORES_CASILLAS.PLAZA_MINUSVALIDO:
                divAparcamiento.classList.add('minusvalido');
                title = "Multa de " + Coche.RESTAR_DINERO;
                break;
            case AparcarCoches.VALORES_CASILLAS.PLAZA_PARA_APARCAR:
                divAparcamiento.classList.add('aparcamientoEspecial');
                title = "Aparca aquí";
                break;
            case AparcarCoches.VALORES_CASILLAS.DINERO:
                divAparcamiento.classList.remove('aparcamiento');
                divAparcamiento.classList.add('dinero');
                title = "+" + Coche.SUMAR_DINERO;
                break;
            case AparcarCoches.VALORES_CASILLAS.PLANTA:
                divAparcamiento.classList.remove('aparcamiento');
                divAparcamiento.classList.add('planta');
                break;
            case AparcarCoches.VALORES_CASILLAS.PLAZA_CON_COCHE:
                divAparcamiento.innerHTML = `<img src="imagenes/coche2.png" class="coche">`;
                title = "Cuidado que explotas!!";
                break;
            break;
        }
        if (title != null) {
            divAparcamiento.title = title;
        }
        return divAparcamiento;
    }

}