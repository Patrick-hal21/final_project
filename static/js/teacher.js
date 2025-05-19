// ------> Teacher
const user_id_type = document.getElementById("user_id").textContent.split("-")[0];


// link section

//generate link
const generate_link = document.getElementById("generate_link");
const copy_link = document.getElementById("copy_link");

generate_link.onclick = generateLink;

// copy link
copy_link.onclick = () => {
  copyText(document.getElementById("link_holder").value);
}
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


async function startCountdown(expiryTime) {
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

    const mins = Math.floor(remaining / 1000 / 60);
    const secs = Math.floor((remaining / 1000) % 60);
    countdownEl.textContent = `The link will expire in ${(mins * 60) + secs}s.`;
  }

  updateCountdown(); // 👈 Sync immediately on function call
  const timer = setInterval(updateCountdown, 1000);
}

async function generateLink() {

  const id = Math.random().toString(36).substring(2, 10);
  const expiry = new Date(Date.now() + duration * 60 * 1000);
  
  const url = `${window.location.origin}/temp?id=${id}`;
  localStorage.setItem("tempLink", JSON.stringify({ id, expiry }));

  document.getElementById("link_holder").value = url;
  // document.getElementById("genLink").href = url;
  // document.getElementById("expiresAt").textContent = expiry.toLocaleString();
  generate_link.disabled = true;
  localStorage.setItem("generate_disbaled", true);
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

const edit_btn = document.querySelector(".edit-btn");
const done_btn = document.querySelector(".done-btn");

import { sortable } from "./teacher-lesson-sortable.js"; // to allow divs to drag and place
import { makeResizableDivs } from "./teacher-lesson-sortable.js"; // to allow divs to resize ( not used yet)

// in edit state, custom div will be modified
edit_btn.onclick = () => {
  done_btn.classList.remove("hidden");
  edit_btn.classList.add("hidden");

  isEditing = true; // enable reloading alert
  if (isEditing) {
    sortable.option("disabled", false); // Enable sorting when not in editing mode 
    // makeResizableDivs(); // make div resizable
  }

  // toggle edit mode and normal mode to elements (here edit mode)
  modifiedElements();

  // makeAtagInsertable(); // make a tag insertable

}

function modifiedElements() {
  // make changes to element to be editable
  document.querySelector(".add-new-lesson").classList.toggle("hidden"); // add new lesson button

  document.querySelectorAll(".lesson-div").forEach(lesson => {
    lesson.classList.toggle("h-[200px]");
    lesson.classList.toggle("bg-gray-100");
    lesson.classList.toggle("cursor-move");
    // lesson.classList.toggle("shadow-md");
  });
  document.querySelectorAll(".lesson-div > div").forEach(lesson => {
    lesson.classList.toggle("border-r-0");
  });
  document.querySelectorAll(".lesson-div p").forEach(lesson => { // Lesson name
    lesson.classList.toggle("border");
    lesson.classList.toggle("p-2");
    lesson.setAttribute("contenteditable", lesson.getAttribute("contenteditable") !== "true");
  });
  document.querySelectorAll(".editable").forEach(div => {
    div.classList.toggle("divide-x-[2px]");
    div.classList.toggle("divide-x-gray-500/50");
    div.classList.toggle("mx-3");
    div.classList.toggle("ml-3");
    div.classList.toggle("md:ml-6");
    div.classList.toggle("lg:ml-12");

    div.classList.toggle("flex-1");
    div.classList.toggle("space-y-4");
  });
  document.querySelectorAll(".editable a").forEach(div => {
    div.setAttribute("contenteditable", div.getAttribute("contenteditable") !== "true");
    div.classList.toggle("border");
    div.classList.toggle("focus-link");
    div.classList.toggle("p-2");

    div.classList.toggle("link"); // toggle hover effect
  });
  document.querySelectorAll(".del-lesson").forEach(div => {
    div.classList.toggle("hidden");
    div.classList.toggle("flex");
  });
}

// modified a tag(optional , unused)
const ori_a_href = [];
const modified_a_href = [];

function makeAtagInsertable() {
  // from std_page_navbar.js
  document.querySelectorAll('.file-link').forEach(link => {
    const cur_url = link.getAttribute('href');
    ori_a_href.push(cur_url); // store original href

    if (cur_url) { 
      console.log(cur_url);
      link.setAttribute('href', link.getAttribute("href") !== "true"); // temporarily remove href
      link.textContent = cur_url; //show the file name
    }
  });
}

const inputs = document.querySelectorAll('[class*="file-input"]').length;
for (let i=1; i < inputs + 1; i++ ) {
  const f = `file-input${i}`;
  fileAndInput(document.querySelector(`.${f}`), document.getElementById(f));
}
// file input (clicking file will trigger input of file type)
function fileAndInput(class_file_link, id_file_input) {
  class_file_link.onclick = (event) => {
    if (isEditing) {
      event.preventDefault();
      id_file_input.click();
    } 
  };
  id_file_input.addEventListener("change", function () {
    const file = this.files[0];
    const fileName = file.name;
    if (fileName) {
      if (fileName !== class_file_link.textContent) {
        console.log(this.files);

        const blobUrl = URL.createObjectURL(this.files[0]); // create temporary URL (to be able to view file)

        class_file_link.setAttribute('href', blobUrl);
        class_file_link.textContent = fileName;
      }
    }
  });
}

//to insert element (create separate file)

/// -----here ----- (template element)
document.querySelector(".add-new-lesson").addEventListener("click", () => {
    addNewLesson();
});

function addNewLesson() {
  // retrieve card and count
  const cur_card_count = document.querySelectorAll(".card").length;
  const cur_input_count = document.querySelectorAll(".card input").length;

  const template = document.getElementById("lesson-input-template");
  console.log(template);
  const clone = template.content.cloneNode(true); // deep clone

  // Select specific elements inside the template
  const mainDiv = clone.querySelector(".lesson-div");
  mainDiv.classList.add("card"); // add card class to div
  mainDiv.setAttribute("data-id", cur_card_count + 1); // set data-id to div

  const inputs = clone.querySelectorAll("input[type='file']");
  const atags = clone.querySelectorAll("a.file-link");

  for (let i=1; i < inputs.length +1; i++) {
    const v = `file-input${cur_input_count + i}`;
    inputs[i-1].id = v; // set id
    atags[i-1].classList.add(v); // add class to a tag
    atags[i-1].setAttribute("contenteditable", "true"); // set contenteditable to ftrue

    // add file to inpu trigger event
    fileAndInput(clone.querySelector(`.${v}`), clone.getElementById(v));
  }

  // add remove card
  clone.querySelector(".del-lesson-btn").addEventListener("click", (event) => {
    event.preventDefault();
    const card = event.target.closest(".card");
    if (card) {
      card.remove();
    }
  });

  const cards = document.querySelectorAll(".card");
  if (cards.length > 0) {
    const lastCard = cards[cards.length - 1];
    lastCard.after(clone); // Insert right after the last .card
  } else {
    // If no .card exists, append to the container
    document.getElementById("sortableDivs").appendChild(clone);
  }
}

// if all a tags textcontet are empyt remove it

function removeEmptyDiv() {
  document.querySelectorAll(".card").forEach(card => {
    const atags = card.querySelectorAll("a.file-link");
    atags.forEach(atag => {
      if (atag.textContent.trim() === "") {
        card.remove(); // remove empty a tag
      }
    });
  });
}

// delete lesson
document.querySelectorAll(".del-lesson-btn").forEach(del => {
  del.onclick = (event) => {
    event.preventDefault();
    const card = event.target.closest(".card");
    if (card) {
      card.remove();
    }
  };
});

// to save link changes (optional , unused)
function confirmAtag() {
  // Set a tag according to filename
  document.querySelectorAll('.file-link').forEach(link => {
    const url = link.getAttribute('href');
    if (url) {
      const fileName = url.split('/').pop(); // Get just the file name
      link.textContent = fileName; // Set it as the visible link text
    }
  });
}


// to prevent reloading while in editing (browser will alert)
window.addEventListener("beforeunload", (e) => {
  if (isEditing) {
    e.preventDefault();
  }
})

// custom confirmation box to be toggled
const alert_box= document.querySelector(".alert-box");

done_btn.onclick = () => {
  // console.log("done");
  
  // const confirmed = confirm("Are you sure you want to save the changes?"); // built in confirm box (we wont use)
  // show custom confirmation box
  alert_box.classList.remove("hidden");
  document.querySelector("body").classList.add("overflow-hidden"); // disallows scrolling
  trySave(); // save changes
}

// needed funcs for custom confirmation box
function user_confirm() {
  return new Promise((resolve) => {

    confirm_changes.onclick = () => {
      isEditing = false; // disable browser reloading alert
      if (!isEditing) {
        sortable.option("disabled", true); // Disable sorting when not in editing mode
      }
      alert_box.classList.add("hidden");
      resolve(true);
    };

    cancel_changes.onclick = () => {
      alert_box.classList.add("hidden");
      resolve(false);
    };
  });
}

// get user click on confirm or cancel
async function trySave() {
  const confirmed = await user_confirm();
  if (confirmed) {
    // saveChanges(); // your custom save function

    edit_btn.classList.remove("hidden");
    done_btn.classList.add("hidden");
    
    document.querySelector("body").classList.remove("overflow-hidden"); // reallows scrolling

    // toggle edit mode and normal mode to elements (here normal mode)
    modifiedElements();

    storeElements(); // store elements in local storage

    removeEmptyDiv(); // remove empty card

  } else {
    console.log("User canceled save.");
    document.querySelector("body").classList.remove("overflow-hidden"); // reallows scrolling
  }
}

function storeElements() {
  const items = Array.from(document.getElementById("sortableDivs").children);

  //just only rearranging divs
  const newOrder = items
  .filter(item => item.dataset.id !== undefined) // omit divs without data-id
  .map(item => item.dataset.id);

  localStorage.setItem('sortableRowOrder', JSON.stringify(newOrder));
  console.log("New card order:", newOrder);
  // const newBody = items
  // .filter(item => item.dataset.id !== undefined)
  // .map(item => item.outerHTML);
  // console.log("New card body:", newBody);

}

// cancel changes alert box (add red shadow on hover)
const cancel_changes = document.querySelector(".cancel-chgs");
cancel_changes.addEventListener("mouseenter", () => {
  document.querySelector(".alert").classList.add("shadow-[0_0_20px_10px_rgba(255,102,102,0.6)]");
});

cancel_changes.addEventListener("mouseleave", () => {
  document.querySelector(".alert").classList.remove("shadow-[0_0_20px_10px_rgba(255,102,102,0.6)]");
});

// confirm changes laert box (add green shadow on hover)
const confirm_changes = document.querySelector(".confirm-chgs");
confirm_changes.addEventListener("mouseenter", () => {
  document.querySelector(".alert").classList.add("shadow-[0_0_20px_10px_rgba(144,238,144,0.8)]");
});

confirm_changes.addEventListener("mouseleave", () => {
  document.querySelector(".alert").classList.remove("shadow-[0_0_20px_10px_rgba(144,238,144,0.8)]");
});


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
