// ------> Teacher
const user_id_type = document.getElementById("user_id").textContent.split("-")[0];

// course section

import { backTabReset } from "./teacher-lesson-sortable.js"; // to make edit mode none
import { backToDashboard, loadSubject } from "./std_page_navbar.js";

const courses_tab = document.getElementById("courses");
const subjects = document.querySelectorAll(".subject");

if (subjects && user_id_type === "TID") {
  courses_tab.querySelector("button").onclick = (e) => {
    // console.log(localStorage.getItem("isEditing") == true);
    if (localStorage.getItem("isEditing") === "true") {
      e.preventDefault();

      const confirmLeave = confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirmLeave) return;

      // Optional: clear editing flag if they confirmed
      localStorage.setItem("isEditing", false);
      backTabReset();
    }
    backToDashboard(courses_tab);
  }
  
  subjects.forEach(sub => {
    sub.addEventListener('click', ()=>{
      // console.log("hello");
      loadSubject(sub.querySelector("p").textContent);
      window.scrollTo({top: 0,  behavior: 'smooth' });
    });
  });
}

// link section

//generate link
const generate_link = document.getElementById("generate_link");
const copy_link = document.getElementById("copy_link");

if (user_id_type == "TID") {
  generate_link.onclick = () => {
    generateLink();

    // display div and count
    document.querySelector(".after-generate").classList.remove("hidden");
    insertClickedData(); // temporary data
  };
  copy_link.onclick = () => {
    copyText(document.getElementById("link_holder").value);
  }
}
// copy link

function copyText(text) {
  navigator.clipboard.writeText(text)
    .then(() => copied_tooltip())//show as tooltip
    .catch(err => console.error("Failed to copy:", err));
}

function copied_tooltip() {
  const elem =  document.querySelector(".copied");
  if (!elem) return;
  elem.classList.remove("translate-x-20", "opacity-0");
  elem.classList.add("translate-x-0", "opacity-100");
  
  setTimeout(() => {
    elem.classList.remove("translate-x-0", "opacity-100");
    elem.classList.add("translate-x-20", "opacity-0");
  }, 1000);
}
// expired duration
const duration = 2; // 2min


function startCountdown(expiryTime) {
  const countdownEl = document.getElementById("expiredTime");
  if (!countdownEl) return;

  function updateCountdown() {
    const remaining = expiryTime - Date.now();

    if (remaining <= 0) {
      clearInterval(timer);
      countdownEl.innerHTML ='<span class="text-red-500">Link expired!</span>';
      generate_link.disabled = false;
      localStorage.setItem("generate_disabled", false);
      return;
    }

    // generate_link.disabled = true; // to ensuyre generate btn is disabled
    const mins = Math.floor(remaining / 1000 / 60);
    const secs = Math.floor((remaining / 1000) % 60);
    countdownEl.textContent = `The link will expire in ${(mins * 60) + secs}s.`;
  }

  updateCountdown(); // 👈 Sync immediately on function call
  const timer = setInterval(updateCountdown, 1000);
}

function generateLink() {

  const id = Math.random().toString(36).substring(2, 10);
  const expiry = new Date(Date.now() + duration * 60 * 1000);
  
  const url = `${window.location.origin}/temp?id=${id}`;
  localStorage.setItem("tempLink", JSON.stringify({ id, expiry }));

  document.getElementById("link_holder").value = url;
  // document.getElementById("genLink").href = url;
  // document.getElementById("expiresAt").textContent = expiry.toLocaleString();
  generate_link.disabled = true;
  localStorage.setItem("generate_disabled", true);
  console.log("generate_link.disabled", generate_link.disabled);

  startCountdown(expiry.getTime());
  document.getElementById("expiredTime").classList.add("opacity-100");
}

// On page load, show existing link if not expired
function checkExistingLink() {
  const data = localStorage.getItem("tempLink");
  if (data) {
    const { id, expiry } = JSON.parse(data);
    const expDate = new Date(expiry);
    if (Date.now() < expDate.getTime()) {
      const url = `${window.location.origin}/temp?id=${id}`;
      document.getElementById("link_holder").value = url;
      // document.getElementById("genLink").href = url;
      // document.getElementById("expiresAt").textContent = expDate.toLocaleString();
      startCountdown(expDate.getTime());
      // console.log(generate_link.disabled);
      generate_link.disabled = localStorage.getItem("generate_disabled");

      // document.getElementById("expiredTime").classList.remove("opacity-0");
      document.getElementById("expiredTime").classList.add("opacity-100");


      // live attendance
      document.querySelector(".after-generate").classList.remove("hidden");
    } else {
      localStorage.removeItem("tempLink");
    }
  }
}

// first call
checkExistingLink();

// to check  across teacher and class teacher accounts
setInterval(checkExistingLink, 2000); // Check every 2 seconds


