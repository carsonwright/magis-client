// Gulpfile.js
// Require the needed packages
var gulp = require('gulp');
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var fileInclude = require("gulp-file-include");
var webserver = require('gulp-webserver');
var transform = require('coffee-react-transform');
var fs = require('fs');
var coffeescript = require('coffee-script');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var gulpHaml = require('gulp-haml');
var haml = require("haml");
var hamlJs = require("hamljs");


gulp.task('coffee', function() {
  gulp.src('./assets/coffee/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log).on('done', function(){
      gulp.start('scripts')
    }))
    .pipe(gulp.dest('./public/assets/js'))
});

gulp.task('haml', function(){
    partial = function(path){
      renderedHaml = haml.render(fs.readFileSync("./haml/" + path).toString());
      return renderedHaml;
    }

    gulp.src('./haml/**/*.haml').pipe(gulpHaml()).pipe(gulp.dest('./public'));
});

gulp.task('webserver', function() {
  gulp.src('public')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      port: 8080,
      open: true
    }));
});

gulp.task('scripts', function() {
  files = fs.readdirSync("./public/assets/js")
  js = ""
  for(index in files){
    fileName = files[index]

    tempJS = fs.readFileSync('./public/assets/js/'+fileName, 'utf8')
    if(fileName == "components.js"){
      components = tempJS
    }else{
      js += tempJS
    }
  }
  js = components + js
  fs.writeFileSync('./public/assets/application.js', js)
});

gulp.task('css', function() {
  gulp.src('./public/assets/css/*.css')
    .pipe(concat('application.css'))
  .pipe(gulp.dest('./public/assets/'))
});

gulp.task('react', function() {
  files = fs.readdirSync("./assets/react")
  components = ""
  for(index in files){
    fileName = files[index]
    components += fs.readFileSync('./assets/react/'+fileName, 'utf8') + "\n"
  }

  transformed = transform(components)
  js = coffeescript.compile(transformed, {bare: true})
  fs.writeFileSync('./public/assets/js/components.js', js)
})
gulp.task('sass', function () {
    gulp.src('./assets/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./public/assets/css'))
});
gulp.task('clean', function () {
  files = fs.readdirSync("./public/assets/js")
  for(index in files){
    fileName = files[index]
    fs.unlinkSync("./public/assets/js/"+fileName)
  }
  files = fs.readdirSync("./public/assets/css")
  for(index in files){
    fileName = files[index]
    fs.unlinkSync("./public/assets/css/"+fileName)
  }
});
watch = require('gulp-watch');

gulp.task('watch', function () {
  gulp.watch('./haml/**/*.haml', {}, function(){
    gulp.start('haml');
  })
  gulp.watch('./assets/**/*.coffee', {}, function(){
    gulp.start('coffee');
    gulp.start('react');
  })
  gulp.watch('./public/assets/js/*.js', {}, function(){
    gulp.start('scripts');
  })
  gulp.watch('./public/assets/css/*.css', {}, function(){
    gulp.start('css');
  })
  gulp.watch('./assets/**/*.scss', {}, function(){
    gulp.start('sass');
  })
  gulp.start(["coffee", "haml", "scripts", "sass", "css"])
});

gulp.task('default', ['react', 'coffee', 'sass', 'haml', 'watch', 'webserver']);
