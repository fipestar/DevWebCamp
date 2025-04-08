<main class="auth">
    <h2 class="auth__heading"><?php echo $titulo; ?></h2>
    <p class="auth__texto">Recupera tu Acceso a DevWebCamp</p>

    <form>
        <div class="formulario__campo">
            <label for="email" class="formulario__label">Email</label>
            <input type="email" class="formulario__input" id="email" placeholder="Tu Email" name="email" required>
        </div>

        <input type="submit" value="Enviar Instrucciones" class="formulario__submit">
    </form>

    <div class="acciones">
        <a href="/olvide" class="acciones__enlace">Olvide mi password</a>
        <a href="/login" class="acciones__enlace">¿Ya tienes cuenta? Inicia Sesion</a>
    </div>
</main>