// to sort the gathered data
const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

let title = "";
let periods = 0;
let school_days = 0;
let off_days = 7; // a week
let break_time = 0; // value will be after period number
let breaktime_duration = "";

// starttime and end time 
let start_time = "";
let end_time = "";

// duration
let period_duration = 0;

// to draw timetable
let subjects = [];//["Math", "English", "Science", "History", "Art", "PE"];
let week_days = []; //["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

document.querySelector("input[type='number']").addEventListener("input", function () {
    let value = parseInt(this.value, 10);
    if (isNaN(value) || value < 0) {
        this.value = 0; // Reset to minimum if invalid
    }
    if (this.value !== "") {
        this.value = String(Number(this.value));
    }
    
    periods = parseInt(this.value,0);
    // console.log(periods);

    // add inputs to dropdown list
    // addInputList(); // line - 325
});

// add inputs in change event to consume less resourse
document.querySelector("input[type='number']").addEventListener("change", function () {
    // add inputs to dropdown list
    addInputList(); // line - 325
});

const days = document.querySelectorAll(".select-days");

// add Days that can be toggled
days.forEach(day => {
    day.addEventListener('click', () => {
        const checkbox = day.querySelector("input[type='checkbox']");
        const p = day.querySelector("p"); // text 
        const img = day.querySelector("img"); // image
        const svg = day.querySelector("svg"); // svg

        checkbox.checked = !checkbox.checked;
        //console.log(checkbox.checked);
        
        // if checked
        // remove original style if they exist
        day.classList.toggle("bg-gray-200");
        day.classList.toggle("border-gray-300/50");

        // text color
        p.classList.toggle("text-green-900");
        
        // hide image and show svg
        img.classList.toggle("hidden");
        svg.classList.toggle("hidden");

        // add new style
        day.classList.toggle("bg-green-100");
        day.classList.toggle("border-green-300/50");
        
        if (checkbox.checked) {
            school_days ++;
            off_days --;
            week_days.push(p.textContent); // add day
        } else {
            school_days --;
            off_days ++;
            week_days = week_days.filter(day => day !== p.textContent); // remove day
        }
        //console.log("School days:", school_days);
        //console.log("Off days:", off_days);
        //console.log(week_days);

    });
    day.addEventListener("mousedown", (event) => event.preventDefault()); // to prevent selecting element if multiple clicks are triggered
});

//let subjects_per_day = "";

const cancel_add = document.querySelector(".cancel-add");
const confirm_add = document.querySelector(".confirm-add");
const add_sub_btn = document.querySelector(".add-subject");

const add_subjects_div = document.getElementById("add-subjects");

add_sub_btn.addEventListener('click', () => {
    add_subjects_div.classList.toggle("hidden");
    document.body.classList.toggle("overflow-hidden"); // remove scroolablity from body
})
cancel_add.addEventListener('click', () => {
    add_subjects_div.classList.toggle("hidden");
    document.body.classList.toggle("overflow-hidden");
});

const textarea = document.querySelector("textarea");

// for placeholder functionality
textarea.addEventListener("input", () => {
    if (textarea.value.length > 0) {
        if (!textarea.nextElementSibling.classList.contains("hidden")) {
            textarea.nextElementSibling.classList.add("hidden");
        }
    } else {
        if (textarea.nextElementSibling.classList.contains("hidden")) {
            textarea.nextElementSibling.classList.remove("hidden");
        }
    }
});

// add input to drop down list
function addInputList() {
    // add input data
    const input = period_dropdown.querySelector("input");
    const lis = dropdown_list.querySelector("ul");
    
    if (periods > 0) {
        input.value = "After Period-1";
        // clear elemnets first
        Array.from(lis.children).forEach(li => {
            li.remove();
        });

        for (let i=1; i <= periods; i++) {
            
            const new_li = document.createElement("li");
            new_li.className = "p-2 hover:bg-blue-300 rounded-sm";
            new_li.textContent = `After Period-${i}`;

            
            lis.appendChild(new_li);
            //lis.innerHTML += `<li class="p-2 hover:bg-blue-300">After Period-${i}</li>`;
            new_li.addEventListener('click', () => {
                if (input.value !== new_li.textContent) { // Prevent redundant updates
                    input.value = new_li.textContent;
                    break_time = String(i); // Store the actual selected value
                    toggle_dropdown(); // Toggle dropdown visibility
                }

            });
        }
    } else {
        // clear ul
        input.value = "";
        Array.from(lis.children).forEach(li => {
            li.remove();
        });
    }
}


