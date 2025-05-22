const user_id_type = document.getElementById("user_id").textContent.split("-")[0];
const user_types = ["SID", "TID", "CTID"];

// add noti msges 

// store user : noti_count as dict
// let unread_notis = {};
// user_types.forEach(user => {
//   unread_notis[user] = localStorage.getItem(`noti_count_${user}`);
// })

const noti_types = {"message" : "📧", "event" : "🗓️", "system" : "🛠️"};

///// adding notifications // formatLocalISO(); // currrent time 
function addNoti(data_id, title, body, time = new Date().toISOString(), read=false) {
  const noti_container = document.getElementById("noti-entry");

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

  const lastElem = [...noti_container.children].at(-1); // to skip text node (the last element id also dummy data)
  // console.log(lastElem);

  // add event
  holder.addEventListener('click', () => {
    read_noti(holder);
  });

  noti_span.addEventListener('click', () => {
    read_noti(noti_span);
  });
  noti_container.insertBefore(holder, lastElem);

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
    
  })
  .catch(error => console.error('Error loading JSON:', error));


// storing time as ISO format ( current by default) Tue May 20 2025 21:09:44 GMT+0630 (Myanmar Time)
// function formatLocalISO(date = new Date()) {
//   // console.log(date.toISOString()); //2025-05-21T07:46:29.628Z
//   const twoDigits = num => num.toString().padStart(2, '0');

//   const year = date.getFullYear();
//   const month = twoDigits(date.getMonth() + 1);
//   const day = twoDigits(date.getDate());
//   const hours = twoDigits(date.getHours());
//   const minutes = twoDigits(date.getMinutes());
//   const seconds = twoDigits(date.getSeconds());

//   return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
// }


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
    localStorage.setItem(`noti_count_${user_id_type}`, localStorage.getItem(`noti_count_${user_id_type}`) -1);
    document.getElementById("noti_count").textContent = document.getElementById("noti_count").textContent - 1;

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


function showNotiDetail() {
  // cretate div and display noti details
}