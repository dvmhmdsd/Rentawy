let navbar = document.querySelector("nav.navbar");
$(function() {
  // show the dropdown on click
  $("button.dropdown-toggle").on("click", e => {
    e.stopPropagation();
    $("#drop_menu").addClass("block");
  });

  // hide the dropdown on click on body
  $("body").on("click", () => {
    $("#drop_menu").removeClass("block");
  });

  $(".prev_def").on("click", e => {
    e.preventDefault();
  });

  // modify the content of any modal when submit its content
  $("#reg, #login").each((i, form) => {
    form.addEventListener("submit", e => {
      setTimeout(() => {
        e.target.parentElement.innerHTML =
          '<img style="max-width: 100%; height: auto" src="/images/loading.gif" alt="loading...."/>';
        // e.target.parentElement.parentElement.classList.add("text-center");
      }, 1000);
    });
  });
  /* Start Navbar */
  if (
    location.href.indexOf("ads") > -1 ||
    location.href.indexOf("orders") > -1 ||
    location.href.indexOf("food") > -1 ||
    location.href.indexOf("pharma") > -1 ||
    location.href.indexOf("workers") > -1 ||
    location.href.indexOf("about") > -1
  ) {
    navbar.classList.add("back");
  }
  window.addEventListener("scroll", () => {
    if (window.pageYOffset >= 100 && !navbar.classList.contains("back")) {
      navbar.classList.add("back");
    } else if (
      window.pageYOffset < 100 &&
      !(
        location.href.indexOf("ads") > -1 ||
        location.href.indexOf("orders") > -1 ||
        location.href.indexOf("food") > -1 ||
        location.href.indexOf("pharma") > -1 ||
        location.href.indexOf("workers") > -1 ||
        location.href.indexOf("about") > -1
      )
    ) {
      navbar.classList.remove("back");
    }
  });

  $(".Section_Navbar .navbar-collapse .nav-item a.nav-link").click(function() {
    $(this)
      .parent(".Section_Navbar .navbar-collapse .nav-item")
      .addClass("active")
      .siblings()
      .removeClass("active");
  });

  /* End Navbar */

  // show the install button according to browser
  let installBtnFire = document.querySelector("#installApp_firefox");
  let installBtn = document.querySelector(".install");
  if (
    location.href.indexOf("ads/") == -1 &&
    location.href.indexOf("orders/") == -1 &&
    installBtnFire &&
    installBtn
  ) {
    if (navigator.userAgent.indexOf("Chrome") != -1) {
      installBtnFire.classList.add("d-none");
      installBtnFire.classList.remove("d-lg-block");
    }
  }

  // validate forms to check the emptyness
  $('input[type="text"], input[type="email"], input[type="password"]').each(
    (i, el) => {
      // creat a validate message and hide it
      let errorMessage = document.createElement("p");
      errorMessage.innerHTML = "this field is required";
      errorMessage.style.color = "tomato";
      errorMessage.style.display = "none";

      el.parentElement.append(errorMessage);
      el.addEventListener("keyup", () => {
        if (el.value == "") {
          el.style.border = "1px solid tomato";
          errorMessage.style.display = "block";

          // disable the submit button
          $('input[type="submit"]')
            .not("#searchBtn")
            .each((i, btn) => {
              btn.setAttribute("disabled", "true");
            });
        } else {
          el.style.border = "1px solid green";
          errorMessage.style.display = "none";
          // enable the submit button
          $('input[type="submit"]')
            .not("#searchBtn")
            .each((i, btn) => {
              btn.removeAttribute("disabled", "true");
            });
        }
      });
    }
  );

  // validate email address with regexp
  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !re.test(String(email).toLowerCase());
  }

  // validate forms to check the emptyness
  $('input[type="email"]')
    .not("#searchBtn")
    .each((i, el) => {
      // creat a validate message and hide it
      let errorMessage = document.createElement("p");
      errorMessage.innerHTML = "Enter a valid email";
      errorMessage.style.color = "tomato";
      errorMessage.style.display = "none";

      el.parentElement.append(errorMessage);
      // select the form that contain this input
      el.parentElement.parentElement.addEventListener("submit", e => {
        if (validateEmail(el.value)) {
          el.style.border = "1px solid tomato";
          errorMessage.style.display = "block";
          // disable the submit button
          $('input[type="submit"]')
            .not("#searchBtn")
            .each((i, btn) => {
              btn.setAttribute("disabled", "true");
            });
          e.preventDefault();
        } else {
          el.style.border = "1px solid green";
          errorMessage.style.display = "none";
          // enable the submit button
          $('input[type="submit"]')
            .not("#searchBtn")
            .each((i, btn) => {
              btn.removeAttribute("disabled", "true");
            });
        }
      });
    });

  // validate sign ups' password field to be at least 6 chars
  let errorMessage = document.createElement("p");
  $('#reg input[type="password"]').each((i, el) => {
    el.addEventListener("blur", e => {
      // let el = e.target;
      // creat a validate message and hide it
      errorMessage.innerHTML = "Password must be at least 6 chars";
      errorMessage.style.color = "tomato";
      errorMessage.style.display = "none";

      el.parentElement.append(errorMessage);
      if (el.value.length < 6) {
        el.style.border = "1px solid tomato";

        errorMessage.style.display = "block";

        // disable the submit button
        $('input[type="submit"]')
          .not("#searchBtn")
          .each((i, btn) => {
            btn.setAttribute("disabled", "true");
          });
      } else {
        el.style.border = "1px solid green";
        errorMessage.style.display = "none";
        // enable the submit button
        $('input[type="submit"]')
          .not("#searchBtn")
          .each((i, btn) => {
            btn.removeAttribute("disabled", "true");
          });
      }
    });
  });

  // remove the notification method after a while
  setTimeout(() => {
    $("#fade").remove();
  }, 8000);
  // edit the view on submit the edit form
  $("#orde").on("submit", e => {
    e.preventDefault();

    // console.log($("#orde").serializeArray());
    // convert the form value from array into object
    let form = {};

    let inputs = $("#orde").serializeArray();

    inputs.forEach(input => {
      form[input.name] = input.value;
    });
    console.log(form);
    // close the modal after submit
    $("#order_edit, .modal-backdrop").remove();

    // modify the content
    Object.keys(form).forEach(name => {
      $(`.${name}`).html(form[name]);
    });

    let itemId = $(e.target).data("id");
    // send form data to the server
    $.ajax({
      type: "POST",
      url: `/orders/edit/${itemId}`,
      data: form
    });

    // return the prev state of the UI after closing the modal
    $("body").removeClass("modal-open");
  });

  // delete order
  $("#delete").on("click", e => {
    e.preventDefault();
    let item = $(e.target).data("id");
    console.log(item);

    $.ajax({
      type: "DELETE",
      url: `/orders/${item}`,
      success: () => {
        alert("deleted");
        location.href = "/";
      }
    });
  });

  // delete ad
  $("#delete_ad").on("click", e => {
    e.preventDefault();
    let item = $(e.target).data("id");
    console.log(item);

    $.ajax({
      type: "DELETE",
      url: `/ads/${item}`,
      data: "hi",
      success: () => {
        alert("deleted");
        location.href = "/";
      }
    });
  });

  // delete a single ad comment
  let len = $("#len").val();
  for (let i = 0; i < len; i++) {
    $(`#delete_ad_com${i}`).on("click", e => {
      e.preventDefault();
      let item = $(e.target).data("id");
      // console.log(item)
      $.ajax({
        type: "POST",
        url: `/adcomment/${item}`,
        data: $("#ad_id").val()
      });
      $(`#comments${i}`).remove();
    });
  }

  // delete a single order comment
  let order_len = $("#order_len").val();
  // console.log(order_len);
  for (let i = 0; i < order_len; i++) {
    $(`#delete_order_com${i}`).on("click", e => {
      e.preventDefault();
      let item = $(e.target).data("id");
      // console.log(item)
      console.log($("#order_id").val());
      $.ajax({
        type: "POST",
        url: `/ordcomment/${item}`,
        data: $("#order_id").val()
      });
      $(`#comments${i}`).remove();
    });
  }

  // show the input of specific job for workers if the value of the selected option of #job select box is "worker"
  $("#job").on("change", () => {
    if ($("#job :selected").val() == "worker") {
      $("#worker").removeClass("d-none");
    } else {
      $("#worker").addClass("d-none");
    }
  });

  // handle the search request
  $("#search").on("submit", e => {
    e.preventDefault();
    let data = $("#search_select").val();
    $.ajax({
      type: "POST",
      url: "/search",
      data,
      success: data => {
        console.log(data.results);
        $("#searchm .modal-content").html("");
        data.results.forEach(result => {
          var html = `
            <a href="/ads/${result._id}">
              <div class="alert alert-success">${result.title}</div>
            </a>
          `;

          $("#searchm .modal-content").append(html);
        });
      }
    });
  });
});