const sub_holder = document.getElementById("subjects-box");
// if user confirm, hide overlaid box ,and add input courses
confirm_add.addEventListener('click', () => {
    add_subjects_div.classList.toggle("hidden");
    document.body.classList.toggle("overflow-hidden");
    // make some changes
    //let sub_list = [];

    // Clear holder properly
    Array.from(sub_holder.children).forEach(child => {
        child.remove();
    });

    const textarea = document.getElementById("subjects-input");
    textarea.value.split("\n").forEach(val => {
        let trim_val = val.trim();
        // to capitalize text using custom func
        trim_val = smartCapitalize(trim_val);
        add_subject(sub_holder, trim_val);
        subjects.push(trim_val);
    }); 
    //console.log(textarea.value.split("\n").length);
    //console.log(subjects)
    
}); 

// subject and color mapping
let sub_colors = {};

function add_subject(holder, sub_name) {
    const div = document.createElement("div");
    div.className = "flex justify-between items-center w-[150px] p-2 space-x-2 border border-gray-500/50 rounded-full shadow-sm";

    const new_name = sub_name.length > 7 ? sub_name.slice(0, 4) + "..." : sub_name;

    div.innerHTML = `<div class="flex space-x-1">
                        <p class="flex flex-1 subject">${new_name}</p>
                        <input type="color" class="w-6 h-6 rounded-full aspect-square" value="#ffffff">
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>`;

    // set bg color and text color to subject colors mapping
    if (!sub_colors[sub_name]) {
        sub_colors[sub_name] = {};
    }
    // default values
    sub_colors[sub_name]["bg"] = "#ffffff";
    sub_colors[sub_name]["text"] = "#000000";

    const svg = div.querySelector("svg");
    svg.addEventListener('click', () => {
        // may be display alert box before div is destroyed
        div.remove();
        if (sub_colors[sub_name]) {
            delete sub_colors[sub_name];
        }
        // console.log(sub_colors);
    })

    div.querySelectorAll("input").forEach(elem => {
        // apply chosen color to bg
        elem.addEventListener("input", () => {
            div.style.backgroundColor = elem.value;
        });

        // if this is used in input, it will render too many times if drag and set
        elem.addEventListener('change', () => {
            // add color to respective sub
            sub_colors[sub_name]["bg"] = elem.value;
            // console.log(sub_colors);
        });
    });

    holder.appendChild(div);

}

// for easy capitalizing text inputs
function smartCapitalize(str) {
    if (str.includes(" ")) {
        return str
            .split(" ")
            .map(word => {
            // Leave symbols like & unchanged
            return /^[a-zA-Z]/.test(word)
                ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                : word;
            })
            .join(" ");
    } else {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
}
// console.log(smartCapitalize("moRal & civicS"));
// console.log(smartCapitalize("aPplied sCience"));
// console.log(smartCapitalize("myanamr"));

// test
//let subjects = ["Math", "English", "Science", "History", "Art", "PE"];
//let week_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
let periodsPerDay;
let minClassesPerSubject = school_days; // Each subject must appear at least once per day

// generate button
document.querySelector(".generate-timetable").addEventListener('click', () => {
    makeBest();
}
);


// Function to distribute subjects ( not generating timtable visually, but needed data)
function generateTimetableData(timetable) {
    let subjectCounts = {}; // Track how many times each subject appears

    subjects.forEach(sub => subjectCounts[sub] = 0); // Start count at 0

    week_days.forEach(day => {
        let availableSubjects = [...subjects]; // Clone subject list
        
        // Ensure every subject appears at least once per day
        for (let i = 0; i < subjects.length; i++) {
            let randomIndex = Math.floor(Math.random() * availableSubjects.length);
            let chosenSubject = availableSubjects[randomIndex];

            timetable[day][i] = chosenSubject;
            subjectCounts[chosenSubject]++;
            availableSubjects.splice(randomIndex, 1); // Remove chosen subject
        }

        // Fill remaining periods with balanced assignments
        for (let i = subjects.length; i < periodsPerDay; i++) {
            let subjectPool = subjects.filter(sub => subjectCounts[sub] < minClassesPerSubject);

            // If all subjects have reached minimum count, allow any subject
            if (subjectPool.length === 0) subjectPool = [...subjects];

            let chosenSubject = subjectPool[Math.floor(Math.random() * subjectPool.length)];
            timetable[day][i] = chosenSubject;
            subjectCounts[chosenSubject]++;
        }
    });

    return timetable;
}
//const result = generateTimetable();
//console.log(result);


// Show Breaktime setting
const add_break_time = document.querySelector(".add-break-time");
add_break_time.addEventListener("click", () => {
    document.querySelector(".break-time").classList.toggle("flex");
    document.querySelector(".break-time").classList.toggle("hidden");

    if (!document.querySelector(".break-time").classList.contains("hidden")) {
        add_break_time.querySelector("p").textContent = "Hide Breaktime Setting";
    } else {
        add_break_time.querySelector("p").textContent = "Show Breaktime Setting";
    }

    add_break_time.querySelector("svg").classList.toggle("rotate-180");
    
});
add_break_time.addEventListener("mousedown", (e) => {e.preventDefault()});

// Breaktime Dropdown
const period_dropdown = document.querySelector(".period-dropdown");
const dropdown_list = document.querySelector(".dropdown-list");

period_dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle_dropdown();
});
period_dropdown.addEventListener('mousedown', (e) => { e.preventDefault()});

