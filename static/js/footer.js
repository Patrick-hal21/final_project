const button = document.getElementById("to_nav_bar");
const footer = document.getElementById("footer");

window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY;
    const pageHeight = document.body.scrollHeight;
    const oneThirdHeight = pageHeight / 3;

    const buttonRect = button.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();

    const isOverlapping = !(buttonRect.bottom < footerRect.top ||
                            buttonRect.top > footerRect.bottom ||
                            buttonRect.right < footerRect.left ||
                            buttonRect.left > footerRect.right);

    // Show button after scrolling 1/3 of the page
    if (scrollPosition > oneThirdHeight) {
        button.classList.remove("opacity-0", "pointer-events-none");

        // Remove both opacities before adding the right one
        button.classList.remove("opacity-80", "opacity-100");
        button.classList.add(isOverlapping ? "opacity-100" : "opacity-80", "hover:opacity-100");
    } else {
        // Hide button
        button.classList.remove("opacity-80", "opacity-100");
        button.classList.add("opacity-0", "pointer-events-none");
    }
});
      
button.onclick = () => document.getElementById("navbar").scrollIntoView({ behavior: 'smooth' });