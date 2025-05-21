const user_id_type = document.getElementById("user_id").textContent.split("-")[0];

document.getElementById("stdBox").addEventListener("click", function() {
    document.getElementById("stdTimetable").click();

    // to change dash border color
    document.querySelector(".upload-box svg rect").classList.remove("stroke-gray-300");
    document.querySelector(".upload-box svg rect").classList.add("stroke-blue-500");

    // if (document.getElementById("stdBox").contains(document.getElementById("stdBox").querySelector("img"))) {
    //     document.querySelector(".upload-box svg rect").classList.remove("stroke-blue-500");
    // }
    
});

document.getElementById("trBox").addEventListener("click", function() {
    document.getElementById("trTimetable").click();
});

function updateTImetable (input, box) {
    document.getElementById(input).addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            img.onload = () => URL.revokeObjectURL(img.src); // Free memory
            document.getElementById(box).innerHTML = "";
            img.classList.add("w-full", "h-full");
            document.getElementById(box).appendChild(img);
        }
    });
}
updateTImetable("trTimetable", "trBox");
updateTImetable("stdTimetable", "stdBox");


//zoom link management
const zoom_link_holder = document.getElementById("zoom_link_holder");
// set value when loading
zoom_link_holder.value = localStorage.getItem("zoom-link");

const edit_zoom = document.querySelector(".edit-zoom");
// edit zoom link
edit_zoom.onclick = () => {

    // https://zoom.us/j/93256450585?pwd=ORP7IIsUXQqxlLdKjyhuR56JQKFftr.1
  // if this is done action
  if (edit_zoom.querySelector("span").textContent === "Done") {
    const inserted_value = zoom_link_holder.value;
    if (inserted_value === localStorage.getItem("zoom-link")) {
        console.log("same link");
    } else {
        if (isValidURL(inserted_value)) {
            localStorage.setItem("zoom-link", inserted_value);
            insertionComplete(); // default = true
        } else {
            console.log("invalid link");
            zoom_link_holder.value = localStorage.getItem("zoom-link"); // reasign original value
            insertionComplete(false);
        }
    }
  }

  zoom_link_holder.readOnly = !zoom_link_holder.readOnly;
  zoom_link_holder.classList.toggle("focus:border-[#F6802F]"); // orange
  zoom_link_holder.classList.toggle("focus:ring-2");
  zoom_link_holder.classList.toggle("focus:ring-[#F6802F]");
  zoom_link_holder.focus();

  edit_zoom.querySelector(".edit").classList.toggle("hidden");
  edit_zoom.querySelector(".done").classList.toggle("hidden");
  edit_zoom.querySelector("span").textContent = zoom_link_holder.readOnly ? "Edit": "Done";
  
};

// to check ibserted lin is valid or not
function isValidURL(text) {
  try {
    new URL(text);
    return true; // valid URL
  } catch (_) {
    return false; // invalid URL
  }
}

// to notify user after insertion link
function insertionComplete(success = true) {
  const insert_noti = document.querySelector(".inserted");
  const msg = insert_noti.querySelector("p");

  if (success) {
    msg.textContent = "New Link inserted!";
    insert_noti.classList.remove("bg-red-500");
    insert_noti.classList.add("bg-teal-500");
  } else {
    msg.textContent = "Link insertion failed!";
    insert_noti.classList.remove("bg-teal-500");
    insert_noti.classList.add("bg-red-500");
  }

  insert_noti.classList.remove("translate-x-20", "opacity-0");
  insert_noti.classList.add("translate-x-0", "opacity-100");

  setTimeout(() => {
    insert_noti.classList.remove("translate-x-0", "opacity-100");
    insert_noti.classList.add("translate-x-20", "opacity-0");
  }, 1500);
}

// Charts

let chartInstance;
// updateChart();
// chart creation for TID is in class_teacher.js
if (user_id_type == "CTID") {
  document.querySelector(".create-chart").onclick = updateChart;
}

function updateChart() {
    document.querySelector(".switch-hide").classList.remove("hidden");
    // add today date
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    document.getElementById("today_stats").textContent = `Today (${formattedDate})`;
    // create chart
    const ctx = document.getElementById("stdChart").getContext("2d");

    // Destroy previous chart if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Math', 'Science', 'English', 'History', 'Geography', 'Art'],
            datasets: [
            { label: 'Class A', data: [30, 25, 28, 22, 20, 18], backgroundColor: 'rgba(255, 99, 132, 0.7)', hoverBackgroundColor: 'rgba(255, 99, 132, 0.9)' },
            { label: 'Class B', data: [25, 30, 27, 24, 22, 20], backgroundColor: 'rgba(54, 162, 235, 0.7)', hoverBackgroundColor: 'rgba(54, 162, 235, 0.9)' },
            { label: 'Class C', data: [20, 22, 25, 30, 28, 26], backgroundColor: 'rgba(255, 206, 86, 0.7)', hoverBackgroundColor: 'rgba(255, 206, 86, 0.9)' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            
            scales: { y: { beginAtZero: true } },
            animation: {
              duration: 1000, // Smooth transition
              easing: 'easeInOutQuart' // Custom easing effect
            }
        }
    });
}