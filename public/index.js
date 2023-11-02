function swapOptions() {
    var dropdown1 = document.getElementById("dropdown1");
    var dropdown2 = document.getElementById("dropdown2");
    var selectedOption = dropdown1.value;
    dropdown1.value = dropdown2.value;
    dropdown2.value = selectedOption;
}

var button = document.querySelector(".swap");
button.addEventListener("click", swapOptions);

var radioButtons = document.querySelectorAll(".radio-button");
radioButtons.forEach(function (i) {
    i.addEventListener("click", function () {
        radioButtons.forEach(function (j) {
            j.classList.remove("active");
        });
        i.classList.add("active");
    })
});


// var anchors = document.querySelectorAll('.calculation-nav>a');
// anchors.forEach(function(anchor) {
//   anchor.addEventListener('click', function() {
//     // Set the background color and save the state in localStorage
//     this.classList.add('active');
//     localStorage.setItem('activeAnchor', this.textContent);
//   });
// });

// // Check if an anchor was clicked previously and apply the background color
// var activeAnchorText = localStorage.getItem('activeAnchor');
// console.log("ActiveAnchorText: ", activeAnchorText);
// if (activeAnchorText) {
//   var activeAnchor = Array.from(anchors).find(function(anchor) {
//     return anchor.textContent === activeAnchorText;
//   });
//   if (activeAnchor) {
//     activeAnchor.classList.add('active');
//   }
// }

localStorage.clear();