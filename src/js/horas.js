(function(){
   
     const horas = document.querySelector('#horas');
     
     if(horas) {
        
        const categoria = document.querySelector('[name="categoria_id"]');
        const dias = document.querySelectorAll('[name="dia"]');
        const inputHiddenDia = document.querySelector('[name="dia_id"]');
        const inputHiddenHora = document.querySelector('[name="hora_id"]');

        categoria.addEventListener('change', terminoBusqueda)
        dias.forEach( dia => dia.addEventListener('change', terminoBusqueda))

        let busqueda = {
            categoria_id: +categoria.value || '',
            dia: +inputHiddenDia.value || ''
        } 

        if (!Object.values(busqueda).includes('')) {           
            (async () => {
                await buscarEventos();

                //Resaltar la hora seleccionada 
                const horaSeleccionada = document.querySelector(`[data-hora-id="${inputHiddenHora.value}"]`);
                
                horaSeleccionada.classList.remove('horas__hora--deshabilitada');
                horaSeleccionada.classList.add('horas__hora--seleccionada');

                horaSeleccionada.onClick = seleccionarHora;
            })();
        }
  

        function terminoBusqueda(e) {
            busqueda[e.target.name] = e.target.value;

            //Reiniciar los campos ocultos y el selector de horas
            inputHiddenHora.value = '';
            const horaPrevia = document.querySelector('.horas__hora--seleccionada');
            if(horaPrevia) {
                horaPrevia.classList.remove('horas__hora--seleccionada');
            }

            if (Object.values(busqueda).includes('')) {           
                return; //Comprobar que un objeto este lleno
            }

            buscarEventos();
        }

        async function buscarEventos() {
            const { dia, categoria_id } = busqueda
            const url = `/api/eventos-horario?dia_id=${dia}&categoria_id=${categoria_id}`;
            
            const resultado = await fetch(url);
            const eventos = await resultado.json();
            obtenerHorasDisponibles(eventos);
        }

        function obtenerHorasDisponibles(eventos){
            //Reiniciar las horas
            const listadoHoras = document.querySelectorAll('#horas li');
            listadoHoras.forEach(li => li.classList.add('horas__hora--deshabilitada'));

            //Comprobar eventos ya tomados y quitar la variable de deshabilitado
            const horasTomadas = eventos.map( evento => evento.hora_id );          
            const listadoHorasArray = Array.from(listadoHoras);

            const resultado = listadoHorasArray.filter( li => !horasTomadas.includes(li.dataset.horaId) );
            resultado.forEach( li => li.classList.remove('horas__hora--deshabilitada') );
            
            const horasDisponibles = document.querySelectorAll('#horas li:not(.horas__hora--deshabilitada)');
            horasDisponibles.forEach( hora => hora.addEventListener('click', seleccionarHora) );

            const horasNoDisponibles = document.querySelectorAll('.horas__hora--deshabilitada');
            Array.from(horasNoDisponibles).map(hora => {
                hora.removeEventListener('click', seleccionarHora);
})  

        }

        function seleccionarHora(e){
            //Deshabilitar la hora previa si hay un nuevo click
            const horaPrevia = document.querySelector('.horas__hora--seleccionada');
            if(horaPrevia) {
                horaPrevia.classList.remove('horas__hora--seleccionada');
            }
            //Agregar la clase seleccionada a la hora actual
            e.target.classList.add('horas__hora--seleccionada');

            inputHiddenHora.value = e.target.dataset.horaId;

            //Llenar el campo oculto de dia
            inputHiddenDia.value = document.querySelector('[name="dia"]:checked').value;
        }
     }

})();