function toggle_dropdown() {
    period_dropdown.querySelector("svg").classList.toggle("rotate-180");

    if (dropdown_list.classList.contains("opacity-0")) {
        dropdown_list.classList.remove("opacity-0", "-translate-y-1", "pointer-events-none");
        dropdown_list.classList.add("opacity-100", "translate-y-0", "pointer-events-auto");
    } else {
        dropdown_list.classList.remove("opacity-100", "translate-y-0", "pointer-events-auto");
        dropdown_list.classList.add("opacity-0", "-translate-y-1", "pointer-events-none");
    }

}

// to remove focus on input  (cus focus on input persists if another input is focused)
document.addEventListener("click", (event) => {
    document.querySelectorAll("input").forEach((elem) => {
        if (event.target !== elem || document.activeElement !== elem) {
            elem.blur();
        }
    });
    if(dropdown_list.classList.contains("opacity-100") && (event.target !== dropdown_list || document.activeElement !== dropdown_list)) {
        toggle_dropdown();
    }
});
/*
Myanmar
English
Mathematics
Physics
Chemistry
Biology
*/
// correct until now

// not specific function, just to gather needed info
function gatherInfo() { // durations are in minutes
    title = smartCapitalize(document.querySelector(".title").value)|| "Weekly School Timetable";
    start_time = new Date(`2025-01-01T${document.querySelector(".start-time").value}:00`);
    end_time = new Date(`2025-01-01T${document.querySelector(".end-time").value}:00`);
    const num_periods = periods;
    period_duration = document.querySelector(".period-duration").value;
    const bt_after_period = break_time;
    breaktime_duration = document.querySelector(".break-time-duration").value; 
    return { title, start_time, end_time, num_periods, period_duration, bt_after_period, breaktime_duration };
}


// makeBest means make the best timetable :)
function makeBest() {
    // console.log(sub_colors);

    periodsPerDay = periods;
    // Initialize timetable structure
    let timetable = {};
    // sort weekdays with custom sortor which compares index with standard days arrays (daysOrder)
    week_days.sort((a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b));

    week_days.forEach(day => {
        timetable[day] = Array(periodsPerDay).fill(null); // Empty slots
    });
    // console.log(periodsPerDay);
    const days_subjects = generateTimetableData(timetable); // generate subject lists (object)

    if(Object.keys(days_subjects).length === 0) { // to check object is empty or not
        console.log("Not enough facts to create timetable");
        //we should alert user
        return;
    }
    const {title, start_time, end_time, num_periods, period_duration, bt_after_period, breaktime_duration} = gatherInfo();

    const timetable_holder = document.getElementById("timetable-temp");
    timetable_holder.classList.toggle("hidden");

    //set timetable title
    const title_text = document.querySelector("#timetable-image h1");
    console.log(title);
    title_text.textContent = title !== "" ? title : "Weekly School Timetable";
    console.log(title_text.textContent)

    // set title style from stored object
    if (title_style["text"]) title_text.style.color = title_style["text"];
    if (title_style["bold"]) title_text.classList.add("font-bold");
    if (title_style["underline"]) title_text.classList.add("underline");
    if (title_style["italic"]) title_text.classList.add("italic");
    

    insertTableHeader(num_periods, bt_after_period, start_time, end_time, period_duration, breaktime_duration);
    insertTableBody(num_periods, bt_after_period, days_subjects);

}


