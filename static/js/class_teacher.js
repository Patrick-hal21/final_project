const user_id_type = document.getElementById("user_id").textContent.split("-")[0];

// Set up the focusin listener once
// document.getElementById("stdBox").addEventListener("focusin", () => {
//   const rect = document.querySelector(".upload-box svg rect");
//   if (rect) {
//     rect.classList.remove("stroke-gray-300");
//     rect.classList.add("stroke-blue-500");
//   }
// });

const stdBox = document.getElementById("stdBox");
const stdInput = document.getElementById("stdTimetable");
const stdRect = document.querySelector(".std svg rect");

const trBox = document.getElementById("trBox");
const trInput = document.getElementById("trTimetable");
const trRect = document.querySelector(".tr svg rect");

stdBox.querySelector("img").src = localStorage.getItem("SID_timetable") || "./static/images/timetable_colored.png";
// trBox.querySelector("img").src = localStorage.getItem("TID_timetable") || "./static/images/timetable_colored.png";

function focusInput (box, input, rect) {
  box.addEventListener("mousedown", function() {
    input.click();

    //   // to change dash border color
    rect.classList.remove("stroke-gray-300");
    rect.classList.add("stroke-blue-500");
  });

  box.addEventListener("mouseout" , () => {
    rect.classList.remove("stroke-blue-500");
    rect.classList.add("stroke-gray-300");
  })
}


focusInput(stdBox, stdInput, stdRect);
focusInput(trBox, trInput, trRect);

document.getElementById("trBox").addEventListener("click", function() {
    document.getElementById("trTimetable").click();
});

// image remove btn
const remove_stdImage = document.querySelector(".std-remove");
const remove_trImage = document.querySelector(".tr-remove");

// tooltip
const std_img_tooltip = document.querySelector(".std-tooltip");
const tr_img_tooltip = document.querySelector(".tr-tooltip");

import { resSubjects, show_text_on_hover } from "./std_page_navbar.js"; // tooltip

let timetables = {};

function updateTimetable (input, box, rm_btn) {
  clearImage(document.getElementById(box), rm_btn);
  document.getElementById(input).addEventListener("change", function(event) {
      const file = event.target.files[0];
      if (file) {
          // const img = document.createElement("img");
          // img.src = URL.createObjectURL(file);
          // img.onload = () => URL.revokeObjectURL(img.src); // Free memory
          // document.getElementById(box).innerHTML = "";
          // img.classList.add("w-full", "h-full");
          // document.getElementById(box).appendChild(img);

          //for backend
          // const formData = new FormData();
          // formData.append("image", file); // "image" is the key the backend expects

          // to test 
          const reader = new FileReader();
          reader.onload = () => {
            if (box === "stdBox") {
              timetables['SID_timetable'] = reader.result;
            } else {
              timetables['TID_timetable'] = reader.result;
            }
            
            // Store base64 string in localStorage
            // localStorage.setItem("timetable_img", reader.result); // base64

            // Set image src to preview
            const img = document.createElement("img");
            img.src = reader.result;
            document.getElementById(box).innerHTML = "";
            img.classList.add("w-full", "h-full", "object-contain");
            document.getElementById(box).appendChild(img);
          };
          reader.readAsDataURL(file);

          document.getElementById(box).classList.add("border"); // add border to div

          // some codes here to send image to backend
          // here
      }
  });
}

show_text_on_hover(remove_stdImage, std_img_tooltip);
show_text_on_hover(remove_trImage, tr_img_tooltip);

updateTimetable("trTimetable", "trBox", remove_trImage);
updateTimetable("stdTimetable", "stdBox", remove_stdImage);

// clear image
function clearImage(box, btn) {
  btn.addEventListener('click', () => {
    // console.log("hello");
    const img = box.querySelector("img");
    // console.log(img);
    if (img) {
      img.remove();

      box.classList.remove("border"); // remove border if there is no img

      // reinsert original image placeholder
      addImageHolder(box, box.id === "stdBox"); // idea from chatGPT :)
    }
  });
}

function addImageHolder(box, std = true) {
  const temp = document.getElementById("add-img-holder");
  const clone = temp.content.cloneNode(true); //deep clone the content of template

  const span = clone.querySelector("span");
  if (span) {
    span.textContent = std ? "Student's Timetable" : "Teacher's Timetable";
  } 

  box.appendChild(clone);
}

