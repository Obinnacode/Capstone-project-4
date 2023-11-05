function swapOptions() {
    var dropdown1 = document.getElementById("dropdown1");
    var dropdown2 = document.getElementById("dropdown2");
    var selectedOption = dropdown1.value;
    dropdown1.value = dropdown2.value;
    dropdown2.value = selectedOption;
}

var button = document.querySelector(".swap");
button.addEventListener("click", swapOptions);
const chartRadio = document.getElementById("chart");

//hide elements not needed when chart tab is selected
document.getElementById("chart").addEventListener("click", function() {
    document.querySelector("input[value='View Chart']").classList.remove("hidden");
    document.querySelector("input[value=Convert").classList.add("hidden");
    document.querySelector(".calculation-result").classList.add("hidden");
    document.querySelector(".qty").classList.add("hidden"); 
    document.getElementById("amount").removeAttribute("required");      
})
//Undo changes when convert tab is selected
document.getElementById("convert").addEventListener("click", function() {
    document.querySelector("input[value='View Chart']").classList.add("hidden");
    document.querySelector("input[value=Convert").classList.remove("hidden");
    document.querySelector(".calculation-result").classList.remove("hidden");
    document.querySelector(".qty").classList.remove("hidden"); 
    document.getElementById("amount").setAttribute("required","true");    
})

if(chartRadio.checked){
    document.querySelector("input[value='View Chart']").classList.remove("hidden");
    document.querySelector("input[value=Convert").classList.add("hidden");
    document.querySelector(".calculation-result").classList.add("hidden");
    document.querySelector(".qty").classList.add("hidden"); 
    document.getElementById("amount").removeAttribute("required");  
}


document.querySelector(".calculation-result > button").addEventListener("click", function(){
    document.getElementById("chart").click();
    document.querySelector("input[value='View Chart']").click()
})