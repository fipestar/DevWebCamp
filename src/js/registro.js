import Swal from "sweetalert2";

(function(){
    let eventos = [];
    const resumen = document.querySelector('#registro-resumen');

    if(resumen){

    const eventosBoton = document.querySelectorAll('.evento__agregar');
    eventosBoton.forEach(boton => boton.addEventListener('click', seleccionarEvento)); 

    const formularioRegistro = document.querySelector('#registro');
    formularioRegistro.addEventListener('submit', submitFormulario)

    mostrarEventos();

    function seleccionarEvento({target}) {
        if(eventos.length < 5) {
            //Deshabilitar el botón
        target.disabled = true
        eventos = [...eventos, {
            id: target.dataset.id,
            titulo: target.parentElement.querySelector('.evento__nombre').textContent.trim()
        }]

        mostrarEventos();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No puedes agregar más de 5 eventos',
                confirmButtonText: 'Aceptar',
            });
        }
    }

    function mostrarEventos() {
        //Limpiar el html
        limpiarEventos();

        if(eventos.length > 0) {
            eventos.forEach( evento => {
                const eventoDOM = document.createElement('DIV');
                eventoDOM.classList.add('registro__evento');

                const titulo = document.createElement('H3');
                titulo.classList.add('registro__nombre');
                titulo.textContent = evento.titulo;

                const botonEliminar = document.createElement('BUTTON');
                botonEliminar.classList.add('registro__eliminar');
                botonEliminar.innerHTML = `<i class="fa-solid fa-trash"></i> Eliminar`;
                botonEliminar.onclick = function() {
                    eliminarEvento(evento.id);
                }

                //Renderizar em el html
                eventoDOM.appendChild(titulo);
                eventoDOM.appendChild(botonEliminar);
                resumen.appendChild(eventoDOM);
            })
        } else {
            const noRegistro = document.createElement('P');
            noRegistro.textContent = 'No hay eventos agregados, añade hasta 5 del lado izquierdo';
            noRegistro.classList.add('registro__texto');
            resumen.appendChild(noRegistro);
        }
    }
    function eliminarEvento(id){
        eventos = eventos.filter( evento => evento.id !== id)
        const botonAgregar = document.querySelector(`[data-id="${id}"]`)
        botonAgregar.disabled = false
        mostrarEventos();
    }
    function limpiarEventos() {
        while(resumen.firstChild) {
            resumen.removeChild(resumen.firstChild);
        }
    }

    async function submitFormulario(e){
        e.preventDefault();
      
        //Obtener el regalo
        const regaloId = document.querySelector('#regalo').value;
        const eventosId = eventos.map(evento => evento.id);

        if(eventosId.length < 1 || regaloId === '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Todos los campos son obligatorios',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        //Objeto de FormData
        const datos = new FormData();
        datos.append('regalo_id', regaloId)
        datos.append('eventos', eventosId)

        const url = '/finalizar-registro/conferencias'
        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        })
        const resultado = await respuesta.json();

        if(resultado.resultado) {
            Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: 'Tus eventos se han registrado correctamente',
                confirmButtonText: 'Aceptar',
            }).then( () => location.href = `/boleto?id=${resultado.token}`);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Hubo un error al registrar tus eventos, intenta de nuevo',
                confirmButtonText: 'Aceptar',
            }).then( () => location.reload());
        }
    }
}
})();