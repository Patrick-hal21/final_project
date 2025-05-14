// ----> For system pages(0- 528)-> mixed (108-164)
const dateInput = document.getElementById("dateInput");

const fp = flatpickr(dateInput, {
  disableMobile: true, // Forces Flatpickr UI on mobile devices
  enableTime: false,
  dateFormat: "m-d-Y",
  // minDate: "today", // Prevents past dates from being selected
});


const humburgerBtn = document.getElementById("humburger-btn");
humburgerBtn.onclick = function() {
    const dropElement = document.getElementById("dropElement");
    dropElement.classList.toggle('dropdown-hidden');
    dropElement.classList.toggle('dropdown-visible');
}


function toggle_dropdown(btn, box) {
  btn.addEventListener('click', function (event) {
    event.stopPropagation(); // Prevent this click from bubbling to document
    box.classList.toggle('opacity-0');
    box.classList.toggle('opacity-100');
    box.classList.toggle("pointer-events-none")
  
    btn.querySelector('svg').classList.toggle('opacity-100'); // toggle noti's opacity
  });
  
  document.addEventListener('click', function (event) {
    if (!btn.contains(event.target) && !box.contains(event.target)) {
      if (box.classList.contains('opacity-100')) {
        box.classList.remove('opacity-100');
        box.classList.add('opacity-0');
        box.classList.add("pointer-events-none")
  
        btn.querySelector('svg').classList.toggle('opacity-100'); // toggle noti's opacity
      }
    }
  });
}

const profile_card = document.getElementById('profile_box');
const profile = document.getElementById('profile');

const noti = document.getElementById('noti');
const noti_box = document.getElementById('noti_box');

toggle_dropdown(profile, profile_card);
toggle_dropdown(noti, noti_box);

// mark as all read on hover

const mark_as_all_btn = document.getElementById("mark-as-all");
const mark_read_p = mark_as_all_btn.querySelector("p");


// btn = btn or any other element to add hover event
// text - p or text element to show on hovering 
function show_text_on_hover(btn, text_e) {
  let timeoutId;
  btn.addEventListener("mouseenter", () => {
    // Start 1.5s delay to show tooltip
    timeoutId = setTimeout(() => {
      text_e.classList.remove("hidden");
    }, 1500);
  });
  
  btn.addEventListener("mouseleave", () => {
    // Cancel the pending timeout
    clearTimeout(timeoutId);
    
    // Optionally hide the tooltip immediately
    text_e.classList.add("hidden");
  });
}

show_text_on_hover(mark_as_all_btn, mark_read_p);

const user_id_type = document.getElementById("user_id").textContent.split("-")[0];

// notifications
let notifications = 3; //
// localStorage.clear(); // for testsing
const user_types = ["SID", "TID", "CTID"];

// set notifications count for each user type(testing)
for(let i=0; i < user_types.length; i++){
  // check "noti_count" in localStorage
  if (localStorage.getItem(`noti_count_${user_types[i]}`) === null) {
      localStorage.setItem(`noti_count_${user_types[i]}`, notifications);
  }
}

let local_noti_count;
if (user_id_type === "SID") {
  local_noti_count = parseInt(localStorage.getItem("noti_count_SID"), 10);
} else if (user_id_type === "TID") {
  local_noti_count = parseInt(localStorage.getItem("noti_count_TID"), 10);
} else {
  local_noti_count = parseInt(localStorage.getItem("noti_count_CTID"), 10);
}

const noti_count_box = document.getElementById("noti_count");
noti_count_box.innerHTML = local_noti_count;

if (local_noti_count > 0) {
  noti_count_box.classList.remove("hidden");
} else {
  if (!noti_count_box.classList.contains("hidden")) {
      noti_count_box.classList.add("hidden");
  }
}


// correct button to mark all as read
const mark = mark_as_all_btn.querySelector("button");
mark.onclick= ()=>{
  localStorage.setItem(`noti_count_${user_id_type}`, 0);
  if (!noti_count_box.classList.contains("hidden")) {
      noti_count_box.classList.add("hidden");
    // console.log(notifications);
  }
};

// ----> mixed student and teachers
// user_types = ["SID", "TID", "CTID"]; // retrieve from the backend

const join_class_btn = document.getElementById('join_class');
const take_seat_img = join_class_btn.children[0];

if (user_id_type == "SID") {
  // console.log("hello student");
  hover_gif_animate(join_class_btn, take_seat_img, './static/images/take_seat.gif', './static/images/place_seat.gif');
} else if (user_id_type == "TID") {
  // console.log("hello teacher");
  hover_gif_animate(join_class_btn, take_seat_img, './static/images/teacher.gif', './static/images/teacher.png');
} else {
  hover_gif_animate(join_class_btn, take_seat_img, './static/images/teacher.gif', './static/images/teacher.png');
}


