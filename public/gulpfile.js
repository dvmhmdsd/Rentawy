const gulp = require("gulp"),
  autoprefixer = require("gulp-autoprefixer"),
  csso = require("gulp-csso"),
  image = require("gulp-imagemin");

gulp.task("prefix", () =>
  gulp
    .src("css/style.css")
    .pipe(
      autoprefixer({
        browsers: ["last 10 versions"]
      })
    )
    .pipe(gulp.dest("css"))
);

// minify css files
gulp.task("css-min", () =>
  gulp
    .src("css/style.css")
    .pipe(csso())
    .pipe(gulp.dest("css"))
);

gulp.task("image-min", () =>
  gulp
    .src("img-min/*")
    .pipe(image())
    .pipe(gulp.dest("images"))
);
