const humburgerBtn = document.getElementById("humburger-btn");
humburgerBtn.onclick = function() {
    const dropElement = document.getElementById("dropElement");
    dropElement.classList.toggle('dropdown-hidden');
    dropElement.classList.toggle('dropdown-visible');
}

const profile_card = document.getElementById('profile_box');
const profile = document.getElementById('profile');

profile.addEventListener('click', function (event) {
    event.stopPropagation(); // Prevent this click from bubbling to document
    profile_card.classList.toggle('opacity-0');
    profile_card.classList.toggle('opacity-100');
});

document.addEventListener('click', function (event) {
    if (!profile.contains(event.target) && !profile_card.contains(event.target)) {
      if (profile_card.classList.contains('opacity-100')) {
        profile_card.classList.remove('opacity-100');
        profile_card.classList.add('opacity-0');
      }
    }
});

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
const join_class_btn = document.getElementById('join_class');
const take_seat = join_class_btn.children[0];

const leave_form_btn = document.getElementById('leave_form');
const leave_form = leave_form_btn.children[0];

join_class_btn.addEventListener('mouseenter', function (event) {
  // event.stopPropagation(); // Prevent this click from bubbling to document
    take_seat.src = './static/images/take_seat.gif'; // first half of the gif which is taking seat

    // take_seat.src = './static/images/classroom_nobg.gif'; // full gif
});

join_class_btn.addEventListener('mouseleave', function (event) {
  // event.stopPropagation(); // Prevent this click from bubbling to document
    take_seat.src = './static/images/place_seat.gif'; // second half of the gif which is placing seat

    // take_seat.src = './static/images/seat.png'; // default png
});

leave_form_btn.addEventListener('mouseenter', function (event) {
  // event.stopPropagation(); // Prevent this click from bubbling to document
    leave_form.src = './static/images/form.gif'; // first half of the gif which is taking seat
});

leave_form_btn.addEventListener('mouseleave', function (event) {
  // event.stopPropagation(); // Prevent this click from bubbling to document
    leave_form.src = './static/images/form.png'; // second half of the gif which is placing seat
});