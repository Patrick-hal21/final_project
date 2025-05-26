const user = document.getElementById("user_id");
user.textContent = sessionStorage.getItem("user");

const user_id_type = user.textContent.split("-")[0];
const user_types = ["SID", "TID", "CTID"];

// add noti msges 

// store user : noti_count as dict
// let unread_notis = {};
// user_types.forEach(user => {
//   unread_notis[user] = localStorage.getItem(`noti_count_${user}`);
// })


const dateStr = '2025-05-25T14:15:02.827Z';
const date = new Date(dateStr);

// Format options
const options = {
weekday: 'long',
year: 'numeric',
month: 'long',
day: 'numeric',
hour: 'numeric',
minute: '2-digit',
hour12: true,
timeZone: 'Asia/Yangon' // Myanmar Standard Time
};

// Format the date
const formatter = new Intl.DateTimeFormat('en-GB', options);
// const formattedDate = formatter.format(date);

// Output
//console.log(`${formattedDate}\nMyanmar Standard Time`);
// document.querySelector(".when").textContent = formattedDate;


// gather data from session

const noti_header = sessionStorage.getItem(`noti_topic_${user_id_type}`);
const noti_time = sessionStorage.getItem(`noti_time_${user_id_type}`);
const noti_body = sessionStorage.getItem(`noti_body_${user_id_type}`);
const noti_id = sessionStorage.getItem(`noti_id_${user_id_type}`);

let active = noti_id || '';

// on page load data from clicked noti is inserted
document.querySelector(".content").dataset.id = noti_id;
document.querySelector(".header").textContent = noti_header;
document.querySelector(".when > p").textContent = formatter.format(new Date(noti_time));
document.querySelector(".topic").textContent = noti_header;
document.querySelector(".detail").textContent = noti_body;







const noti_types = {"message" : "📧", "event" : "🗓️", "system" : "🛠️"};

///// adding notifications // formatLocalISO(); // currrent time 
function addNoti(data_id, title, body, time = new Date().toISOString(), read=false) {
  const noti_container = document.getElementById("noti-entry-box");

  // create msg whole body
  const holder = document.createElement("div");
  holder.className = "noti-msg-box new-msg group"; // new-msg has bg-gray-200/50
  if (read) { // if msg is read
    // console.log("hello");
    holder.className = "noti-msg-box group"; // read msg
  } else {
    holder.className = "noti-msg-box new-msg group"; // new-msg has bg-gray-200/50
  }
  holder.setAttribute("data-id", data_id);

  // msg header 
  const msg_header = document.createElement("div");
  msg_header.className = "noti-msg-header";

  // msg title of header
  const h2 = document.createElement("h2");
  h2.className = "truncate max-w-[70%]";
  h2.textContent = noti_types['message'] + " " + title;
  // timestamp
  const tstmp = document.createElement("time");
  tstmp.className = "smart-time whitespace-nowrap";
  tstmp.setAttribute("datetime", time); // currrent time by default
  formatSmartTime(tstmp);
  // console.log(time);
  // console.log(time);
  // tstmp.textContent = formatSmartTime(tstmp);

  // append title and time to msg-header
  msg_header.appendChild(h2);
  msg_header.appendChild(tstmp);

  // msg body
  const msg_body = document.createElement("p");
  msg_body.className = "noti-msg-body";
  msg_body.textContent = body;

  // view notification
  const noti_span = document.createElement("span");
  noti_span.className = "noti-span";
  noti_span.textContent = "View Notification";

  // append all child to mainb holder
  holder.appendChild(msg_header);
  holder.appendChild(msg_body)
  holder.appendChild(noti_span);

  // const lastElem = [...noti_container.children].at(-1); // to skip text node (the last element id also dummy data , just testing)
  // console.log(lastElem);

  // add event
  holder.addEventListener('click', () => {
    read_noti(holder);
    addDisplay(holder);
    if (window.innerWidth < 765) {
        slideInDiv();
    }
  });

  noti_span.addEventListener('click', () => {
    read_noti(noti_span);
    addDisplay(holder);
    if (window.innerWidth < 765) {
        slideInDiv();
    }
  });
  noti_container.appendChild(holder);

}

// fetch data from noti.json
fetch('./json/noti.json')
  .then(response => response.json())
  .then(data => {
    
    if (user_id_type === "SID") {
      // Access SID
      data.SID.slice().reverse().forEach((item, index) => { // to display newest top and oldest bottom
        // console.log(`SID ${index + 1}: Header = ${item.header}, Body = ${item.body}`);
        const readIDs = JSON.parse(localStorage.getItem(`${user_id_type}_read_noti_id`)) || [];
        
        if (readIDs.includes(item.id)) {
          // Mark as read
          addNoti(item.id, item.header, item.body, item.time, true);
        } else {
          addNoti(item.id, item.header, item.body, item.time); // add noti
        }
        
      });
    } 
    else if (user_id_type === "TID") {
      // Access TID
      data.TID.slice().reverse().forEach((item, index) => {
        const readIDs = JSON.parse(localStorage.getItem(`${user_id_type}_read_noti_id`)) || [];
        
        if (readIDs.includes(item.id)) {
          // Mark as read
          addNoti(item.id, item.header, item.body, item.time, true);
        } else {
          addNoti(item.id, item.header, item.body, item.time); // add noti
        }
        
      });
    }
    else if (user_id_type === "CTID") {
      // Access TID
      data.CTID.slice().reverse().forEach((item, index) => {
        // console.log(`CTID ${index + 1}:`, item);
        const readIDs = JSON.parse(localStorage.getItem(`${user_id_type}_read_noti_id`)) || [];
        
        if (readIDs.includes(item.id)) {
          // Mark as read
          addNoti(item.id, item.header, item.body, item.time, true);
        } else {
          addNoti(item.id, item.header, item.body, item.time); // add noti
        }
      });
    }

    // check active noti
    check_active(active);
    
  })
  .catch(error => console.error('Error loading JSON:', error));

