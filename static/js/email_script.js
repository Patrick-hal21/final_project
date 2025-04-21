// Add event listener to the input field to focus on it when the sibiling(icon) is clicked
const inputField = document.querySelector('.viaEmail'); // there is one more same input field with id name "email" below
document.querySelector('.pointToInput').addEventListener('focusin', () => {
    if (document.activeElement !== inputField) {
    inputField.focus();
    }
});

// Add event listener to the input field to focus on it when the parent div is clicked
document.querySelector('.groupToInput').addEventListener('focusin', () => {
    if (document.activeElement !== inputField) {
    inputField.focus();
    //document.removeEventListener('click', arguments.callee); // Remove the event listener after the first click
    }
});

const form = document.getElementById("emailForm");

form.onsubmit = function validateForm(event) {
//submitBtn.onclick = function validateForm() {
    var emailInput = document.getElementById("email").value;
    let atPos = emailInput.indexOf("@"); // Position of "@"
    let dotPos = emailInput.lastIndexOf("."); // Position of the last "."

    var providerName = emailInput.slice(atPos + 1, dotPos);
    var domainName = emailInput.slice(dotPos + 1)

    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var errorMessage = document.getElementById("error-message");
    

    errorMessage.classList.add("opacity-100"); // Make the error message visible
    if (emailInput === "") {
        //console.log("Empty");
        
        // should border color also be changed to red?
        document.querySelector(".groupToInput").classList.add("focus-within:border-red-500"); // Change the border color to red
        inputField.focus(); // Focus on the  input(class=viaEmail) itself 
        errorMessage.innerText= "Please fill out the email!";
        return false; // Prevent form submission

    } else if (!regex.test(emailInput) || providerName !== providerName.toLowerCase() || domainName !== domainName.toLowerCase()) {
        document.querySelector(".groupToInput").classList.add("focus-within:border-red-500"); // Change the border color to red
        inputField.focus();
        errorMessage.innerText= "Not a valid e-mail address!";
        return false; // Prevent form submission

    } else {
        errorMessage.classList.remove("opacity-100");
        //return true; // Allow form submission
        event.preventDefault(); // Prevent the default form submission
        window.location.href = "./login_pincode.html"; // Change to your desired HTML file
        // return true;
        // form.action = "./login_pincode.html"; // Change to your desired HTML file
        // form.method = "GET"; // or "POST" depending on your needs
        /*
        action = "./login_pincode.html"; // Change to your desired HTML file
        method = "GET"; // or "POST" depending on your needs
        navigateHtml(action, method);
        */
    }
};

/*
inputField.addEventListener("input", function() {

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputField.value)) {
    document.querySelector(".groupToInput").classList.remove("focus-within:border-red-500"); // Reset the border color
    document.querySelector(".groupToInput").classList.add("focus-within:border-green-500");
    document.getElementById("error-message").classList.remove("opacity-100");
    } else {
    document.querySelector(".groupToInput").classList.remove("focus-within:border-green-500"); // Reset the border color
    document.querySelector(".groupToInput").classList.add("focus-within:border-red-500"); // Change the border color to red
    document.getElementById("error-message").innerText = "Not a valid e-mail address!";
    document.getElementById("error-message").classList.add("opacity-100");
    }
});
*/

// still doesnt work
function navigateHtml(action, method) {
    const container = document.getElementById('container');
    // Add Tailwind's translate-x-full utility class for sliding out
    container.classList.add('transform', '-translate-x-full', 'transition', 'duration-800');
    // Wait for the animation to finish (500ms) before navigating
    setTimeout(() => {
    try {
        window.location.href = action;
    } catch (error) {
        console.error("Failed to navigate to the page:", error);
    }
    }, 800);
};
    