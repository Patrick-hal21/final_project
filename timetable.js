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
    /* else if (value > 10) {
        this.value = 10; // Reset to maximum if invalid
    }*/
    periods = parseInt(this.value,0);
    console.log(periods);

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
            new_li.className = "p-2 hover:bg-blue-300";
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
        const trim_val = val.trim();
        add_subject(sub_holder, trim_val);
        subjects.push(val);
    }); 
    //console.log(textarea.value.split("\n").length);
    //console.log(subjects)
    
}); 

function add_subject(holder, sub_name) {
    const div = document.createElement("div");
    div.className = "flex justify-between w-[150px] p-2 space-x-2 border border-gray-500/50 rounded-full shadow-sm";

    div.innerHTML = `<p class="flex flex-1 subject">${sub_name}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>`
    const svg = div.querySelector("svg");
    svg.addEventListener('click', () => {
        // may be display alert box before div is destroyed
        div.remove();
    })
    holder.appendChild(div);
}

// test
//let subjects = ["Math", "English", "Science", "History", "Art", "PE"];
//let week_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
let periodsPerDay = periods;
let minClassesPerSubject = school_days; // Each subject must appear at least once per day

// generate button
document.querySelector(".generate-timetable").addEventListener('click', () => {
    makeBest();
}
);

function makeBest() {
    // Initialize timetable structure
    let timetable = {};
    // sort weekdays with custom sortor which compares index with standard days arrays (daysOrder)
    week_days.sort((a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b));

    week_days.forEach(day => {
        timetable[day] = Array(periodsPerDay).fill(null); // Empty slots
    });
    const result = generateTimetable(timetable); // generate subject lists (object)
    if(Object.keys(result).length === 0) { // to check object is empty or not
        console.log("Not enough facts to create timetable");
        return;
    }
    console.log(result);
    gatherInfo();

}

function gatherInfo() { // durations are in minutes
    title = document.querySelector(".title").textContent || "Weekly School Timetable";
    start_time = `2025-01-01T${document.querySelector(".start-time").value}:00`;
    end_time = `2025-01-01T${document.querySelector(".end-time").value}:00`;
    periods;
    period_duration = document.querySelector(".period-duration").value;
    break_time; //string
    breaktime_duration = document.querySelector(".break-time-duration").value; 
    console.log(title, start_time, end_time, periods, period_duration, break_time, breaktime_duration);
}

// Function to distribute subjects
function generateTimetable(timetable) {
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
add_break_time.addEventListener("mousedown", (e) => {e.preventDefault});

// Breaktime Dropdown
const period_dropdown = document.querySelector(".period-dropdown");
const dropdown_list = document.querySelector(".dropdown-list");

period_dropdown.addEventListener('click', () => {
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
});
/*
Myanmar
English
Mathematics
Physics
Chemistry
Biology

function gatherInfo() { // durations are in minutes
    title = document.querySelector(".title").textContent || "Weekly School Timetable";
    start_time = `2025-01-01T${document.querySelector(".start-time").value}:00`;
    end_time = `2025-01-01T${document.querySelector(".end-time").value}:00`;
    periods;
    period_duration = document.querySelector(".period-duration").value;
    break_time;
    breaktime_duration = document.querySelector(".break-time-duration").value; 
    console.log(title, start_time, end_time, periods, period_duration, break_time, breaktime_duration);
}
*/



// draw timetable 
function insertTableHeader(P = 7, bT="4", sT, eT, pD, btD) {
    
    const thead = document.querySelector("thead");
    thead.innerHTML = "";
    let table_row = `<tr class="bg-blue-600 text-white">`;
    let timeRow = `<tr class="border border-gray-300">
                        <td class="p-2 border font-semibold">Time</td>`;

    // insert table header row
    const total_p = P + bT.length; // period + breaktime
    
    for (let i=0; i < total_p + 1; i++) {
        if (i == 0) {
            table_row += `<th class="p-2 border"></th>`
        } else if (i === parseInt(bT)) {
            table_row += `<th class="p-2 border bg-amber-600">Break</th>`
        } else {
            table_row += `<th class=p-2 border">Period-${i}</th>`
        } 
    }
    table_row += `</th>`;

    thead.innerHTML += table_row;
}

//insertTableHeader();

function insertTableBody(title, sT, eT, P = 7, pD, bT="4", btD, sub_day_map, object) {
    const object_demo = {
        "Mon": [
            "Mathematics",
            "English",
            "Chemistry",
            "Myanmar",
            "Biology",
            "Physics"
        ],
        "Tue": [
            "Physics",
            "Myanmar",
            "Biology",
            "English",
            "Chemistry",
            "Mathematics"
        ],
        "Wed": [
            "Myanmar",
            "Biology",
            "Physics",
            "English",
            "Mathematics",
            "Chemistry"
        ],
        "Thu": [
            "Myanmar",
            "Physics",
            "Chemistry",
            "Biology",
            "English",
            "Mathematics"
        ],
        "Fri": [
            "Myanmar",
            "Biology",
            "Physics",
            "Mathematics",
            "English",
            "Chemistry"
        ]
    };

    Object.keys(object).forEach(day => {
        let row = `<tr class="border border-gray-300">
                        <td class="p-2 border font-semibold">${day}</td>`;
    
    })
}