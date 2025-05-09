<?php

namespace Controllers;

use Model\Dia;
use Model\Hora;
use MVC\Router;
use Model\Categoria;
use Model\Evento;

class EventosController {
    public static function index(Router $router) {
        $router->render('admin/eventos/index', [
            'titulo' => 'Conferencias y Workshops'
            
        ]);
    }

    public static function crear(Router $router) {
        $alertas = [];

        $categorias = Categoria::all();
        $dias = Dia::all('ASC');
        $horas = Hora::all('ASC');  

        $evento = new Evento;

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $evento ->sincronizar($_POST);

            $alertas = $evento->validar();

            if(empty($alertas)){
                $resultado = $evento->guardar();
                if($resultado) {
                    header('Location: /admin/eventos');
                }
                // } else {
                //     $alertas = Evento::getAlertas();
                // }
            }
        }
        
        
        $router->render('admin/eventos/crear', [
            'titulo' => 'Registrar Evento',
            'alertas' => $alertas,
            'categorias' => $categorias,
            'dias' => $dias,
            'horas' => $horas,
            'evento' => $evento
        ]);
    }
}
