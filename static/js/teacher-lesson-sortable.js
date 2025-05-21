///// Editing course content

// const container = document.getElementById('sortableDivs');
const sortable = new Sortable(document.getElementById('sortableDivs'), { // to use in teacher.js
    animation: 150,
    ghostClass: 'bg-gray-300',
    direction: 'vertical',
    handle: '.card', // optional, but you could use a drag handle class instead
    filter: '.fixed-div', // prevents dragging this
    //preventOnFilter: false, // optional: allow click events on it
    onMove: function (evt) {
    // Disallow dropping before or after the fixed element
    const dragged = evt.dragged;
    const related = evt.related;
    
    if (related.classList.contains('fixed-div')) {
        return false; // block drop
    }
    }
    // ,
    // onEnd: function (evt) { // this wont be used
    //     const items = Array.from(evt.to.children);
    //     console.log(items);
    //     const newOrder = items
    //     .filter(item => item.dataset.id !== undefined) // omit divs without data-id
    //     .map(item => item.dataset.id);

    //     localStorage.setItem('sortableRowOrder', JSON.stringify(newOrder));
    //     console.log("New card order:", newOrder);
    //     const newBody = items
    //     .filter(item => item.dataset.id !== undefined)
    //     .map(item => item.outerHTML);

    //     console.log("New card body:", newBody);

    // }
});

// Disable sorting when not in editing mode
sortable.option("disabled", true);


const edit_btn = document.querySelector(".edit-btn");
const done_btn = document.querySelector(".done-btn");

// import { sortable } from "./teacher-lesson-sortable.js"; // to allow divs to drag and place
// import { makeResizableDivs } from "./teacher-lesson-sortable.js"; // to allow divs to resize ( not used yet)

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


// to order div if teacher reoreder lesson divs
const container = document.getElementById('sortableDivs');

window.onload = orderLessonDiv;
function orderLessonDiv() {
  const savedOrder = JSON.parse(localStorage.getItem('sortableRowOrder'));
  if (savedOrder) {
    const itemsById = {};
    Array.from(container.children).forEach(item => {
      if (item.dataset.id) {
        itemsById[item.dataset.id] = item;
      }
    });

    // Re-append elements in saved order
    savedOrder.forEach(id => {
      if (itemsById[id]) {
        container.appendChild(itemsById[id]);
      }
    });

    // Move any item without data-id (like the Add New div) to the end
    Array.from(container.children).forEach(item => {
      if (!item.dataset.id) {
        container.appendChild(item); // moves it to the end
      }
    });
  }
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


// Restore order on page load
// window.onload = orderLessonDiv;
// function orderLessonDiv() {
//   const savedOrder = JSON.parse(localStorage.getItem('sortableRowOrder'));
//   if (savedOrder) {
//     const itemsById = {};
//     Array.from(container.children).forEach(item => {
//       if (item.dataset.id) {
//         itemsById[item.dataset.id] = item;
//       }
//     });

//     // Re-append elements in saved order
//     savedOrder.forEach(id => {
//       if (itemsById[id]) {
//         container.appendChild(itemsById[id]);
//       }
//     });

//     // Move any item without data-id (like the Add New div) to the end
//     Array.from(container.children).forEach(item => {
//       if (!item.dataset.id) {
//         container.appendChild(item); // moves it to the end
//       }
//     });
//   }
// }

//// make divs resizable

// export function makeResizableDivs() {
//     document.querySelectorAll('.card').forEach(el => {
//         el.dataset.originalWidth = el.offsetWidth;
//         el.dataset.originalHeight = el.offsetHeight;
//         console.log("Current height", el.getAttribute("height"));
//         interact(el).resizable({
//             edges: { left: false, right: false, bottom: true, top: true },
//             listeners: {
//             move(event) {
//                 let target = event.target;
//                 let x = (parseFloat(target.getAttribute('data-x')) || 0);
//                 let y = (parseFloat(target.getAttribute('data-y')) || 0);

//                 // update width/height
//                 // target.style.width = `${event.rect.width}px`;
//                 target.style.height = `${event.rect.height}px`;

//                 // move it accordingly
//                 // x += event.deltaRect.left;
//                 y += event.deltaRect.top;

//                 // target.style.transform = `translate(${x}px, ${y}px)`;
//                 target.style.transform = `translate(${y}px)`;
//                 // target.setAttribute('data-x', x);
//                 target.setAttribute('data-y', y);
//             }
//             },
//             modifiers: [
//             interact.modifiers.restrictSize({
//                 // min: { width: 150, height: 100 },
//                 min: {height: 100},
//                 // max: { width: window.innerWidth, height: window.innerHeight }
//                 max: { height: window.innerHeight }
//             })
//             ],
//             inertia: true
//         });
//     });
// }


// function removeResizablity() {
//   document.querySelectorAll('.resizable-div').forEach(el => {
//     el.style.width = `${el.dataset.originalWidth}px`;
//     el.style.height = `${el.dataset.originalHeight}px`;
//     el.style.transform = '';
//     el.removeAttribute('data-x');
//     el.removeAttribute('data-y');
//     interact(el).unset(); // disable interact.js
//   });
// }