const leave_form_btn = document.getElementById('leave_form'); // from dashboard div
const leave_form_img = leave_form_btn.children[0];
hover_gif_animate(leave_form_btn, leave_form_img, './static/images/form.gif', './static/images/form.png')


// slide-in div onload/ restore dynamic content in reload**
document.addEventListener("DOMContentLoaded", () => {
  // localStorage.clear();

  const target = document.getElementById("slideInElement");

  const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
          target.classList.remove("opacity-0", "translate-x-10");
          target.classList.add("opacity-100", "translate-x-0");
      }
  }, { threshold: window.innerWidth < 768 ? 0.08 : 0.1 });

  const observer1 = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
        join_class_btn.classList.remove("opacity-0", "-translate-x-10");
        join_class_btn.classList.add("opacity-100", "translate-x-0");
    }
  }, { threshold: window.innerWidth < 768 ? 0.08 :0.9 });

  const observer2 = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
        leave_form_btn.classList.remove("opacity-0", "translate-x-10");
        leave_form_btn.classList.add("opacity-100", "translate-x-0");
    }
  }, { threshold: window.innerWidth < 768 ? 0.08 :0.9 });

  // function test_func(div) {
  //   const observer = new IntersectionObserver(([entry]) => {
  //       if (entry.isIntersecting) {
  //           div.classList.remove("opacity-50", "scale-90");
  //           div.classList.add("opacity-100", "scale-100");
  //       }
  //   }, { threshold: 0.99});

  //   observer.observe(div); // Ensure the element is observed
  //   // return observer; // Optional: Return observer for further management
  // }

  // document.querySelectorAll("#class > div").forEach(elem => {
  //   test_func(elem);
  // });

  observer.observe(target);
  observer1.observe(join_class_btn);
  observer2.observe(leave_form_btn);

});

function checkMidScreen() {
    document.querySelectorAll("#class > div").forEach((div) => {
        const rect = div.getBoundingClientRect();
        const screenMid = window.innerHeight / 2;

        const isAtMidScreen = rect.top <= screenMid && rect.bottom >= screenMid;

        if (isAtMidScreen) {
            div.classList.remove("opacity-80", "scale-98", "md:pointer-events-none");
            div.classList.add("opacity-100", "scale-100", "shadow-lg", "pointer-events-auto");
        } else {
            if (!div.classList.contains("opacity-80")) {
              div.classList.remove("opacity-100", "scale-100", "shadow-lg", "pointer-events-auto");
              div.classList.add("opacity-80", "scale-98", "md:pointer-events-none"); // Optional: Reset if not at mid
            }
        }
    });
}

// to prevent firing scroll excessively, and to boost performance,(but currently it cause animations delay)
function debounce(func, delay = 100) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

window.addEventListener("scroll", debounce(checkMidScreen));
// Ensure it runs after the page fully loads
document.addEventListener("DOMContentLoaded", checkMidScreen);

// Run on scroll
window.addEventListener("scroll", checkMidScreen);

// Run on resize (handles viewport changes)
window.addEventListener("resize", checkMidScreen);


// end mixed

const allTabSections = document.querySelectorAll(".navbar-tab");
// leave form tab
const leave_form = document.getElementById("leave_form_tab");
// courses div
const courses_tab = document.getElementById("courses");