// noti msg rendering from  <time datetime="2025-05-20T13:30:00" class="smart-time">Original Time</time> and shows 
// 1. 24-hour format if today
// 2. Yesterday or 2days ago, eyc.

function formatSmartTime(elem) {
    const timeString = elem.getAttribute("datetime");
    const date = new Date(timeString);
    const now = new Date();

    // Normalize to compare only dates
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const givenDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffMs = today - givenDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let displayText = "";

    if (diffDays === 0) {
      // Today: show time in 24-hour format (HH:mm)
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      displayText = `${hours}:${minutes} ${ampm}`;
    } else if (diffDays === 1) {
      displayText = "Yesterday";
    } else {
      displayText = `${diffDays} days ago`;
    }

    elem.textContent = displayText;
  }

  // const text = formatSmartTime("2025-05-21T07:46:29.628Z");
  // console.log(text);
if (document.querySelectorAll(".noti-msg-box")) {
  // console.log("hello");
  document.querySelectorAll(".smart-time").forEach(elem => formatSmartTime(elem));
}


// if user click noti it counts as read

function read_noti(elem) {
  const clicked_id = elem.dataset.id; // data-id

  const key = `${user_id_type}_read_noti_id`;
  // Get existing IDs from localStorage (or empty array)
  let readIDs = JSON.parse(localStorage.getItem(key)) || [];

  // Add new ID if not already in the list
  if (!readIDs.includes(clicked_id)) {
    readIDs.push(clicked_id);
    console.log(readIDs);
    // reduce noti count
    localStorage.setItem(`noti_count_${user_id_type}`, Math.max(localStorage.getItem(`noti_count_${user_id_type}`) -1, 0));
    // document.getElementById("noti_count").textContent = document.getElementById("noti_count").textContent - 1;

    elem.classList.add("bg-transparent", "hover:bg-blue-600");
    // elem.className = elem.className.replace(/\bbg-gray-200\/50\b/g, '').trim();
  }

  // Save updated list
  localStorage.setItem(key, JSON.stringify(readIDs));


  // if (elem.className.includes("bg-gray-200\/50")) {
  //   console.log("hello");
  //   elem.classList.remove("bg-gray-200/50");
  // }

  // open new page to display noti
  // New Page !
}


function slideInDiv() {
    document.getElementById("tab-2").classList.toggle("max-w-0");
    document.getElementById("tab-2").classList.toggle("max-w-full");

}


function setupResponsiveClick() {

    document.getElementById("back-noti").removeEventListener('click', slideInDiv);

    if (window.innerWidth < 765) {
        document.getElementById("back-noti").addEventListener('click', slideInDiv);
    } else {
        if (document.getElementById("tab-2").classList.contains("max-w-0")) {
            document.getElementById("tab-2").classList.toggle("max-w-0");
            document.getElementById("tab-2").classList.toggle("max-w-full");
        }
    }
}

window.addEventListener("load", setupResponsiveClick);
window.addEventListener("resize", setupResponsiveClick);

const when = document.querySelector(".when > p");
const header = document.querySelector(".header");
const topic = document.querySelector(".topic");
const detail = document.querySelector(".detail");
let activeNoti = ""; // retrieve from clicked noti dataset.id


function addDisplay(noti) {
    const topic = noti.querySelector("div > h2").textContent;
    const date = new Date(noti.querySelector("div > time").getAttribute('datetime'));
    const time = formatter.format(date);
    const id = noti.dataset.id;
    const content = noti.querySelector(".noti-msg-body").textContent;

    active = id;

    displayNoti(time, topic, topic, content, id);
    check_active(active);
    // display
}

function displayNoti(time, h, t, d, id) { // onload we insert data from user clicked noti, h === t

    /* to mark noti as active
    document.getElementById("noti-entry").forEach(noti => {
        if (noti.dataset.id === activeNoti) {
            noti.classList.add("active");
        }
    })
        */
    document.querySelector(".content").dataset.id = id;
    when.textContent = time;
    header.textContent = h;
    topic.textContent = t;
    detail.textContent = d;
}

function check_active (active) {
    document.querySelectorAll("#noti-entry-box > div").forEach(div => {
        if (div.dataset.id === active) {
            div.classList.remove("bg-transparent");
            div.classList.add("bg-blue-600/50", "text-white");
            div.querySelector("span").classList.add("text-white");
        } else {
            if (div.classList.contains("bg-blue-600/50")) {
                div.classList.add("bg-transparent");
                div.classList.remove("bg-blue-600/50", "text-white");
                div.querySelector("span").classList.remove("text-white");
            }
        }
    });
}


// to navigate back to home
document.querySelector(".back-home").addEventListener('click', () => {
    if (window.history.length > 1) {
      history.back();
  } else {
    if (user_id_type === "SID") {
      window.location.href = "./system_page_std.html";
    } else if (user_id_type === "TID") {
      window.location.href = "./teacher_page.html";
    } else {
      window.location.href = "./class_teacher_pg.html"; // Redirect to a safe page
    }
  }
})