const edit_img_btn = document.querySelector(".edit-img");

edit_img_btn.addEventListener("click", () => {
  edit_img_btn.querySelector(".edit").classList.toggle("hidden");
  edit_img_btn.querySelector(".done").classList.toggle("hidden");

  remove_stdImage.classList.toggle("hidden");
  remove_stdImage.classList.toggle("opacity-50");

  remove_trImage.classList.toggle("hidden");
  remove_trImage.classList.toggle("opacity-50");

  edit_img_btn.querySelector("span").textContent = edit_img_btn.querySelector("span").textContent === "Edit" ? "Done" : "Edit";

  // toggle pointer-events-none
  document.querySelector(".std").classList.toggle("pointer-events-none");
  document.querySelector(".tr").classList.toggle("pointer-events-none");

  if (edit_img_btn.querySelector("span").textContent === "Edit") { // because when user click Done, text is changed to Edit
    saveImg();
    
  }
})

function saveImg() {

  // console.log(timetables);

  if (Object.keys(timetables).length !== 0) {
    for (const [key, value] of Object.entries(timetables)) {
      localStorage.setItem(key, value);
    }
  } else {
    console.log("dict is empty!");
  }
}
// clearImage(stdBox, remove_stdImage);
// clearImage(trBox, remove_trImage);



//zoom link management
const zoom_link_holder = document.getElementById("zoom_link_holder");
// set value when loading
zoom_link_holder.value = localStorage.getItem("zoom-link") || "https://zoom.us/j/93256450585?pwd=ORP7IIsUXQqxlLdKjyhuR56JQKFftr.1";

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
  msg.classList.add("text-white");

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

// console.log(resSubjects);  // to generate random subjects ( that const is imported from std_page)

let chartInstance;
// updateChart();
// chart creation for TID is in class_teacher.js
if (user_id_type == "CTID") {
  document.querySelector(".create-chart").onclick = () => {
    updateChart(0);
  }
}

// to add today date
function getShiftedDate(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

let n = 0;
document.querySelector(".to-prev").addEventListener("click", () => {
  if (n-1 > -8) { // alows a week
    n--;
    updateChart(n);
  }
});

document.querySelector(".to-next").addEventListener("click", () => {
  if (n+1 < 8) { // alows a week
    n++;
    updateChart(n);
  }
});

const totalStudents = 40;

// for pie charts
let pieCharts = [];
const pie_chart_holder = document.getElementById("single-charts");

function updateChart(n) {
    if (document.querySelector(".switch-hide").classList.contains("hidden")) {
      document.querySelector(".switch-hide").classList.remove("hidden");
    }

    document.getElementById("today_stats").textContent = n === 0 ? `Today (${getShiftedDate(n)})` : `(${getShiftedDate(n)})`;
    // create chart
    const ctx = document.getElementById("stdChart").getContext("2d");
    document.getElementById("stdChart").classList.add("bg-gray-200");

    // data labels
    const labels = resSubjects;

    // Destroy previous chart if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }
    chartInstance = createBarChart(ctx, labels);


    if (pieCharts) {
      pieCharts.forEach(chart => chart.destroy());
      pieCharts = [];
    }

    resSubjects.forEach(sub => {
      const div = createCanvas();
      pie_chart_holder.appendChild(div);

      const canvas = div.querySelector("canvas");
      const chart = createPieChart(canvas.getContext("2d"), sub);
      pieCharts.push(chart);
    });
}

function createCanvas() {
  const div = document.createElement('div');
  div.className = 'pie-chart w-full h-full flex';

  const canvas = document.createElement("canvas");
  canvas.className = "sm:flex-1 w-full h-full p-2 bg-gray-200 shadow-lg";

  div.appendChild(canvas);
  return div;
}

function createBarChart(ctx, labels) {
   return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { label: 'Class A',
              data: [30, 25, 28, 22, 20, 18], // retrieve from backend
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
              hoverBackgroundColor: 'rgba(255, 99, 132, 0.9)' 
          },
          { label: 'Class B',
            data: [25, 30, 27, 24, 22, 20], 
            backgroundColor: 'rgba(54, 162, 235, 0.7)', 
            hoverBackgroundColor: 'rgba(54, 162, 235, 0.9)' 
          },
          { label: 'Class C', 
            data: [20, 22, 25, 30, 28, 26], 
            backgroundColor: 'rgba(255, 206, 86, 0.7)', 
            hoverBackgroundColor: 'rgba(255, 206, 86, 1)' 
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        
        scales: { 
          y: {
                max: totalStudents,
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Students',
                    font: {
                      size : 16,
                      weight : 'bold'
                    }
                }
              },
          x: {
              title: {
                  display: true,
                  text: 'Subjects',
                  font: {
                      size : 16,
                      weight : 'bold'
                    }
              }
          }
      },
        animation: {
          duration: 1000, // Smooth transition
          easing: 'easeInOutQuart' // Custom easing effect
        }
      }
  });
}


