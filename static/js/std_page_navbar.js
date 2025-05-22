import { typesAndSubjects, getSubjects, classCate } from "./subjects.js";

// to insert in subjects and leave form // currenlu randowm value to test

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

let scrollY = window.scrollY;

function lockScroll() {
  if (window.innerWidth < 640) {
    scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.width = '100%';
  }
}

function unlockScroll() {
  if (window.innerWidth < 640) {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
  }
}

function toggle_dropdown(btn, box) {
  btn.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation(); // Prevent this click from bubbling to document
    box.classList.toggle('opacity-0');
    box.classList.toggle('opacity-100');
    box.classList.toggle("pointer-events-none")
  
    btn.querySelector('svg').classList.toggle('opacity-100'); // toggle noti's opacity

    // to lock scroll in mobile only
    const isNotiBox = box === document.getElementById('noti_box');
    if (isNotiBox) {
      if (box.classList.contains("opacity-100") || document.getElementById('noti_box').classList.contains("opacity-100")) {
        lockScroll();
      } else {
        unlockScroll();
      }
    }
  });
  if (window.innerWidth >= 768) {
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
  
}

const profile_card = document.getElementById('profile_box');
const profile = document.getElementById('profile');

const noti = document.getElementById('noti');
const noti_box = document.getElementById('noti_box');

toggle_dropdown(profile, profile_card);
toggle_dropdown(noti, noti_box);

// mark as all read on hover

