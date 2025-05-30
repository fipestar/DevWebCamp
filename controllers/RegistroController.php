<?php

namespace Controllers;

use Model\Paquete;
use Model\Registro;
use Model\Usuario;
use MVC\Router;

class RegistroController {
    public static function crear(Router $router) {

        if(!is_auth()){
            header('Location: /');
        }

        //Verificar que el usuario ya este registrado
        $registro = Registro::where('usuario_id', $_SESSION['id']);
        if(isset($registro) && $registro->paquete_id === 3){
            header('Location: /boleto?id=' . urlencode($registro->token));
        }
        
        $router->render('registro/crear', [
            'titulo' => 'Finalizar Regsitro'
        ]);
    }

    public static function gratis(Router $router) {
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            if(!is_auth()){
                header('Location: /login');
            }

            //Verificar que el usuario ya este registrado
            $registro = Registro::where('usuario_id', $_SESSION['id']);
            if(isset($registro) && $registro->paquete_id === 3){
                header('Location: /boleto?id=' . urlencode($registro->token));
            }

            $token = substr( md5(uniqid( rand(), true )), 0, 8);

            //Crear el registro
            $datos = [
                'paquete_id' => 3,
                'pago_id' => '',
                'token' => $token,
                'usuario_id' => $_SESSION['id']
            ];

            $registro = new Registro($datos);
            $resultado = $registro->guardar();

            if($resultado){
                header('Location: /boleto?id=' . urlencode($registro->token));
            }
        }
    }

    public static function boleto(Router $router) {
        //Validar la url
        $id = $_GET['id'];

        if(!$id || !strlen($id) === 8){
            header('Location: /');
        }

        //Buscarlo en la bd
        $registro = Registro::where('token', $id);
        if(!$registro){
            header('Location: /');
        }

        //Llenar las tablas de referencia
        $registro->usuario = Usuario::find($registro->usuario_id);
        $registro->paquete = Paquete::find($registro->paquete_id);

        $router->render('registro/boleto', [
            'titulo' => 'Asistencia a DevWebCamp',
            'registro' => $registro
        ]);
    }

    public static function pagar(Router $router) {
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            if(!is_auth()){
                header('Location: /login');
            }

            //Validar que post no venga vacio
            if(empty($_POST)) {
                echo json_encode([]);
                return;
            }

            //Crear el registro
            $datos = $_POST;
            $datos['token'] = substr( md5(uniqid( rand(), true )), 0, 8);
            $datos['usuario_id'] = $_SESSION['id'];
            
            try {
                $registro = new Registro($datos);
                $resultado = $registro->guardar();
                echo json_encode($resultado);
            } catch (\Throwable $th) {
                // Manejar el error
                echo json_encode([
                    'resultado' => 'Error al procesar el registro: ' . $th->getMessage()
                ]);

            }
        }
    }
}