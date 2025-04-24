const button = document.getElementById("to_nav_bar");

window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY;
    const pageHeight = document.body.scrollHeight;
    const oneThirdHeight = pageHeight / 3;

    // Show button after scrolling 1/3 of the page
    if (scrollPosition > oneThirdHeight) {
        button.classList.remove("opacity-0", "pointer-events-none");
        button.classList.add("opacity-100");
    } else {
        button.classList.remove("opacity-100");
        button.classList.add("opacity-0", "pointer-events-none");
    }
});
      
button.onclick = () => document.getElementById("navbar").scrollIntoView({ behavior: 'smooth' });

document.querySelectorAll(".toLogin").forEach(item => {
    item.onclick = () => window.location.href = "./login_email.html";
    });