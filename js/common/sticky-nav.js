document.addEventListener("DOMContentLoaded", function() {
  window.onscroll = function() {
    const nav = document.getElementById("nav");
    const sticky = nav.offsetTop;

    if (window.pageYOffset > sticky) {
      nav.classList.add("fixed");
    } else {
      nav.classList.remove("fixed");
    }
  };
});
