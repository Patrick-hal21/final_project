// ------> Teacher
const user_id_type = document.getElementById("user_id").textContent.split("-")[0];


// link section

//generate link
const generate_link = document.getElementById("generate_link");
const copy_link = document.getElementById("copy_link");

if (user_id_type == "TID") {
  generate_link.onclick = generateLink;
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
      console.log(generate_link.disabled);
      generate_link.disabled = localStorage.getItem("generate_disabled");

      // document.getElementById("expiredTime").classList.remove("opacity-0");
      document.getElementById("expiredTime").classList.add("opacity-100");
    } else {
      localStorage.removeItem("tempLink");
    }
  }
}

// first call
checkExistingLink();

// to check  across teacher and class teacher accounts
setInterval(checkExistingLink, 2000); // Check every 2 seconds


////// Edit course content

export let isEditing = false;


//// Chart section

let chartInstance;
// updateChart();
// chart creation for TID is in class_teacher.js
if (user_id_type == "TID") {
  document.querySelector(".create-chart").onclick = updateChart;
}


// Dummy data
const classLabels = ["Class A", "Class B", "Class C"];
const studentCounts = [20, 15, 30];
const totalStudents = 40; //studentCounts.reduce((a, b) => a + b, 0);

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
                legend: {
                    display: true,
                    position: legendPosition,
                    labels: {
                        generateLabels: function (chart) {
                            return chart.data.labels.map((label, i) => ({
                                text: `${label} - ${studentCounts[i]} students (${((studentCounts[i] / totalStudents) * 100).toFixed(1)}%)`,
                                fillStyle: chart.data.datasets[0].backgroundColor[i],
                                strokeStyle: chart.data.datasets[0].borderColor[i],
                                lineWidth: chart.data.datasets[0].borderWidth
                            }));
                        }
                    }
                },
                tooltip: {
                    callbacks: {
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
                    title: {
                        display: true,
                        text: 'Number of Students'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Classes'
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

document.getElementById("clear_chart").onclick = () => {
  
  document.getElementById("today_stats").textContent = "";
  if (!document.querySelector(".switch-hide").classList.contains("hidden")) {
    console.log("hello");
    document.querySelector(".switch-hide").classList.add("hidden");
  }
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
