const { src, dest, watch, parallel } = require('gulp');

// CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

// Imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// Javascript
const terser = require('gulp-terser-js');
const concat = require('gulp-concat');
const rename = require('gulp-rename')

//WebPack
const webpack = require('webpack-stream');


const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    imagenes: 'src/img/**/*'
}
function css() {
    return src(paths.scss)
        .pipe( sourcemaps.init())
        .pipe( sass({outputStyle: 'expanded'}))
        // .pipe( postcss([autoprefixer(), cssnano()]))
        .pipe( sourcemaps.write('.'))
        .pipe(  dest('public/build/css') );
}
function javascript() {
  return src(paths.js)              // 1. Toma los archivos JS definidos en tu objeto paths.
    .pipe(webpack({                 // 2. Pasa esos archivos por Webpack.
      module: {
        rules: [
          {
            test: /\.css$/,         // 3. Para los archivos .css
            use: ['style-loader', 'css-loader'] // usa estos loaders.
          }
        ]
      },
      mode: 'production',          // 4. Compila en modo producción.
      watch: true,                 // 5. Webpack se queda observando cambios (si Gulp también está en watch).
      entry: './src/js/app.js',    // 6. Punto de entrada principal.
    }))
    .pipe(sourcemaps.init())       // 7. Inicia sourcemaps para debugging.
    // .pipe(concat('bundle.js')) // (Comentado, pero sirve si algún día querés concatenar varios JS).
    .pipe(terser())                // 8. Minifica el JS.
    .pipe(sourcemaps.write('.'))   // 9. Escribe los sourcemaps.
    .pipe(rename({ suffix: '.min' })) // 10. Renombra el archivo con `.min.js`.
    .pipe(dest('./public/build/js')) // 11. Lo guarda en la carpeta destino.
}


function imagenes() {
    return src(paths.imagenes)
        .pipe( cache(imagemin({ optimizationLevel: 3})))
        .pipe( dest('public/build/img'))
}

function versionWebp( done ) {
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe( webp(opciones) )
        .pipe( dest('public/build/img') )
    done();
}

function versionAvif( done ) {
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe( avif(opciones) )
        .pipe( dest('public/build/img') )
    done();
}

function dev(done) {
    watch( paths.scss, css );
    watch( paths.js, javascript );
    watch( paths.imagenes, imagenes)
    watch( paths.imagenes, versionWebp)
    watch( paths.imagenes, versionAvif)
    done()
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel( css, imagenes, versionWebp, versionAvif, javascript, dev) ;