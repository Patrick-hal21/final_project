document.getElementById("stdBox").addEventListener("click", function() {
    document.getElementById("stdTimetable").click();
});

document.getElementById("trBox").addEventListener("click", function() {
    document.getElementById("trTimetable").click();
});

function updateTImetable (input, box) {
    document.getElementById(input).addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            img.onload = () => URL.revokeObjectURL(img.src); // Free memory
            document.getElementById(box).innerHTML = "";
            img.classList.add("max-w-full", "max-h-full");
            document.getElementById(box).appendChild(img);
        }
    });
}
updateTImetable("trTimetable", "trBox");
updateTImetable("stdTimetable", "stdBox");
