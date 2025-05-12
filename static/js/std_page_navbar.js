flatpickr("#dateInput", {
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


// notifications
let notifications = 3; //
// localStorage.clear(); // for testsing

// check "noti_count" in localStorage
if (localStorage.getItem("noti_count") === null) {
  localStorage.setItem("noti_count", notifications);
}
 let local_noti_count = parseInt(localStorage.getItem("noti_count"), 10);

const noti_count_box = document.getElementById("noti_count");
noti_count_box.innerHTML = local_noti_count;

if (local_noti_count > 0) {
  noti_count_box.classList.remove("hidden");
} else {
  noti_count_box.classList.add("hidden");
}


// correct button to mark all as read
const mark = mark_as_all_btn.querySelector("button");
mark.onclick= ()=>{
  localStorage.setItem("noti_count", 0);
  if (!noti_count_box.classList.contains("hidden")) {
    noti_count_box.classList.add("hidden");
    // console.log(notifications);
  }
};


// switch tab
// const allTabSections = document.querySelectorAll(".navbar-tab");

// allTabSections.forEach(navTab => {
//   const tabs = Array.from(navTab.querySelectorAll("a"));
  
//   // We will need to track the first tab as active initially
//   let activeTab = tabs[0];
//   let activeTabDiv = document.getElementById(activeTab.getAttribute("href").substring(1)); // Get content div based on href

//   // Set the initial active state for the first tab and its corresponding div
//   setActiveTab(activeTab);

//   // Add click events to each tab
//   tabs.forEach(tab => {
//     tab.addEventListener("click", (e) => {
//       e.preventDefault();

//       // const targetSection = tab.dataset.tab; // Get section linked to tab
//       // const matchingTabs = document.querySelectorAll(`[data-tab="${targetSection}"]`);
      
//       // Activate all matching tabs
//       // matchingTabs.forEach(t => setActiveTab(t));

//       // // Set the initial active state for the first tab and its corresponding div
//       // setActiveTab(activeTab);

//       // If the clicked tab is already active, do nothing
//       if (tab === activeTab) return;

//       // Hide the previous active content div
//       activeTabDiv.classList.add("hidden");

//       // Re-enable the previous active tab
//       setInactiveTab(activeTab);

//       // Set the clicked tab as active and its corresponding div
//       setActiveTab(tab);

//       activeTabDiv = document.getElementById(tab.getAttribute("href").substring(1));
      
//       // Show the new active content div
//       activeTabDiv.classList.remove("hidden");

//       // Update active tab reference
//       activeTab = tab;
//     });
//   });

//   function setActiveTab(tab) {
//     tab.classList.add("text-gray-500", "pointer-events-none");
//   }

//   function setInactiveTab(tab) {
//     tab.classList.remove("text-gray-500", "pointer-events-none");
//   }
// });

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

const join_class_btn = document.getElementById('join_class');
const take_seat_img = join_class_btn.children[0];

hover_gif_animate(join_class_btn, take_seat_img, './static/images/take_seat.gif', './static/images/place_seat.gif');

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

  observer.observe(target);
  observer1.observe(join_class_btn);
  observer2.observe(leave_form_btn);

});

// zoom
join_class_btn.onclick = () => {
  window.open("https://zoom.us/j/93256450585?pwd=ORP7IIsUXQqxlLdKjyhuR56JQKFftr.1", "_blank");
};

// adding hidden
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
