var fs = require("fs")
var browserify = require("browserify")
var gulp = require("gulp")
var sass = require("gulp-sass")
var minify = require("gulp-csso")
var buffer = require("vinyl-buffer")
var source = require("vinyl-source-stream")
var uglify = require("gulp-uglify")

gulp.task("build", function() {
  return browserify({
    entries: "./client/components/index.js",
    extensions: [".jsx"],
    debug: true
  })
    .transform("babelify", { presets: ["env", "react"] })
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest("static"))
})

gulp.task("react", function(done) {
  browserify("./client/components/index.js")
    .transform(
      "babelify",
      { presets: ["env", "react"] },
      {
        global: true, // also apply to node_modules
        NODE_ENV: "production"
      }
    )
    .bundle()
    .pipe(fs.createWriteStream("static/build.min.js"))
  done()
})

gulp.task("sass", function() {
  return gulp
    .src("./client/sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./static/css"))
    .pipe(minify())
    .pipe(gulp.dest("./static/css"))
})

gulp.task("apply-prod-environment", function(done) {
  process.stdout.write("Setting NODE_ENV to 'production'" + "\n")
  process.env.NODE_ENV = "production"
  if (process.env.NODE_ENV != "production") {
    throw new Error("Failed to set NODE_ENV to production!!!!")
  } else {
    process.stdout.write("Successfully set NODE_ENV to production" + "\n")
  }
  done()
})

gulp.task("serve", gulp.series("apply-prod-environment", "sass", "react"))

gulp.task("dev", function() {
  gulp.watch("client/**/*.scss", gulp.series("sass")),
    gulp.watch("client/components/**/*.js", gulp.series("react"))
  return
})
