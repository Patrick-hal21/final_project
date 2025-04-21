// email-showcase dropdown
const group = document.getElementById("combogroup");
const input = document.getElementById("combobox");
const dropdown = document.getElementById("dropdown");
const toggle = document.querySelector(".togglecombo");

const pathToggleAction = () => {
    const isDisplay = !dropdown.classList.contains("hidden");
    if (isDisplay) {
        dropdown.classList.add("hidden");
        toggle.classList.remove("rotate-180");
    } else {
        dropdown.classList.remove("hidden");
        toggle.classList.add("rotate-180");
    }
    //dropdown.classList.toggle("hidden", isDisplay);
    //toggle.classList.toggle("rotate-180", true);
};


// this still works, but get undesirable result
/*
toggle.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent the click event from bubbling up to the group
    console.log("svg clicked");
    pathToggleAction();
});
*/

group.addEventListener("click", () => {
    //dropdown.classList.remove("hidden");

    // Dropdown action or other focusin logic
    pathToggleAction();

});

/*
document.querySelectorAll(".trying").forEach((element) => {
    if (element != toggle) {
    element.addEventListener("focusin", () => {
        console.log(`Focusin triggered on: ${element.className}`); // Example logic
        // Your focusin logic here
        pathToggleAction();
    });
    } else {
    console.log(`Focusin canceled on: ${element.className}`); // Example logic
    }
    
});
*/

group.addEventListener("focusout", (event) => {
    /*setTimeout(() => {
        dropdown.classList.add("hidden");
    }, 200); // Delay helps avoid immediate closure, and helps to change the input value
    */

    dropdown.classList.add("hidden");
    toggle.classList.remove("rotate-180");
    // to toggle dropdown svg action
    //pathToggleAction();
});


document.querySelectorAll("#dropdown li").forEach(item => {
    // if we want ot use click event, we must add delay before focus out in above codeblock
    item.addEventListener("mousedown", () => {

        if (item.textContent == "Change Account") {
            //window.location.href="./login_email.html"; // Clear the input value
            history.back();
        } else {
            pathToggleAction();
            input.value = item.textContent; // Set the input value to the clicked item
            
        }
        /*
        input.readOnly = false; // Make input editable
        input.readOnly = true; // Make input read-only again
        */
        //dropdown.classList.add("hidden");
        
        
    });
});




// for passcode //
const otpSlots = document.querySelectorAll(".pc-slot");

function moveFocus(current) {
    let index = Array.from(otpSlots).indexOf(current);

    // Remove red border if present
    if (current.value && index < otpSlots.length - 1 && /^\d*$/.test(current.value)) {
        if (otpSlots[index].classList.contains("focus:border-red-500")) {
            otpSlots[index].classList.remove("focus:border-red-500"); 
        } 
        // Clear error message if present
        if (document.getElementById("passErrorMsg").innerText) {
            document.getElementById("passErrorMsg").innerText = ""; 
        }
        // Move to the next field if input is present
        otpSlots[index + 1].focus();
    }
}

// to focus on first empt slot
function moveFocusToFirstEmpty() {
    for (let slot of otpSlots) {
        if (slot.value === "") {
            slot.focus(); // Focus on the first empty slot
            break;
        } 
    }
}

var prevFocusSlot; //to be refocus on visibility toggle
document.querySelector(".pc-slot-gp").addEventListener("focusin", (event)=> {
    prevFocusSlot = document.activeElement; // Store the currently focused slot
    moveFocusToFirstEmpty(); // Focus on the first empty slot when the group is focused
});

otpSlots.forEach((slot) => {
    slot.addEventListener("keypress", (event) => {
        if (!/\d/.test(event.key)) {
            event.preventDefault(); // Block non-digit characters
        }
    });

    // Handle focus movement (to prevent copy/paste)
    slot.addEventListener("input", () => {
        if (!/^\d*$/.test(slot.value)) {
            slot.value = slot.value.replace(/\D/g, ""); // Remove non-digit characters
        }
        moveFocus(slot); // Check focus logic
    });    
    
    slot.addEventListener("keydown", (event) => {
        let index = Array.from(otpSlots).indexOf(slot);

        if (event.key === "Backspace" && slot.value === "" && index > 0) {
            //console.log("Backspace pressed on empty slot");
            otpSlots[index - 1].value=""; // Move focus to the previous slot
            otpSlots[index - 1].focus(); // Handle Backspace key

        } else if (event.key === "Tab" && index !== 0) {
            event.preventDefault(); // Stop tabbing into other inputs
            otpSlots[0].focus();

        } else if (slot.value && index === otpSlots.length - 1) {
            //console.log("Reached last input");

            if (/^\d$/.test(event.key)) { // Regular expression to match single digit (0-9)
                slot.value = event.key; // Update only if it's a digit
            } else if (event.key === "Enter") {
                console.log("form submitted");
                const form = document.querySelector("form");
                if (form) {
                    form.action = "#"; // Set action URL
                    form.method = "POST"; // Set method
                    form.submit(); // Explicitly submit the form
                } 
            }

            /*else {
                console.log("Invalid input: Must be a digit");
            }
            //slot.value = event.key; // Already updated, no need to change
            */
        }  
    });
});

function toggleVisbile() {
    //
    const otpSlots = document.querySelectorAll(".pc-slot");

    for (let i=0; i < otpSlots.length; i++) {
        if (otpSlots[i].type=="password") {
        otpSlots[i].type="text";
        } else {
        otpSlots[i].type="password";
        }
    }
}

document.getElementById("showPasscode").addEventListener("click", (event) => {
    toggleVisbile(); // Call the function to toggle visibility

    if ([...otpSlots].every(slot => slot.value === "")) {
        if (prevFocusSlot === otpSlots[0]) { //prevFocusSlot is the last focused slot before visibility toggle , which is created above
            otpSlots[0].focus(); // Focus on the first empty slot
        }
        // Perform the action when all slots are free
        return; // Do nothing if all slots are empty
        // Replace this with your desired action
    } else {
        moveFocusToFirstEmpty(); // Keep focus on ongoing slot(Focus on the first empty slot when the group is focused)
    }
});


const form = document.querySelector("form");
//document.getElementById("submitBtn").addEventListener("click", (event) => {
form.onsubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    for (let slot of otpSlots) {
        if (slot.value === "") {
            slot.classList.add("focus:border-red-500");
            slot.focus(); // Focus on the first empty slot
            document.getElementById("passErrorMsg").innerText = "Please fill in all slots.";
            //hasEmptySlot = true; // Set the flag to true if any slot is empty
            return;
        }
    }
    
    if (form) {
        form.action = "#"; // Set action URL
        form.method = "POST"; // Set method
        form.submit();
    }
};
