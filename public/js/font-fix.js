// Safari font rendering fix - helps ensure fonts are properly loaded
(function () {
  // Detect Safari
  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  // Apply Safari-specific optimizations
  if (isSafari) {
    // Add Safari class to HTML for targeted CSS fixes
    document.documentElement.classList.add("safari");

    // Safari sometimes needs a little push to properly render fonts
    // This forces a reflow which helps with font rendering
    window.addEventListener("load", function () {
      document.body.style.display = "none";
      // Force reflow
      void document.body.offsetHeight;
      document.body.style.display = "";

      // Add class when fonts are definitely loaded
      setTimeout(function () {
        document.documentElement.classList.add("fonts-loaded-safari");
      }, 100);
    });
  } else {
    // For non-Safari browsers, just mark fonts as loaded
    document.documentElement.classList.add("fonts-loaded-safari");
  }
})();
