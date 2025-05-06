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
  
    btn.querySelector('svg').classList.toggle('opacity-100'); // toggle noti's opacity
  });
  
  document.addEventListener('click', function (event) {
    if (!btn.contains(event.target) && !box.contains(event.target)) {
      if (box.classList.contains('opacity-100')) {
        box.classList.remove('opacity-100');
        box.classList.add('opacity-0');
  
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



// switch tab
const allTabSections = document.querySelectorAll(".navbar-tab");
allTabSections.forEach(navTab => {
  const tabs = Array.from(navTab.querySelectorAll("a"));
  
  // We will need to track the first tab as active initially
  let activeTab = tabs[0];
  let activeTabDiv = document.getElementById(activeTab.getAttribute("href").substring(1)); // Get content div based on href

  // Set the initial active state for the first tab and its corresponding div
  setActiveTab(activeTab, activeTabDiv);

  // Add click events to each tab
  tabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      
      // If the clicked tab is already active, do nothing
      if (tab === activeTab) return;

      // Hide the previous active content div
      activeTabDiv.classList.add("hidden");

      // Re-enable the previous active tab
      setInactiveTab(activeTab);

      // Set the clicked tab as active and its corresponding div
      setActiveTab(tab);
      activeTabDiv = document.getElementById(tab.getAttribute("href").substring(1));
      
      // Show the new active content div
      activeTabDiv.classList.remove("hidden");

      // Update active tab reference
      activeTab = tab;
    });
  });

  function setActiveTab(tab, tabDiv) {
    tab.classList.add("text-gray-500", "pointer-events-none");
  }

  function setInactiveTab(tab) {
    tab.classList.remove("text-gray-500", "pointer-events-none");
  }
});



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
const take_seat = join_class_btn.children[0];

hover_gif_animate(join_class_btn, take_seat, './static/images/take_seat.gif', './static/images/place_seat.gif');

const leave_form_btn = document.getElementById('leave_form');
const leave_form = leave_form_btn.children[0];
hover_gif_animate(leave_form_btn, leave_form, './static/images/form.gif', './static/images/form.png')


// slide-in div onload
document.addEventListener("DOMContentLoaded", () => {
  const target = document.getElementById("slideInElement");
  
  const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
          target.classList.remove("opacity-0", "translate-x-10");
          target.classList.add("opacity-100", "translate-x-0");
      }
  }, { threshold: window.innerWidth < 768 ? 0.08 : 0.1 });

  observer.observe(target);
  
});


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