const mark_as_all_btn = document.getElementById("mark-as-all");
const mark_read_p = mark_as_all_btn.nextElementSibling;


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
// const mark = mark_as_all_btn.querySelector("button");
mark_as_all_btn.onclick= ()=>{
  const key = `${user_id_type}_read_noti_id`;
  // Get existing IDs from localStorage (or empty array)
  let readIDs = JSON.parse(localStorage.getItem(key)) || [];
  const noti_msgs = document.querySelectorAll(".noti-msg-box");
  noti_msgs.forEach(noti => {
    if (!readIDs.includes(noti.dataset.id)) {
      readIDs.push(noti.dataset.id);
      noti.classList.add("bg-transparent", "hover:bg-blue-600");
    }
  })

  localStorage.setItem(key, JSON.stringify(readIDs)); // store all the read noti as to mark as read in DOMload
  
  localStorage.setItem(`noti_count_${user_id_type}`, 0); // set noti-count to 0 

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
  if (user_id_type !== "CTID") {
    observer.observe(target);
  }
  
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
            div.classList.add("opacity-100", "scale-100", "shadow-lg", "md:shadow-[0_0_20px_10px_rgba(255,255,255,0.3)]", "pointer-events-auto");
        } else {
            if (!div.classList.contains("opacity-80")) {
              div.classList.remove("opacity-100", "scale-100", "shadow-lg", "md:shadow-[0_0_20px_10px_rgba(255,255,255,0.3)]", "pointer-events-auto");
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
const zoom_link = localStorage.getItem("zoom-link" || "https://zoom.us/j/93256450585?pwd=ORP7IIsUXQqxlLdKjyhuR56JQKFftr.1")

// console.log(zoom_link);
// localStorage.setItem("zoom-link", "https://zoom.us/j/93256450585?pwd=ORP7IIsUXQqxlLdKjyhuR56JQKFftr.1");

join_class_btn.onclick = () => {
  window.open(zoom_link, "_blank");
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

//// gather Student types and, use randowm type to test
const values = Object.keys(typesAndSubjects);
// (for testing) but when I m in courses and reloading will cause error as I use specific subject to store in local storage and insert it again to keep data when reloading
const randomType = values[Math.floor(Math.random() * values.length)];

// retrieve from database (to use in production)
// const stdTypes = ;
// sbject names
const resSubjects = getSubjects(randomType); // may be Primary, Secondary, etc.


Array.from(options.children).forEach(item => {
  item.addEventListener('click', () => {
    type_options_input.value = item.textContent;
    type_options_input.blur();

    options.classList.remove("opacity-100", "translate-y-0");
    options.classList.add("opacity-0", "-translate-y-1", "pointer-events-none");

    // to show By subjects checkboxes if std chose By Subjects
    if (type_options_input.value == options.children[options.children.length -1].textContent) {
      // console.log(document.querySelector(".by-subjects"));
      document.querySelector(".by-subjects").classList.remove("hidden");
      if(user_id_type === "SID") {
        createCheckboxes();
      }
      
    } else {
      document.querySelector(".by-subjects").classList.add("hidden");
    }
  });
});

// leave form (Add class for tracher) in options

if (user_id_type === "TID") {
  classCate.forEach(cls => {
    // create li
    const li = document.createElement("li");
    li.className = "p-2 hover:bg-blue-200 cursor-pointer text-[12px] lg:text-[16px] shadow-sm";
    li.textContent = cls;

    options.appendChild(li);
  });
}


function createCheckboxes() {
  const holder = document.querySelector(".checkbox-holder"); // holder
  if (holder.children.length == 0) {
     resSubjects.forEach(subject => {
        // create div
        const div = document.createElement("div");
        div.className = "choose-select flex space-x-2 items-center"

        // Create checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "size-4 md:size-4.5";
        checkbox.name = subject;

        // Create label
        const label = document.createElement("label");
        label.className = "text-[14px] sm:text-base";
        label.textContent = subject;

        // Append elements to div
        div.appendChild(checkbox);
        div.appendChild(label);

        // Append div to holder
        holder.appendChild(div);
    });
  }
 
}


const leave_form_cancel = document.getElementById("leave_form_cancel");

leave_form.querySelector("button").onclick = () => {
  backToDashboard(leave_form);
}
leave_form_cancel.onclick = () => {
  backToDashboard(leave_form, "leave_form");
};

export function backToDashboard(divName, leave_form = "") {
  
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

function widthDetermine() { // as I dont want to use style.width = `${percent}%`
  let newClass = "w-0";
    if (percent >= 100) newClass = "w-full";
    else if (percent >= 75) newClass = "w-3/4";
    else if (percent >= 66) newClass = "w-2/3";
    else if (percent >= 50) newClass = "w-1/2";
    else if (percent >= 33) newClass = "w-1/3";
    else if (percent >= 25) newClass = "w-1/4";
    else if (percent >= 10) newClass = "w-1/6";
    else newClass = "w-1/8";
    return newClass;
}

// for student only
if(user_id_type === "SID") {
  // console.log("Hello");
  // console.log(resSubjects);
  insertSubjects(resSubjects);
}
// from randomType and resSubjects
// to add subjects dynamically
export function insertSubjects(subs) {
  // mian holder
  const holder = document.getElementById("slideInElement");

  subs.forEach(sub => {
    //create img and text holder
    const primDiv = document.createElement("div");
    primDiv.className = "subject subject-div-box group neon-card";
    // creat img holder
    const secDiv = document.createElement("div");
    secDiv.className = "flex w-full h-[85%] xl:h-[90%]";
    // create img
    const img = document.createElement("img");
    img.className = "subject-img"; // insertable
    img.src = "./static/images/book_1.png";
    img.alt = "book";

    // add img to secDiv
    secDiv.appendChild(img);
    // create text
    const textDiv = document.createElement("div");
    textDiv.className = "flex items-center justify-center w-full mb-1 sm:mb-[10px]";
    const text = document.createElement("p");
    text.className = "subject-text"; // insertable
    text.textContent = sub;
    textDiv.appendChild(text);
    // console.log(sub.trim().toLocaleLowerCase());
    // Get stored progress or start from 0 ( stored as subject-progress) (for student only)
    let progress = parseInt(localStorage.getItem(`${sub.trim().toLocaleLowerCase()}-progress`) || "0");

    // if student
    if (user_id_type === "SID") {
      const percent = document.createElement("span");
      percent.textContent = `${progress}%`; // retrieved data from local storage
      percent.className = "ml-2 sm:ml-3 sm:text-[20px]";
      textDiv.appendChild(percent);
    }

    // insert to primDiv
    primDiv.appendChild(secDiv);
    primDiv.appendChild(textDiv);
    
    // if student
    if (user_id_type === "SID") {
      // progress bar
      const progressBarContainer = document.createElement("div");
      progressBarContainer.className = "progress-container";

      const progressBar = document.createElement("div");
      // tailwind cant handle handle arbitrary dynamic values (progress-bar w-[${progress}%])
      progressBar.className = "progress-bar w-[0%]"; // retrieved data from local storage
      progressBar.style.width = `${progress}%`; // set width dynamically
      progressBarContainer.appendChild(progressBar);

      primDiv.appendChild(progressBarContainer);
    }

    //insert to main holder
    holder.appendChild(primDiv);
  });

}

// insert teacher's subject according to database
const dummySubs = ["Myanmar", "English", "Mathematics", "Physics", "Chemistry", "Biology"]; // dummy data
// renew resSubjects wghich wiil be use in imported functions
const trSubjects = [dummySubs[Math.floor(Math.random() * dummySubs.length)]];

if (user_id_type === "TID") {
  insertSubjects(trSubjects);
}


const subjects = document.querySelectorAll(".subject");

if (subjects && user_id_type === "SID") {
  courses_tab.querySelector("button").onclick = (e) => {
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



export function loadSubject(sub_name) {
  make_tabs_inactive();

  courses_tab.classList.remove("hidden");

  courses_tab.querySelector("h1").textContent = sub_name;

  if (sessionStorage.getItem("activeTabDiv") != courses_tab.getAttribute("id") && sessionStorage.getItem("lastSubject") != sub_name) {
    sessionStorage.setItem("activeTabDiv", courses_tab.getAttribute("id")); // to keep current tab on reload
    sessionStorage.setItem("lastSubject", sub_name); // to restore content on reload
  }

  // console.log(`Loading ${sub_name}`);
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

// localStorage.setItem('Myanmar-progress', "0");

// increase percentage if user clicked on content
if (user_id_type === "SID") {
  const files = document.querySelectorAll(".file-link");
  files.forEach(sub => {
    sub.onclick = () => {
      const course_name = courses_tab.querySelector("h1").textContent;
      let key = course_name.trim().toLocaleLowerCase();
      // get current progress
      // console.log(key);
      let progress = parseInt(localStorage.getItem(`${key}-progress`) || "0");

      if (progress < 100) {
        const increment = Math.floor(100/files.length);
        progress = Math.min(progress + increment, 100);
        localStorage.setItem(`${key}-progress`, progress);
        // console.log(progress);
        document.querySelectorAll(".subject-text").forEach(value => {
          if (value.textContent === course_name) {
            value.nextElementSibling.textContent = `${progress}%`; // eg. Subjectname's next sibling => 0% ( eg. Myanmar 0%)
            // console.log(value.parentElement.nextElementSibling); // eg (Myanmar )%)div's next sibling => progress container
            const progress_container = value.parentElement.nextElementSibling;

            progress_container.firstChild.style.width = `${progress}%`; // progress bar
          }    
        });

        // const progressBar = sub.parentElement.parentElement.querySelector(".progress-bar");
        // progressBar.className = `progress-bar w-[${progress}%]`;
      }
    }
  });
}
// document.querySelectorAll(".subject-text").forEach(value => {
        //   value.textContent === course_name ? value.querySelector("span").textContent = `${progress}%` : "";
        // })