// Iterate through each tab container
allTabSections.forEach(navTab => {
  const tabs = Array.from(navTab.querySelectorAll("a"));
  // tabs.forEach(tab => {

  // Track the initially active tab
  let curTab = sessionStorage.getItem("activeTab");

  let activeTab = curTab ? navTab.querySelector(`a[href="${curTab}"]`) : tabs[0];
  // console.log(activeTab);

  let curDiv = sessionStorage.getItem("activeTabDiv");
  let activeTabDiv = curDiv ? document.getElementById(curDiv) : document.getElementById(activeTab.getAttribute("href").substring(1));

  if (activeTabDiv != document.getElementById(activeTab.getAttribute("href").substring(1))) {
    // console.log("not equal");
    setInactiveTab(activeTab);
  } else {
    // Set the initial active state
    setActiveTab(activeTab);
  }


  // if current tab(last tab) is courses tab
  if (activeTabDiv == courses_tab) {
      // restore dynamic subject content on reload
      const lastSubjectTab = sessionStorage.getItem('lastSubject');
      if (lastSubjectTab) {
        loadSubject(lastSubjectTab);
      }
  }
  activeTabDiv.classList.remove("hidden");

  // Handle tab clicks, hide other tabs
  tabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();

      // hide leave form tab if it is not hidden
      if (!leave_form.classList.contains("hidden")) {
        leave_form.classList.add("hidden");
        reset_leaveform(); // reset form manually

      } else if (!courses_tab.classList.contains("hidden")) {
        // reset courses content
        console.log("hello");
        courses_tab.classList.add("hidden");

        // clear course name
        courses_tab.querySelector("h1").textContent = ""

        // clear data to load new data
        // Array.from(courses_tab.children).forEach(element => {
        //   element.textContent = "";
        // })
      }

      // for slide-in animation
      // if (leave_form.classList.contains("flex-1")) {
      //   leave_form.classList.remove("flex-1", "opacity-100", "translate-x-0");
      //   leave_form.classList.add("w-0", "opacity-0", "translate-x-10");
      // }

      const targetSection = tab.dataset.tab; // Get section identifier
      const matchingTabs = document.querySelectorAll(`[data-tab="${targetSection}"]`); // Find same tabs in both navbars

      // If clicked tab is already active, do nothing
      if (tab === activeTab && !activeTabDiv.classList.contains("hidden")) {
        return;
      } else if (activeTabDiv.classList.contains("hidden")){
        activeTabDiv.classList.remove("hidden");
      }

      // Hide previous active content div
      activeTabDiv.classList.add("hidden");

      // Reset previous active tabs
      allTabSections.forEach(nav => {
        const previousTabs = nav.querySelectorAll(`[data-tab="${activeTab.dataset.tab}"]`);
        previousTabs.forEach(setInactiveTab);
      });

      // Activate new tabs (both navbars)
      matchingTabs.forEach(tab => setActiveTab(tab));

      // Show new active content div
      activeTabDiv = document.getElementById(targetSection);
      activeTabDiv.classList.remove("hidden");

      // Update active tab reference
      activeTab = tab;
      // console.log(activeTab.getAttribute("href"));
      // console.log(activeTabDiv.id);
      sessionStorage.setItem("activeTab", activeTab.getAttribute("href"));
      sessionStorage.setItem("activeTabDiv", activeTabDiv.id);

      if (activeTabDiv.id == "class") {
         checkMidScreen();
      }
    });
  });
});

function setActiveTab(tab) {
  tab.classList.add("text-gray-500", "pointer-events-none");
}

function setInactiveTab(tab) {
  tab.classList.remove("text-gray-500", "pointer-events-none");
}


// button gif animation
function hover_gif_animate(btn, img, src1, src2){
  btn.addEventListener('mouseenter', function (event) {
    // event.stopPropagation(); // Prevent this click from bubbling to document
      img.src = src1; // first half of the gif which is taking seat
  });
  
  btn.addEventListener('mouseleave', function (event) {
    // event.stopPropagation(); // Prevent this click from bubbling to document
      img.src = src2; // second half of the gif which is placing seat
  });
}

// zoom
join_class_btn.onclick = () => {
  window.open("https://zoom.us/j/93256450585?pwd=ORP7IIsUXQqxlLdKjyhuR56JQKFftr.1", "_blank");
};

// adding hidden to divs
function make_tabs_inactive() {
  allTabSections.forEach(navTab => {
    const tabs = Array.from(navTab.querySelectorAll("a"));
    tabs.forEach(tab => {
      const div_content = document.getElementById(tab.getAttribute("href").substring(1));
      if(!div_content.classList.contains("hidden")) {
        div_content.classList.add("hidden");
      }
      setInactiveTab(tab);
    });
  });
}

leave_form_btn.onclick = () => {
  
  make_tabs_inactive();

  leave_form.classList.remove("hidden");
  reset_leaveform();
  // fir slide-in animation
  // leave_form.classList.remove("w-0","opacity-0", "translate-x-10");
  // leave_form.classList.add("flex-1","opacity-100", "translate-x-0");
  sessionStorage.setItem("activeTabDiv", leave_form.getAttribute("id"));
};

// form reset
function reset_leaveform() {
  // console.log(leave_form.querySelector("form")["name"]);
  leave_form.querySelector("form").reset();
}

function setFocus(id, to_focus) {
  document.getElementById(id).addEventListener("click", (event) => {
    // event.preventDefault();
    if (document.getElementById(to_focus).contains(event.target)) {
      return;
    }
    document.getElementById(to_focus).focus();
    // console.log(id);
  });
}

setFocus("fordate", "dateInput");
setFocus("for_type", "type_options");

const type_options_input = document.getElementById("type_options");
const options = document.getElementById("options");

toggleDropdown(type_options_input);
toggleDropdown(document.getElementById("for_type"));

