const user_id_type = document.getElementById("user_id").textContent.split("-")[0];

document.getElementById("stdBox").addEventListener("click", function() {
    document.getElementById("stdTimetable").click();

    // to change dash border color
    document.querySelector(".upload-box svg rect").classList.remove("stroke-gray-300");
    document.querySelector(".upload-box svg rect").classList.add("stroke-blue-500");

    // if (document.getElementById("stdBox").contains(document.getElementById("stdBox").querySelector("img"))) {
    //     document.querySelector(".upload-box svg rect").classList.remove("stroke-blue-500");
    // }
    
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
            img.classList.add("w-full", "h-full");
            document.getElementById(box).appendChild(img);
        }
    });
}
updateTImetable("trTimetable", "trBox");
updateTImetable("stdTimetable", "stdBox");

// Charts

document.querySelector(".create-chart").onclick = updateChart;

function updateChart() {
    document.querySelector(".switch-hide").classList.remove("hidden");
    // add today date
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    document.getElementById("today_stats").textContent = `Today (${formattedDate})`;
    // create chart
    const ctx = document.getElementById("stdChart").getContext("2d");

    // Destroy previous chart if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Math', 'Science', 'English', 'History', 'Geography', 'Art'],
            datasets: [
            { label: 'Class A', data: [30, 25, 28, 22, 20, 18], backgroundColor: 'rgba(255, 99, 132, 0.7)', hoverBackgroundColor: 'rgba(255, 99, 132, 0.9)' },
            { label: 'Class B', data: [25, 30, 27, 24, 22, 20], backgroundColor: 'rgba(54, 162, 235, 0.7)', hoverBackgroundColor: 'rgba(54, 162, 235, 0.9)' },
            { label: 'Class C', data: [20, 22, 25, 30, 28, 26], backgroundColor: 'rgba(255, 206, 86, 0.7)', hoverBackgroundColor: 'rgba(255, 206, 86, 0.9)' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            
            scales: { y: { beginAtZero: true } },
            animation: {
              duration: 1000, // Smooth transition
              easing: 'easeInOutQuart' // Custom easing effect
            }
        }
    });
}