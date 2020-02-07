var fs = require("fs");
var browserify = require("browserify");
var gulp = require("gulp");
var sass = require("gulp-sass");

gulp.task("react", function(done) {
  browserify("./client/index.js")
    .transform("babelify", { presets: ["env", "react"] })
    .bundle()
    .pipe(fs.createWriteStream("static/build.min.js"));
  done();
});

gulp.task("sass", function() {
  return gulp
    .src("./client/sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./static/css"));
});

gulp.task("apply-prod-environment", function(done) {
  process.stdout.write("Setting NODE_ENV to 'production'" + "\n");
  process.env.NODE_ENV = "production";
  if (process.env.NODE_ENV != "production") {
    throw new Error("Failed to set NODE_ENV to production!!!!");
  } else {
    process.stdout.write("Successfully set NODE_ENV to production" + "\n");
  }
  done();
});

gulp.task("serve", gulp.series("apply-prod-environment", "sass", "react"));

gulp.task("dev", function() {
  gulp.watch("client/**/*.scss", gulp.series("sass")),
    gulp.watch("client/**/*.js", gulp.series("react"));
  return;
});