document.getElementById("dateInput").onchange = () => {

  document.getElementById("dateInput").blur();

};

function toggleDropdown(btn) {
  btn.addEventListener("click", (event)=> {
    if (options.classList.contains("opacity-0")) {
      options.classList.remove("opacity-0", "-translate-y-1", "pointer-events-none");
      options.classList.add("opacity-100", "translate-y-0");

      document.getElementById("for_type").classList.add("rotate-180");
    } else {
      options.classList.remove("opacity-100", "translate-y-0");
      options.classList.add("opacity-0", "-translate-y-1", "pointer-events-none");

      document.getElementById("for_type").classList.remove("rotate-180");
      type_options_input.blur();
    }
  });
}


document.addEventListener('click', function (event) {
  if (!type_options_input.contains(event.target) && !document.getElementById("for_type").contains(event.target) && !options.contains(event.target)) {
    if (options.classList.contains('opacity-100')) {
      options.classList.remove("opacity-100", "translate-y-0");
      options.classList.add("opacity-0", "-translate-y-1", "pointer-events-none");
    }
  }
});

Array.from(options.children).forEach(item => {
  item.addEventListener('click', () => {
    type_options_input.value = item.textContent;
    type_options_input.blur();

    options.classList.remove("opacity-100", "translate-y-0");
    options.classList.add("opacity-0", "-translate-y-1", "pointer-events-none");
  });
});

const leave_form_cancel = document.getElementById("leave_form_cancel");

leave_form.querySelector("button").onclick = () => {
  backToDashboard(leave_form);
}
leave_form_cancel.onclick = () => {
  backToDashboard(leave_form, "leave_form");
};

function backToDashboard(divName, leave_form = "") {
  
  //hide and reset leave form
  divName.classList.add("hidden");
  if (leave_form === "leave_form") {
    reset_leaveform();
  }

  // display dashboard
  document.querySelectorAll('a[href="#dashboard"]').forEach(tab => {
    setActiveTab(tab);
  });
  // console.log(dashboards.length);

  document.getElementById("dashboard").classList.remove("hidden");

    // to set Dashboard as active
  sessionStorage.setItem("activeTab", "#dashboard"); // href
  sessionStorage.setItem("activeTabDiv", "dashboard"); // id 

}

//Courses

const subjects = document.querySelectorAll(".subject");
if (subjects) {
    courses_tab.querySelector("button").onclick = () => {
    console.log("hello");
    backToDashboard(courses_tab);
  }

  subjects.forEach(sub => {
    sub.addEventListener('click', ()=>{
      loadSubject(sub.querySelector("p").textContent);
      window.scrollTo({top: 0,  behavior: 'smooth' });
    });
  });
}



function loadSubject(sub_name) {
  make_tabs_inactive();

  courses_tab.classList.remove("hidden");

  courses_tab.querySelector("h1").textContent = sub_name;

  if (sessionStorage.getItem("activeTabDiv") != courses_tab.getAttribute("id") && sessionStorage.getItem("lastSubject") != sub_name) {
    sessionStorage.setItem("activeTabDiv", courses_tab.getAttribute("id")); // to keep current tab on reload
    sessionStorage.setItem("lastSubject", sub_name); // to restore content on reload
  }

  console.log(`Loading ${sub_name}`);
}

// ***** to load Course content dynamically
// async function loadSubject(subject) {
//     const response = await fetch(`/get-subject-content?name=${subject}`);
//     const data = await response.text(); // or response.json() if it's JSON
//     document.getElementById('subject-content').innerHTML = data;
// }

// Set a tag according to filename
document.querySelectorAll('.file-link').forEach(link => {
  const url = link.getAttribute('href');
  if (url) {
    const fileName = url.split('/').pop(); // Get just the file name
    link.textContent = fileName; // Set it as the visible link text
  }
});

// for scrollable div's shadow
document.querySelectorAll('.scroll-check').forEach(container => {
  const isScrollable = container.scrollHeight > container.clientHeight;
  if (isScrollable) {
    container.classList.add('scroll-shadow');
  }
});



// ------> Teacher

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
  elem.classList.remove("opacity-0");
  elem.classList.add("opacity-100");
  
  setTimeout(() => {
    elem.classList.remove("opacity-100");
    elem.classList.add("opacity-0");
  }, 2000);
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
      countdownEl.textContent = "Link expired";
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

function generateLink() {

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
  document.getElementById("expiredTime").classList.remove("hidden");
}

// On page load, show existing link if not expired
(function () {
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
      document.getElementById("expiredTime").classList.remove("hidden");
    } else {
      localStorage.removeItem("tempLink");
    }
  }
})();


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