window.addEventListener("load", () => {
  // add the class active to the 1st element in the slider
  if (
    document.querySelector(
      ".details .row .carousel-inner .carousel-item:first-child"
    )
  ) {
    document
      .querySelector(".details .row .carousel-inner .carousel-item:first-child")
      .classList.add("active");
  }

  let deferredPrompt;
  const addBtn = document.querySelector(".add-button");

  if (addBtn) {
    addBtn.style.display = "none";
  }

  window.addEventListener("beforeinstallprompt", e => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    addBtn.style.display = "block";

  });
      addBtn.addEventListener("click", e => {
        // hide our user interface that shows our A2HS button
        addBtn.style.display = "none";
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then(choiceResult => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the A2HS prompt");
          } else {
            console.log("User dismissed the A2HS prompt");
          }
          deferredPrompt = null;
        });
      });

  //   var deferredPrompt1;

  // window.addEventListener('beforeinstallprompt', function(e) {
  //   console.log('beforeinstallprompt Event fired');
  //   e.preventDefault();

  //   // Stash the event so it can be triggered later.
  //   deferredPrompt1 = e;

  //   return false;
  // });

  // addBtn.addEventListener('click', function() {
  //   if(deferredPrompt1 !== undefined) {
  //     // The user has had a postive interaction with our app and Chrome
  //     // has tried to prompt previously, so let's show the prompt.
  //     deferredPrompt1.prompt();

  //     // Follow what the user has done with the prompt.
  //     deferredPrompt1.userChoice.then(function(choiceResult) {

  //       console.log(choiceResult.outcome);

  //       if(choiceResult.outcome == 'dismissed') {
  //         console.log('User cancelled home screen install');
  //       }
  //       else {
  //         console.log('User added to home screen');
  //       }

  //       // We no longer need the prompt.  Clear it up.
  //       deferredPrompt1 = null;
  //     });
  //   }
  // });

  // add the background to navbar on load if the scroll is more than 100
  let navLink = document.querySelectorAll('.Section_Navbar nav ul.navbar-nav .nav-item button a.nav-link');
  if (window.pageYOffset >= 100 && !navbar.classList.contains("back")) {
    navbar.classList.add("back");
    navLink.forEach(link => {
      link.style.color = '#fff';
    })
  }
  }
);

// register the service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("serviceworker.js").then(() => {
    console.log('service worker registered', ServiceWorkerRegistration)
  })
}