// draw timetable 
function insertTableHeader(P, bT, sT, eT, pD, btD) {
    
    const thead = document.querySelector("thead");
    const tbody = document.querySelector("tbody");

    const start_time = new Date(sT);

    thead.innerHTML = "";
    // header
    let table_row = `<tr class="bg-blue-600 text-white">`;
    // time
    let timeRow = `<tr class="border bg-blue-400 text-white">`;

     // insert table header row
    const total_p = P + bT.length; // period + breaktime

    btD = parseInt(btD);
    pD = parseInt(pD); // parse into interger

    for (let i=0; i < total_p + 1; i++) {
        // Calculate start and end time
        let startHour = start_time.getHours();
        let startMin = start_time.getMinutes();

        // for each period
        let isBreaktime = i === parseInt(bT)+1 ? btD : pD;
        let endTime = new Date(start_time.getTime() + isBreaktime * 60000);
        let endHour = endTime.getHours();
        let endMin = endTime.getMinutes();

        if (i == 0) {
            table_row += `<th class="p-2 border"></th>`;
            timeRow += `<td class="p-1 border">Time</td>`;

        } else if (i === parseInt(bT)+1) {
            table_row += `<th class="p-2 border bg-amber-600">Break</th>`;
            timeRow += `<td class="p-1 py-2 border bg-amber-600">${timeConverter(startHour, startMin)} - ${timeConverter(endHour, endMin)}</td>`;
            
            // Move to next period time
            start_time.setMinutes(start_time.getMinutes() + isBreaktime); 

        } else {
            table_row += `<th class="p-2 border">Period-${i}</th>`;
            timeRow += `<td class="p-1 py-2 border">${timeConverter(startHour, startMin)} - ${timeConverter(endHour, endMin)}</td>`;

            // Move to next period time
            start_time.setMinutes(start_time.getMinutes() + isBreaktime); 
            
        } 
        
    }

    table_row += `</th>`;
    timeRow += `</tr>`;

    thead.innerHTML += table_row;
    tbody.innerHTML += timeRow;
}


// 13:00 -> 01:00 PM
function timeConverter(hour, minute) {
    // let period = hour >= 12 ? 'PM' : 'AM';
    let hour12 = hour % 12 || 12; // Converts 0 to 12
    let paddedMin = minute.toString().padStart(2, '0');
    return `${hour12}:${paddedMin}`;
}

//insertTableHeader();

function insertTableBody(P, bT, object) {
    const dates_map = {"Mon" : "Monday", "Tue": "Tuesday", "Wed":"Wednesday", "Thu":"Thursday", "Fri":"Friday", "Sat":"Saturday", "Sun":"Sunday"};
    const tbody = document.querySelector("tbody");

    Object.keys(object).forEach(day => {
        let row = `<tr class="border border-gray-300">
                        <td class="p-2 font-semibold">${dates_map[day]}</td>`;
        
        let periodIndex = 0;
        
        // total periods
        const total_p = P + bT.length; // period + breaktime
        for (let i=0; i < total_p; i++) {
            if ( i === parseInt(bT)) {
                row += `<td class="p-2 border bg-amber-600 text-white">Lunch</td>`;
            } else {

                //applied border color via style
                if(Object.keys(sub_colors).length !== 0) {
                    const key = object[day][periodIndex];
                    // console.log(sub_colors);
                    // console.log(key);
                    // console.log(sub_colors[key]);
                    // console.log(sub_colors[key]["bg"]);

                    row += `<td class="p-2 border border-gray-300" style="background-color: ${sub_colors[key]["bg"]};">${object[day][periodIndex]}</td>`;
                } else {
                    row += `<td class="p-2 border border-gray-300">${object[day][periodIndex]}</td>`;
                }
                periodIndex ++;
            }
        }
        row += `</tr>`;
        tbody.innerHTML += row;
    })
}

// insertTableHeader();
// insertTableBody();

const cancel_timetable = document.querySelector(".cancel-timetable")
const get_timetable_img = document.querySelector(".get-timetable");

cancel_timetable.addEventListener('click', () => {
    const thead = document.querySelector("thead");
    const tbody = document.querySelector("tbody");

    // clear table header section
    Array.from(thead.children).forEach(child => {
        if (child) {
            child.remove();
        }
    });
    // clear table body section
    Array.from(tbody.children).forEach(child => {
        if (child) {
            child.remove();
        }
    });

    // hide
    const timetable_holder = document.getElementById("timetable-temp");
    timetable_holder.classList.toggle("hidden");
});

