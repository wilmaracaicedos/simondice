const celeste = document.getElementById('celeste')
const violeta = document.getElementById('violeta')
const naranja = document.getElementById('naranja')
const verde = document.getElementById('verde')
const btnEmpezar = document.getElementById('btnEmpezar')
const ULTIMO_NIVEL = 3

class Juego {
	constructor() {
		this.inicializar = this.inicializar.bind(this)
		this.inicializar()
		this.generarSecuencia()
		this.mensajeInicial()
	}

	inicializar() {
		this.siguienteNivel = this.siguienteNivel.bind(this)
		this.elegirColor = this.elegirColor.bind(this)
		this.toggleBtnEmpezar()
		this.inicializarTiempoRespuesta()
		this.nivel = 1
		this.colores = {
			celeste,
			violeta,
			naranja,
			verde
		}
	}

	toggleBtnEmpezar() {
		if (btnEmpezar.classList.contains('hide')) {
			btnEmpezar.classList.remove('hide')
		} else {
			btnEmpezar.classList.add('hide')
		}
	}

	generarSecuencia() {
		this.secuencia = new Array(ULTIMO_NIVEL).fill(0).map(n => Math.floor(Math.random() * 4))
	}

	siguienteNivel() {
		this.subnivel = 0
		this.iluminarSecuencia()
		this.agregarEventosClick()
	}

	mensajeInicial() {
		swal('Simon dice', 'Nivel 1', {
			buttons: false,
			timer: 1500
		})
			.then(() => {
				setTimeout(this.siguienteNivel, 800)
			})
	}

	inicializarTiempoRespuesta() {
		document.getElementById('time').innerHTML = 0
		this.tiempo = 0
	}

	expirarTiempoRespuesta() {
		this.tiempoExpiracion = setInterval(() => {
			this.tiempo += 1
			document.getElementById('time').innerHTML = this.tiempo
		}, 1000)
		this.temporizadorRespuesta = setTimeout(() => {
			clearInterval(this.tiempoExpiracion)
			swal('Simon dice', 'Expiro el tiempo para responder', {
				buttons: false,
				timer: 3000
			})
				.then(() => {
					clearInterval(this.tiempoExpiracion)
					clearTimeout(this.temporizadorRespuesta)
					this.eliminarEventosClick()
					this.inicializar()
				})
		}, 20000);
	}

	transformarNumeroAColor(num) {
		switch (num) {
			case 0:
				return 'celeste'
			case 1:
				return 'violeta'
			case 2:
				return 'naranja'
			case 3:
				return 'verde'
		}
	}

	transformarColorANumero(color) {
		switch (color) {
			case 'celeste':
				return 0
			case 'violeta':
				return 1
			case 'naranja':
				return 2
			case 'verde':
				return 3
		}
	}

	iluminarSecuencia() {
		let i = 0
		for (i; i < this.nivel; i++) {
			const color = this.transformarNumeroAColor(this.secuencia[i])
			setTimeout(() => this.iluminarColor(color), 1000 * i)
		}

		setTimeout(() => {
			this.expirarTiempoRespuesta()
		}, 500 * i);
	}

	iluminarColor(color) {
		this.colores[color].classList.add('light')
		setTimeout(() => this.apagarColor(color), 350)
	}

	apagarColor(color) {
		this.colores[color].classList.remove('light')
	}

	agregarEventosClick() {
		this.colores.celeste.addEventListener('click', this.elegirColor)
		this.colores.verde.addEventListener('click', this.elegirColor)
		this.colores.violeta.addEventListener('click', this.elegirColor)
		this.colores.naranja.addEventListener('click', this.elegirColor)
	}

	eliminarEventosClick() {
		this.colores.celeste.removeEventListener('click', this.elegirColor)
		this.colores.verde.removeEventListener('click', this.elegirColor)
		this.colores.violeta.removeEventListener('click', this.elegirColor)
		this.colores.naranja.removeEventListener('click', this.elegirColor)
	}

	elegirColor(ev) {
		const nombreColor = ev.target.dataset.color
		const numeroColor = this.transformarColorANumero(nombreColor)
		this.iluminarColor(nombreColor)
		if (numeroColor === this.secuencia[this.subnivel]) {
			this.subnivel++
			if (this.subnivel === this.nivel) {
				this.nivel++
				this.eliminarEventosClick()
				if (this.nivel === (ULTIMO_NIVEL + 1)) {
					this.ganoElJuego()
				} else {
					clearInterval(this.tiempoExpiracion)
					clearTimeout(this.temporizadorRespuesta)
					setTimeout(() => {
						this.avanzarSiguienteNivel(this.nivel)
						this.inicializarTiempoRespuesta()
					}, 1300);
				}
			}
		} else {
			this.perdioElJuego()
		}
	}

	ganoElJuego() {
		swal('Simon dice', 'Felicitaciones ganaste el juego 😃', 'success')
			.then(() => {
				clearInterval(this.tiempoExpiracion)
				clearTimeout(this.temporizadorRespuesta)
				this.eliminarEventosClick()
				this.inicializar()
			})
	}

	perdioElJuego() {
		swal('Simon dice', 'Lo lamentamos, perdiste 😣', 'error')
			.then(() => {
				clearInterval(this.tiempoExpiracion)
				clearTimeout(this.temporizadorRespuesta)
				this.eliminarEventosClick()
				this.inicializar()
			})
	}

	avanzarSiguienteNivel(nivel) {
		let text = `Muy bien, avanzas al nivel ${nivel}`
		swal('Simon dice', text,{
			buttons: false,
			icon: 'success',
			timer: 2500
		})
			.then(() => {
				setTimeout(this.siguienteNivel, 1500)
			})
	}
}

function empezarJuego() {
	window.juego = new Juego()
}
