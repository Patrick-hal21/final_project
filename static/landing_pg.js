document.getElementById("to_nav_bar").onclick = () => document.getElementById("navbar").scrollIntoView({ behavior: 'smooth' });

document.querySelectorAll(".toLogin").forEach(item => {
    item.onclick = () => window.location.href = "./login_email.html";
    });