// to download timetable
get_timetable_img.addEventListener('click', () => {
    const timetable = document.getElementById("timetable-image");
    const img_name = timetable.querySelector("h1").textContent.trim();
    
    // Clone the element to avoid affecting the real UI ( to keep image in high pixels)
    const clone = timetable.cloneNode(true);
    clone.style.width = "1000px"; // Set fixed width
    clone.style.height = "600px"; // Optional
    clone.style.transform = "scale(1)";
    clone.style.position = "absolute";
    clone.style.top = "-9999px"; // Off-screen
    document.body.appendChild(clone);
    
    html2canvas(timetable, {
        useCORS: true,
        backgroundColor: null,
    })
    .then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `${filename}.png`;
        link.click();
    })
    .catch(error => {
        console.error("html2canvas failed:", error);
        alert("Export failed due to unsupported styles (e.g., oklch). Try using RGB or HSL colors instead");
    });
    
});



//// for color setting (just for visual currently)
const toggle_color_setting = document.querySelector(".toggle-color-setting");

// toggle color-setting
toggle_color_setting.addEventListener('click', () => {
    toggle_color_setting.classList.toggle("rotate-180");

    const child_divs = document.querySelectorAll(".color-setting > div");
    // toggle setting's divs display
    child_divs.forEach(div => {
        div.classList.toggle("hidden");
        div.classList.toggle("flex");
    })
});
toggle_color_setting.addEventListener('mousedown', (e) => {e.preventDefault()});


// timetable title change event to chage title in color setting
document.querySelector(".title").addEventListener("change", () => {
    title_text.textContent = smartCapitalize(document.querySelector(".title").value);
})

// for Title setting
const title_style = {'text':'#000000', 'bold':false, 'underline':false, 'italic':false};

const title_color_div = document.querySelector("div.title-color");
const title_text = document.querySelector("p.title-color");

// to open color input
title_color_div.addEventListener('click', () => {
    title_color_div.querySelector("input").click();
});

// to change title text color
title_color_div.querySelector("input").addEventListener("input", () => {
    title_text.style.color = title_color_div.querySelector("input").value;

    // store to title style obj
    title_style['text'] = title_color_div.querySelector("input").value;
});

// to make title bold
const title_bold_div = document.querySelector("div.title-bold");
title_bold_div.addEventListener('click', () => {
    title_bold_div.classList.toggle("bg-gray-300")
    title_bold_div.classList.toggle("border-purple-700");
    title_bold_div.firstElementChild.classList.toggle("text-purple-700");

    // change text style
    title_text.classList.toggle("font-bold");

    // store to title style obj
    title_style['bold'] = title_text.classList.contains("font-bold");
});
title_bold_div.addEventListener('mousedown', (e) => {e.preventDefault()}); // to prevent selecting text if many clicks triggered

// title underline
const title_underline_div = document.querySelector("div.title-underline");
title_underline_div.addEventListener('click', () => {
    title_underline_div.classList.toggle("bg-gray-300")
    title_underline_div.classList.toggle("border-purple-700");
    // clickable div's text style
    title_underline_div.firstElementChild.classList.toggle("text-purple-700");
    title_underline_div.firstElementChild.classList.toggle("underline");

    // change text style
    title_text.classList.toggle("underline");

    // store to title style obj
    title_style['underline'] = title_text.classList.contains("underline");
    console.log(title_style);
});
title_underline_div.addEventListener('mousedown', (e) => {e.preventDefault()}); // to prevent selecting text if many clicks triggered

// title italic
const title_italic_div = document.querySelector("div.title-italic");
title_italic_div.addEventListener('click', () => {
    title_italic_div.classList.toggle("bg-gray-300")
    title_italic_div.classList.toggle("border-purple-700");
    // clickable div's text style
    title_italic_div.firstElementChild.classList.toggle("text-purple-700");
    title_italic_div.firstElementChild.classList.toggle("italic");

    // change text style
    title_text.classList.toggle("italic");

    // store to title style obj
    title_style['italic'] = title_text.classList.contains("italic");
});
title_italic_div.addEventListener('mousedown', (e) => {e.preventDefault()}); // to prevent selecting text if many clicks triggered