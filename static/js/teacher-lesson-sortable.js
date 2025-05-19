
// export function makeSortable() {

    
// }
const container = document.getElementById('sortableDivs');
export const sortable = new Sortable(document.getElementById('sortableDivs'), { // to use in teacher.js
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

export function makeResizableDivs() {
    document.querySelectorAll('.card').forEach(el => {
        el.dataset.originalWidth = el.offsetWidth;
        el.dataset.originalHeight = el.offsetHeight;
        console.log("Current height", el.getAttribute("height"));
        interact(el).resizable({
            edges: { left: false, right: false, bottom: true, top: true },
            listeners: {
            move(event) {
                let target = event.target;
                let x = (parseFloat(target.getAttribute('data-x')) || 0);
                let y = (parseFloat(target.getAttribute('data-y')) || 0);

                // update width/height
                // target.style.width = `${event.rect.width}px`;
                target.style.height = `${event.rect.height}px`;

                // move it accordingly
                // x += event.deltaRect.left;
                y += event.deltaRect.top;

                // target.style.transform = `translate(${x}px, ${y}px)`;
                target.style.transform = `translate(${y}px)`;
                // target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
            },
            modifiers: [
            interact.modifiers.restrictSize({
                // min: { width: 150, height: 100 },
                min: {height: 100},
                // max: { width: window.innerWidth, height: window.innerHeight }
                max: { height: window.innerHeight }
            })
            ],
            inertia: true
        });
    });
}


function removeResizablity() {
  document.querySelectorAll('.resizable-div').forEach(el => {
    el.style.width = `${el.dataset.originalWidth}px`;
    el.style.height = `${el.dataset.originalHeight}px`;
    el.style.transform = '';
    el.removeAttribute('data-x');
    el.removeAttribute('data-y');
    interact(el).unset(); // disable interact.js
  });
}