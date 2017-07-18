var gulp 		     = require('gulp');
var sass 		     = require('gulp-sass');
var minifyCss 	 = require('gulp-minify-css');
var notify 		   = require('gulp-notify');
var browserSync  = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var pug          = require('gulp-pug');
var coffeescript = require('gulp-coffeescript');
var uglify       = require('gulp-uglify');
var plumber      = require('gulp-plumber');
var reload       = browserSync.reload;

var paths = {
  css:['sass/main.sass'],
  sass:['sass/*'],
  html:['pug/index.pug'],
  pug:['pug/*'],
  script:['coffee/js.coffee'],
  output:['output'],
  js:['js']
};

gulp.task('mincss', function(){
  return gulp.src(paths.css)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(['last 15 versions', 'ie 8', 'ie 7'], { cascade: false }))
    .pipe(minifyCss())
    .pipe(gulp.dest('output'))
    .pipe(reload({stream:true}));
});

gulp.task('scripts', function(){
  return gulp.src(paths.script)
    .pipe(plumber())
    .pipe(coffeescript({bare: true}))
    .pipe(gulp.dest('js'))
    .pipe(uglify())
    .pipe(gulp.dest('output'))
    .pipe(reload({stream:true}));
});

gulp.task('html', function(){
  return gulp.src(paths.html)
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest('output'))
    .pipe(reload({stream:true}));
});

gulp.task('watcher',function(){
  gulp.watch(paths.sass, ['mincss']);
  gulp.watch(paths.pug, ['html']);
  gulp.watch(paths.script, ['scripts']);
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: "./output"
    },
    port: 8080,
    open: true,
    notify: false
  });
});

gulp.task('default', 
		 ['watcher',
 		  'browserSync'
		 ]);