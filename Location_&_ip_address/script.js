let pInHtml = document.getElementById("ipAdress");
let ip;
let lat;
let long;
let city;
let org;
let region;
let host;
let num;
function handleIP(response) {
  console.log(response);
  ip = response.ip;
  pInHtml.innerText = ip;
  fetch(
    `https://ipinfo.io/${ip}/json?token=d27e1ac6bbfcdc`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      lat = data.loc.split(",")[0];
      long = data.loc.split(",")[1];
      city = data.city;
      org = data.org;
      region = data.region;
      host = ip;

      let values = [lat, city, org, long, region, host];
      let arr = [
        "Lat :",
        "City :",
        "Organization :",
        "Long :",
        "Region :",
        "Hostname :",
      ];

      let iFrame = document.getElementsByTagName("iframe")[0];
      iFrame.setAttribute(
        "src",
        `https://maps.google.com/maps?q=${lat}, ${long}&z=15&output=embed`
      );

      let onclickDiv = document.getElementById("onclick-div");
      let onclickDivInfo = document.getElementById("onclick-div-info");
      let onclickDivMap = document.getElementById("onclick-div-map");
      let onclickDivTimeZoneAndAll = document.getElementById(
        "onclick-div-timeZoneAndAll"
      );

      for (let i = 0; i < arr.length; i++) {
        let h = document.createElement("h3");
        h.innerText = arr[i] + " " + values[i];
        onclickDivInfo.append(h);
      }
      fetchAndDisplayAllPostOffices(city);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function fetchIp() {
  $.getJSON("https://api.ipify.org/?format=json", handleIP);
}

function fetchAndDisplayAllPostOffices(city) {
    fetch(`https://api.postalpincode.in/postoffice/${city}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const displayPostOfficeDiv = document.getElementById(
          "onclick-div-displayPostOffice"
        );
  
        // Clear the existing content
        displayPostOfficeDiv.innerHTML = "";
  
        const targetDate = new Date();
        const timezoneOffset = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const datetime = targetDate.toLocaleString("en-US", {
          timeZone: timezoneOffset,
        });
  
        // Update the timezone, date, and time elements
        const timezoneElement = document.querySelector("p#timezone span");
        const dateTimeElement = document.querySelector("p#date-time span");
        const pincodeElement = document.querySelector("p#pincode span");
        const messageElement = document.querySelector("p#message span");
  
        timezoneElement.textContent = `${timezoneOffset}`;
        dateTimeElement.textContent = `${datetime}`;
        pincodeElement.textContent = `${data[0].PostOffice[0].Pincode}`;
        messageElement.textContent = data[0].Message;
  
        // Store the data in localStorage
        localStorage.setItem("cityData", JSON.stringify(data));
  
        data[0].PostOffice.forEach((postOffice) => {
          const postOfficeDiv = document.createElement("div");
          postOfficeDiv.classList.add("post-office-item");
          postOfficeDiv.style.width = "20vw";
          postOfficeDiv.style.border = "2px solid black";
          postOfficeDiv.style.padding = "10px";
          postOfficeDiv.style.margin = "10px";
          postOfficeDiv.style.display = "flex";
          postOfficeDiv.style.flexDirection = "column";
  
          const nameDiv = document.createElement("div");
          nameDiv.textContent = "Name: " + postOffice.Name;
  
          const branchTypeDiv = document.createElement("div");
          branchTypeDiv.textContent = "Branch Type: " + postOffice.BranchType;
  
          const deliveryStatusDiv = document.createElement("div");
          deliveryStatusDiv.textContent =
            "Delivery Status: " + postOffice.DeliveryStatus;
  
          const districtDiv = document.createElement("div");
          districtDiv.textContent = "District: " + postOffice.District;
  
          const divisionDiv = document.createElement("div");
          divisionDiv.textContent = "Division: " + postOffice.Division;
  
          postOfficeDiv.appendChild(nameDiv);
          postOfficeDiv.appendChild(branchTypeDiv);
          postOfficeDiv.appendChild(deliveryStatusDiv);
          postOfficeDiv.appendChild(districtDiv);
          postOfficeDiv.appendChild(divisionDiv);
  
          displayPostOfficeDiv.appendChild(postOfficeDiv);
  
          // Store each post office div in localStorage
          const postOfficeData = {
            name: postOffice.Name,
            html: postOfficeDiv.innerHTML,
          };
          localStorage.setItem(postOffice.Name, JSON.stringify(postOfficeData));
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  
  function searchPostOffice() {
    const input = document.querySelector('input[type="text"]');
    const searchValue = input.value.toLowerCase();
    const displayPostOfficeDiv = document.getElementById(
      "onclick-div-displayPostOffice"
    );
  
    // Clear the existing content
    displayPostOfficeDiv.innerHTML = "";
  
    // Retrieve the stored data from localStorage
    const storedData = localStorage.getItem("cityData");
  
    if (storedData) {
      const data = JSON.parse(storedData);
  
      data[0].PostOffice.forEach((postOffice) => {
        const storedPostOfficeData = localStorage.getItem(postOffice.Name);
        if (storedPostOfficeData) {
          const postOfficeData = JSON.parse(storedPostOfficeData);
          if (postOfficeData.name.toLowerCase().includes(searchValue)) {
            const postOfficeDiv = document.createElement("div");
            postOfficeDiv.innerHTML = postOfficeData.html;
            postOfficeDiv.classList.add("post-office-item");
            postOfficeDiv.style.width = "20vw";
            postOfficeDiv.style.border = "2px solid black";
            postOfficeDiv.style.padding = "10px";
            postOfficeDiv.style.margin = "10px";
            postOfficeDiv.style.display = "flex";
            postOfficeDiv.style.flexDirection = "column";
            displayPostOfficeDiv.appendChild(postOfficeDiv);
          }
        }
      });
    }
  }
  
  // Add event listener for input search
  const input = document.querySelector('input[type="text"]');
  input.addEventListener("input", searchPostOffice);

  

function toggleOnClickDiv() {
    const onClickDiv = document.getElementById("onclick-div");
    
    onClickDiv.style.visibility = "visible";
}
