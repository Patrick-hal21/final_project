

// slide show
let currentIndex = 0;
const carousel = document.getElementById("carousel");
const slides = carousel.children;
//console.log(slides);
const totalSlides = slides.length;
let autoScroll = setInterval(nextSlide, 3000); // initial interval

function updateSlide() {
  const extraOffset = 16;
  carousel.style.transform = `translateX(calc(-${currentIndex * 100}% - ${currentIndex * extraOffset}px))`;
    //carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

}

function resetInterval() {
    clearInterval(autoScroll);
    autoScroll = setInterval(nextSlide, 3000);
  }

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlide();
    resetInterval();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlide();
    resetInterval();
}


const humburger_btn = document.getElementById("humburger-btn");
const close_sidebar = document.getElementById("close-sidebar");
const side_window = document.getElementById("sidebar");

humburger_btn.onclick = () => {

  if (side_window.classList.contains('opacity-0')) {
    
    sidebar.classList.remove('opacity-0', 'translate-x-[-100%]', 'pointer-events-none');
    sidebar.classList.add('opacity-100', 'translate-x-0', 'pointer-events-auto');
    document.body.style.overflow = "hidden"; // Disable scrolling on the body
  }
};

close_sidebar.onclick = () => {
  sidebar.classList.remove('opacity-100', 'translate-x-0', 'pointer-events-auto');
  sidebar.classList.add('opacity-0', 'translate-x-[-100%]', 'pointer-events-none');
  document.body.style.overflow = "auto"; // Enable scrolling on the body
};


document.querySelectorAll(".toLogin").forEach(item => {
    item.onclick = () => window.location.href = "./login_email.html";
    });