// create pie chart
function createPieChart(ctx, subject) {
  return new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ["Present", "Absence"],
      datasets: [{
        label: '',
        data: [30, 20], // presence and absence
        backgroundColor: ['#FF6384', '#36A2EB'],
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        },
        datalabels: {
          color: '#fff',
          font: {
            size: window.innerWidth < 650 ? 13 : 15,
            weight: 'bold'
          },
          formatter: (value, ctx) => {
            const total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${percentage}%`;
          }
        },
        // Optional: Title plugin if you want to display subject as chart title
        title: {
          display: true,
          text: subject,
          font : {
            size: 16
          }
        }
      }
    },
    plugins: [ChartDataLabels] // Register the plugin here
  });
}

document.getElementById("clear_chart").onclick = () => {
  
  document.getElementById("today_stats").textContent = "";
  if (!document.querySelector(".switch-hide").classList.contains("hidden")) {
    // console.log("hello");
    document.querySelector(".switch-hide").classList.add("hidden");
  }
  document.getElementById("stdChart").classList.remove("bg-gray-200");
  chartInstance.destroy();

  pieCharts.forEach(chart => chart.destroy()); // clear charts
  document.getElementById("single-charts").innerHTML=''; // clear div

  // destroy pie charts
} 

let report_file = "./files/dummy_attendance.csv";
document.querySelector(".view-report").onclick = () => {
  
  viewReports(report_file, true);
  localStorage.setItem("view_report", true);

}

// view reports (csv file)

function viewReports(file, std=false) {
  fetch(file) // Use relative path if local
  .then(response => response.text())
  .then(text => {
    const rows = text.trim().split('\n').map(row => row.split(','));

    const table = document.getElementById('csvTable');
    table.innerHTML = '';

    rows.forEach((row, i) => {
      const tr = document.createElement('tr');
      row.forEach((cell, index) => {
        const lastCell = row.length - 1 === index;

        const td = document.createElement(i === 0 ? 'th' : 'td');
        td.textContent = cell.trim();
        if (i === 0) {
          // Header cell
          td.className = 'sticky top-0 bg-gray-200 z-10 border px-2 py-1';
        } else {
          // Body cell
           td.className = 'border border-black px-2 py-1';
          if (lastCell) {
            if (td.textContent === "Present") {
              td.classList.add('text-green-600');
            } else if (td.textContent === "Absence" || parseFloat(td.textContent) < 50) {
              td.classList.add('text-red-600');
            }
          }
        }
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
  })
  .catch(err => console.error('Error loading CSV:', err));
}

document.getElementById("clear_report").onclick = () => {
  document.getElementById("csvTable").innerHTML = '';
  localStorage.setItem("view_report", false);
};

window.onload = () => {
  localStorage.setItem("view_report", false);
}

// to check only one box
document.querySelectorAll('input.user-type').forEach(checkbox => {
  checkbox.addEventListener('change', function () {
    if (this.checked) {
      // Uncheck all others
      if (this.value === "student") {
        report_file = "./files/dummy_attendance.csv";
      } else {
        report_file = "./files/teacher_attendance.csv";
      }
      document.querySelectorAll('.user-type').forEach(cb => {
        if (cb !== this) cb.checked = false;
      });

      // if data is on view (meaning that while data is displayed)
      if (localStorage.getItem("view_report") === "true") {
        viewReports(report_file);
      }
    }
  });
});