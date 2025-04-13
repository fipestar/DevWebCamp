<main class="auth">
    <h2 class="auth__heading"><?php echo $titulo; ?></h2>
    <p class="auth__texto">Inicia Sesion en DevWebCamp</p>

    <?php
        require_once __DIR__ . '/../templates/alertas.php';
    ?>

    <form method="POST" action="/login" class="formulario">
        <div class="formulario__campo">
            <label for="email" class="formulario__label">Email</label>
            <input type="email" class="formulario__input" id="email" placeholder="Tu Email" name="email" required>
        </div>

        <div class="formulario__campo">
            <label for="password" class="formulario__label" >Password</label>
            <input type="password" class="formulario__input" id="password" placeholder="Tu Password" name="password" required>
        </div>

        <input type="submit" value="Iniciar Sesion" class="formulario__submit">
    </form>

    <div class="acciones">
        <a href="/registro" class="acciones__enlace">¿No tienes cuenta? Crear una</a>
        <a href="/olvide" class="acciones__enlace">Olvide mi password</a>
    </div>
</main>