// display students who cclicked generated link demo (removing and inserting std randomly)
function insertClickedData() {
  fetch("./json/link_clicked.json")
    .then(response => response.json())
    .then(data => { 
      const keys = Object.keys(data);
      const randomKey = keys[Math.floor(Math.random() * keys.length)]; // may be Class A, B, C
      
      const unclickedBody = document.querySelector(".unclicked");
      const clickedBody = document.querySelector(".clicked");

      // first clear bodies
      unclickedBody.innerHTML = "";
      clickedBody.innerHTML = "";

      const lastElemUnclick = [...unclickedBody.children].at(-1); // to skip last p element
      const lastElemClick = [...clickedBody.children].at(-1);

      const students = data[randomKey];
      const totalStudents = students.length;
      const totalDuration = 1 * 60 * 1000; // 1 minute
      const intervalTime = totalDuration / totalStudents;

      const remainingRows = [];

      // Fill unclickedBody initially
      students.forEach(student => {
        const row = document.createElement("p");
        row.className = "p-1 text-white font-semibold";
        row.innerHTML = student;
        unclickedBody.insertBefore(row, lastElemUnclick);
        // remainingRows.push({ student, row });
      });

      const randomInsert = setInterval(() => {
        if (students.length === 0) {
          clearInterval(randomInsert);
          return;
        }

        const randomIndex = Math.floor(Math.random() * students.length);
        const student = students[randomIndex];
        students.splice(randomIndex, 1); // Remove the student from the array

        const row = document.createElement("p");
        row.className = "p-1 text-white font-semibold";
        row.innerHTML = student;

        clickedBody.insertBefore(row, lastElemClick);

        // Remove from unclickedBody
        const unclickedRows = unclickedBody.querySelectorAll("p");
        unclickedRows.forEach(unclickedRow => {
          if (unclickedRow.textContent === student) {
            unclickedRow.remove();
          }
        });

        // insert count
        document.querySelector(".clicked_count").textContent = clickedBody.querySelectorAll("p").length;
        document.querySelector(".unclicked_count").textContent = unclickedBody.querySelectorAll("p").length;

      }, intervalTime);
          
    })
    .catch(error => {
      console.error("Error fetching link clicked data:", error);
    });
}

// insertClickedData(); // initial call to insert data

////// Edit course content

export let isEditing = false;


//// Chart section

let chartInstance;
// updateChart();
// chart creation for TID is in class_teacher.js
if (user_id_type == "TID") {
  document.querySelector(".create-chart").onclick = () => {
    updateChart(0);
  }
} 


// Dummy data
const classLabels = ["Class A", "Class B", "Class C"];
const studentCounts = [20, 15, 30];
const totalStudents = parseInt(localStorage.getItem("each_class_totalStd") || 40); //studentCounts.reduce((a, b) => a + b, 0);


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



function updateChart(n) {
    document.querySelector(".switch-hide").classList.remove("hidden");
    // add today date
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    document.getElementById("today_stats").textContent = n === 0 ? `Today (${getShiftedDate(n)})` : `(${getShiftedDate(n)})`;
    // create chart
    const ctx = document.getElementById("stdChart").getContext("2d");
    document.getElementById("stdChart").classList.add("bg-cyan-900");

    // Destroy previous chart if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }
    const legendPosition = window.innerWidth >= 768 ? "right" : "top"; // Check screen size

    chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: classLabels,
            datasets: [{
                label: "Number of Students",
                data: studentCounts,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",   // Class A
                    "rgba(54, 162, 235, 0.6)",   // Class B
                    "rgba(255, 206, 86, 0.6)"    // Class C
                ],
                hoverBackgroundColor: [
                    "rgba(255, 99, 132, 0.8)",   // Class A
                    "rgba(54, 162, 235, 0.8)",   // Class B
                    "rgba(255, 206, 86, 0.8)"    // Class C
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)"
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                  display: true,
                  text: 'Each Class Attendance',
                  font: {
                    size: 20, // Title font size
                    weight: '' // Title font weight
                  },
                  color: 'white' // Title text color
                },
                legend: {
                    display: true,
                    position: legendPosition,
                    labels: {
                        generateLabels: function (chart) {
                            return chart.data.labels.map((label, i) => ({
                                text: `${label} - ${studentCounts[i]}/${totalStudents} students (${((studentCounts[i] / totalStudents) * 100).toFixed(1)}%)`,
                                fillStyle: chart.data.datasets[0].backgroundColor[i],
                                strokeStyle: chart.data.datasets[0].borderColor[i],
                                lineWidth: chart.data.datasets[0].borderWidth,
                                fontColor: 'white'
                            }));
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        titleColor: 'white',
                        label: function (context) {
                            const value = context.raw;
                            const percent = ((value / totalStudents) * 100).toFixed(1);
                            return `${value} students (${percent}%)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    max: totalStudents,
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(255, 255, 255, 0.2)' // Y-axis grid lines
                    },
                    ticks: {
                      color: 'white' // X-axis tick labels
                    },
                    title: {
                        display: true,
                        text: 'Number of Students',
                        color: 'white'
                    }
                },
                x: {
                    grid: {
                      color: 'rgba(255, 255, 255, 0.2)' // Y-axis grid lines
                    },
                    ticks: {
                      color: 'white' // X-axis tick labels
                    },
                    title: {
                        display: true,
                        text: 'Classes',
                        color: 'white'
                    }
                }
            },
            animation: {
              duration: 1000, // Smooth transition
              easing: 'easeInOutQuart' // Custom easing effect
            }
        },
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
} 

//preview attendance.csv
// const file = "./files/dummy_attendance.csv";
// function previewAttd() {
//   Papa.parse("./files/dummy_attendance.csv", {
//     download: true, // Required for file URLs
//     header: false,  // Set to true if your first row is column names
//     complete: function (results) {
//       const data = results.data;
//       const table = document.getElementById('csvTable');
//       table.innerHTML = '';
//       data.forEach((row, i) => {
//         const tr = document.createElement('tr');
//         row.forEach(cell => {
//           const td = document.createElement(i === 0 ? 'th' : 'td');
//           td.textContent = cell;
//           tr.appendChild(td);
//         });
//         table.appendChild(tr);
//       });
//     }
//   });
// }

// previewAttd();
