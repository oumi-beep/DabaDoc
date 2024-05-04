window.addEventListener('scroll', function() {
  var backToTopButton = document.querySelector('.back-top-btn');
  if (window.scrollY > 300) {
      backToTopButton.classList.add('active');
  } else {
      backToTopButton.classList.remove('active');
  }
});
