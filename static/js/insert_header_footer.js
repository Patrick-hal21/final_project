// insert header
// fetch('header.html')
//   .then(response => response.text())
//   .then(html => {
//       // console.log(html);
//       // Create a temporary DOM to parse the HTML
//       const temp = document.createElement('aside');
//       temp.innerHTML = html;
//       console.log(temp);
//       // console.log(temp);
//       // Extract the element you want
//       const navbar = temp.querySelector('#navbar');
//       // const children = footer.children;
//       // console.log(children.length);

//       // Append it to the placeholder
//       if (navbar) {
//           document.getElementById('header').appendChild(navbar.cloneNode(true));
//       }
//   })
//   .catch(error => {
//       console.error('Failed to load navbar:', error);
// });

// fetch footer and insert

fetch('footer.html')
    .then(response => response.text())
    .then(html => {
        // console.log(html);
        // Create a temporary DOM to parse the HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;

        // console.log(temp);
        // Extract the element you want
        const footer = temp.querySelector('#footer-to-insert');
        // const children = footer.children;
        // console.log(children.length);

        // Append it to the placeholder
        if (footer) {
        document.getElementById('footer').appendChild(footer.cloneNode(true));
        }
    })
    .catch(error => {
        console.error('Failed to load navbar:', error);
});