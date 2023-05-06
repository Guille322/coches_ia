class Coche {
            
    x = 0;
    y = 0;
    NUM_CASILLAS = AparcarCoches.NUM_CASILLAS;
    dinero = 150;
    divCoche = null;
    pasosRecorridos = -1;
    haGanado = false;
    haPerdido = false;
    redNeuronal = null;
    tableroRedNeuronal = [];
    puntos = 0;

    tablero = null;
    tableroDivs = null;

    divPuntuacion = null;

    valoresCasillas = AparcarCoches.VALORES_CASILLAS;

    static SUMAR_DINERO = 50;
    static RESTAR_DINERO = 25;

    interval = null;

    direction = {
        Up: 'Up',
        Down: 'Down',
        Left: 'Left',
        Right: 'Right'
    };

    getRedNeuronal() {
        return this.redNeuronal;
    }

    setDivPuntuacion(divPuntuacion) {
        this.divPuntuacion = divPuntuacion;
    }

    getCopy() {
        return Object.create(this);
    }

    destruir() {
        this.divCoche.remove();
        clearInterval(this.interval);
    }

    restablecer() {
        if (this.interval != null) {
            clearInterval(this.interval);
        }
        this.x = 0;
        this.y = 0;
        this.haGanado = false;
        this.haPerdido = false;
        this.dinero = 100;
        this.pasosRecorridos = -1;
        let esteCoche = this;
        if (this.divCoche === null) {
            this.divCoche = document.createElement("div");
            this.divCoche.classList.add("divCoche");
            this.divCoche.innerHTML = `<img src="imagenes/coche1.png" class="coche">`;
        }
        //this.resetDivCoche();
        //this.divCoche.style = "left: " + (this.x * 100 + 4) + "px; top: " + (this.y * 100 + 4) + "px; transform: rotate(0deg);";
        this.divCoche.style.opacity = "1";
        this.divCoche.style.display = "block";
        areaJuego.appendChild(this.divCoche);
        //this.avanzarCocheCeldas('Up');
    }

    resetDivCoche(rotate = 0) {
        this.divCoche.style = "left: " + (this.x * 100 + 4) + "px; top: " + (this.y * 100 + 4) + "px; transform: rotate(" + rotate + "deg);";
        let titulo = "Movimientos: " + this.pasosRecorridos + " Dinero: " + this.dinero;
        this.divCoche.getElementsByTagName("img")[0].title = titulo;
        this.divPuntuacion.innerHTML = `
            <p>${titulo}</p>
        `; 
    }

    setRedNeuronal(redNeuronal = null) {
        if (redNeuronal === null) {
            //const neuronas = 8 * 8;

            this.redNeuronal = null;

            const capaDeEntrada = new Capa(4, FuncionesDeActivacion.lineal);
            const capaOculta1 = new Capa(12, FuncionesDeActivacion.lineal);
            const capaOculta2 = new Capa(12, FuncionesDeActivacion.lineal);
            const capaDeSalida = new Capa(4, FuncionesDeActivacion.lineal);

            this.redNeuronal = new RedNeuronal(); 

            this.redNeuronal.addCapas(capaDeEntrada, capaOculta1, capaOculta2, capaDeSalida);


        } else {
            this.redNeuronal = null;
            this.redNeuronal = redNeuronal;
            //console.log(redNeuronal);
        }
        

    }

    constructor(redNeuronal = null) {
        this.restablecer();
        this.setRedNeuronal(redNeuronal);
    }

    getValueValoresCasillaParaRed(valor) {
        switch (valor) {
            case AparcarCoches.VALORES_CASILLAS.PLAZA_CON_EXPLOSION: case AparcarCoches.VALORES_CASILLAS.PLAZA_CON_COCHE:
                valor = -5;
                break;
            case AparcarCoches.VALORES_CASILLAS.PLAZA_MINUSVALIDO: case AparcarCoches.VALORES_CASILLAS.PLANTA:
                valor = -2;
                break;
            case AparcarCoches.VALORES_CASILLAS.PLAZA_LIBRE: case AparcarCoches.VALORES_CASILLAS.VACIO:
                valor = 0;
                break;
            case AparcarCoches.VALORES_CASILLAS.DINERO:
                valor = 2;
                break;
            case AparcarCoches.VALORES_CASILLAS.PLAZA_PARA_APARCAR:
                valor = 5;
                break;
            case AparcarCoches.VALORES_CASILLAS.MI_COCHE:
                valor = 10;
                break;
        }
        return valor;
    }


    setTableros(tablero, tableroDivs) {
        this.tablero = tablero;
        //console.log(tablero);
        this.tableroDivs = tableroDivs;
        //console.log("holala");
        //console.log(this.tableroDivs);
        this.avanzarCocheCeldas('Up');
        let esteCoche = this;

        
        /*
        window.addEventListener("keydown", function(e) {
            const tecla = e.key.toString().replace('Arrow','');
            esteCoche.avanzarCocheCeldas(tecla);
        });
        */
        //console.log(esteCoche.redNeuronal.getCopy());
        //console.log(this.redNeuronal);
        this.interval = setInterval(function() {
            esteCoche.tableroRedNeuronal = null;
            esteCoche.tableroRedNeuronal = [];
            
            esteCoche.tableroRedNeuronal.push(tablero[esteCoche.y][esteCoche.x + 1]); // derecha
            esteCoche.tableroRedNeuronal.push(tablero[esteCoche.y][esteCoche.x - 1]); // izquierda
            esteCoche.tableroRedNeuronal.push((esteCoche.y + 1) === 8 ? esteCoche.valoresCasillas.PLANTA : tablero[esteCoche.y + 1][esteCoche.x]); // abajo
            esteCoche.tableroRedNeuronal.push((esteCoche.y - 1) === -1 ? esteCoche.valoresCasillas.PLANTA : tablero[esteCoche.y - 1][esteCoche.x]); // arriba

            

            for (let i = 0; i < 4; i++) {
                if (esteCoche.tableroRedNeuronal[i] === undefined) {
                    esteCoche.tableroRedNeuronal[i] = esteCoche.valoresCasillas.PLANTA;
                }
                esteCoche.tableroRedNeuronal[i] = esteCoche.getValueValoresCasillaParaRed(esteCoche.tableroRedNeuronal[i]);
            }
            //console.log(esteCoche.tableroRedNeuronal);
            /*
            for (let i = 0; i < tablero.length; i++) {
                for (let j = 0; j < tablero[i].length; j++) {
                    if (i === esteCoche.y && j === esteCoche.x) {
                        esteCoche.tableroRedNeuronal.push(esteCoche.getValueValoresCasillaParaRed(esteCoche.valoresCasillas.MI_COCHE));
                    } else {
                        esteCoche.tableroRedNeuronal.push(esteCoche.getValueValoresCasillaParaRed(tablero[i][j]));
                    }
                }
            }*/
            //console.log(esteCoche.tableroRedNeuronal);
            const resultado = esteCoche.redNeuronal.predict(esteCoche.tableroRedNeuronal);

            

            let direccion = getIndexArrayMaxValue(resultado);

            switch(direccion) {
                case 0:
                    direccion = esteCoche.direction.Right;
                    break;
                case 1:
                    direccion = esteCoche.direction.Left;
                    break;
                case 2:
                    direccion = esteCoche.direction.Down;
                    break;
                case 3:
                    direccion = esteCoche.direction.Up;
                    break;
            }
            //console.log(direccion);
            esteCoche.avanzarCocheCeldas(direccion);

        }, 500);
    }
    


    avanzarCocheCeldas(direccion) {
        //console.log(direccion);
        if (this.haGanado || this.haPerdido) return;
        this.pasosRecorridos++;
        let rotate = 0;
        switch(direccion) {
            case this.direction.Up:
                this.y--;
                rotate = 0;
                break;
            case this.direction.Down:
                this.y++;
                rotate = 180;
                break;
            case this.direction.Right:
                this.x++;
                rotate = 90;
                break;
            case this.direction.Left:
                this.x--;
                rotate = -90;
                break;
        }
        const num_casillas = this.NUM_CASILLAS - 1;
        let fueraDeMapa = false;
        if (this.y < 0) {this.y = 0; this.pasosRecorridos--; fueraDeMapa = true;}
        if (this.x < 0) {this.x = 0; this.pasosRecorridos--; fueraDeMapa = true;}
        if (this.x > num_casillas) {this.x = num_casillas; this.pasosRecorridos--; fueraDeMapa = true;}
        if (this.y > num_casillas) {this.y = num_casillas; this.pasosRecorridos--; fueraDeMapa = true;}
        let casilla = this.tablero[this.y][this.x];
        let crash = false;
        if (fueraDeMapa) {
            this.puntos += this.getValueValoresCasillaParaRed(AparcarCoches.VALORES_CASILLAS.PLANTA);
        } else {
            this.puntos += this.getValueValoresCasillaParaRed(this.tablero[this.y][this.x]);
        }
        switch(casilla) {
            case this.valoresCasillas.PLAZA_MINUSVALIDO:
                this.dinero -= Coche.RESTAR_DINERO;
                if (this.dinero < 0) {
                    this.dinero = 0;
                    this.haPerdido = true;
                }
                break;
            case this.valoresCasillas.DINERO:
                this.tablero[this.y][this.x] = this.valoresCasillas.VACIO;
                this.tableroDivs[this.y][this.x].classList.remove("dinero");
                this.dinero += Coche.SUMAR_DINERO;
                break;
            case this.valoresCasillas.PLANTA:
                this.pasosRecorridos--;
                switch(direccion) {
                    case this.direction.Up:
                        this.y++;
                        break;
                    case this.direction.Down:
                        this.y--;
                        break;
                    case this.direction.Right:
                        this.x--;
                        break;
                    case this.direction.Left:
                        this.x++;
                        break;
                } 
                break;
            case this.valoresCasillas.PLAZA_CON_COCHE:
                this.haPerdido = true;
                this.divCoche.style.opacity = "0";
                crash = true;
                //this.divCoche.style.display = "none";
                break;
            case this.valoresCasillas.PLAZA_CON_EXPLOSION:
                this.haPerdido = true;
                this.divCoche.style.display = "none";
                break;
            case this.valoresCasillas.PLAZA_PARA_APARCAR:
                this.haGanado = true;
                //console.log("Ha ganadooo");
                //console.log(this.redNeuronal);
                break;
        }
        if (this.pasosRecorridos < 0) {
            this.pasosRecorridos = 0;
        }
        this.resetDivCoche(rotate);
        if (crash) {
            this.tableroDivs[this.y][this.x].getElementsByTagName("img")[0].style.opacity = "0";
            this.divCoche.style.opacity = "0";
            this.tableroDivs[this.y][this.x].classList.add("aparcamientoExplosion");
            this.tablero[this.y][this.x] = this.valoresCasillas.PLAZA_CON_EXPLOSION;
            let esteCoche = this;
            /*
                setTimeout(function() {
                    if (esteCoche.tablero[esteCoche.y][esteCoche.x] == esteCoche.valoresCasillas.PLAZA_CON_EXPLOSION) {
                        esteCoche.tablero[esteCoche.y][esteCoche.x] = esteCoche.valoresCasillas.PLAZA_LIBRE;
                    }
                    esteCoche.tableroDivs[esteCoche.y][esteCoche.x].classList.remove("aparcamientoExplosion");
                }, 1000);
            */
        }
    }
}