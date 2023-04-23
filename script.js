
const getType = function (type) {
  if (type.toLowerCase().includes("humidity_out")) {
    return "Humidity Outside";
  } else if (type.toLowerCase().includes("wind_speed")) {
    return "Wind Speed";
  } else if (type.toLowerCase().includes("humidity_in")) {
    return "Humidity Inside";
  } else if (type.toLowerCase().includes("rain")) {
    return "Rain";
  } else if (type.toLowerCase().includes("direction")) {
    return "Wind Direction";
  } else if (type.toLowerCase().includes("temp")) {
    return "Temperature";
  } else if (type.toLowerCase().includes("light")) {
    return "Light";
  } else if (type.toLowerCase().includes("pres")) {
    return "Air Pressure";
  } else {
    return type;
  }
};
// light/dark mode

const bodyID = document.getElementById("bodyID");
const titleID = document.getElementById("titleID");
const modebutton = document.getElementById("mode-toggle");

let isDark = false;

modebutton.addEventListener("click", function () {
  if (isDark) {
    bodyID.style.backgroundColor = "#f2e3d0";
    titleID.style.backgroundColor = "#f2e3d0";
    isDark = false;
  } else {
    bodyID.style.backgroundColor = "#6d6875";
    titleID.style.backgroundColor = "#6d6875";
    isDark = true;
  }
});

//buttons
const infotab = document.getElementById("infotab");
const maintab = document.getElementById("maintab");
const temptab = document.getElementById("temptab");
const windtab = document.getElementById("windtab");
const moretab = document.getElementById("moretab");
const random = document.getElementById("random");
const mainpage = document.getElementById("mainpage");
const firstpage = document.getElementById("firstpage");
const secondpage = document.getElementById("secondpage");
const thirdpage = document.getElementById("thirdpage");
const information = document.getElementById("information");
const more = document.getElementById("more");

infotab.addEventListener("click", function () {
  firstpagestuff.style.display = "none";
  mainpage.style.display = "none";
  secondpage.style.display = "none";
  thirdpage.style.display = "none";
  information.style.display = "flex";
  more.style.display = "none";
  temptable.style.display = "none";
  random.style.display = "block";
});
maintab.addEventListener("click", function () {
  secondpage.style.display = "none";
  mainpage.style.display = "block";
  temptable.style.display = "none";
  firstpagestuff.style.display = "flex";
  thirdpage.style.display = "none";
  information.style.display = "none";
  more.style.display = "none";
  random.style.display = "none";
});
temptab.addEventListener("click", function () {
  thirdpage.style.display = "none";
  mainpage.style.display = "none";
  firstpagestuff.style.display = "none";
  secondpage.style.display = "flex";
  information.style.display = "none";
  more.style.display = "none";
  temptable.style.display = "flex";
  random.style.display = "none";
});
windtab.addEventListener("click", function () {
  information.style.display = "none";
  mainpage.style.display = "none";
  firstpagestuff.style.display = "none";
  secondpage.style.display = "none";
  thirdpage.style.display = "flex";
  more.style.display = "none";
  temptable.style.display = "none";
  random.style.display = "none";
});
moretab.addEventListener("click", function () {
  more.style.display = "block";
  mainpage.style.display = "none";
  firstpagestuff.style.display = "none";
  secondpage.style.display = "none";
  thirdpage.style.display = "none";
  information.style.display = "none";
  temptable.style.display = "none";
  random.style.display = "none";
});
fetch("http://webapi19sa-1.course.tamk.cloud/v1/weather")
  .then((response) => response.json())
  .then((data) => {
    let mainData = data.filter((item) => item.hasOwnProperty("id"));
    const tabledata = document.querySelector("#data-table tbody");
    const tableBody2 = document.querySelector("#data-table-2 tbody");

    mainData = mainData.slice(0, 30).reverse();

    let counter = 0;
    if (mainData.length === 0) {
      const newrow = tabledata.insertRow();
      const newcell = newrow.insertCell();
      newcell.textContent = "haha noob no data found";

      newcell.colSpan =
        tabledata.previousElementSibling.getElementsByTagName("th").length;
    } else {
      for (let i = 0; i < 15; i++) {
        const item = mainData[i];
        const rowdata = [];
        counter++;
        rowdata.push(counter);
        rowdata.push(item.date_time.slice(0, 10));
        rowdata.push(item.date_time.slice(11, 19));
        Object.keys(item.data).forEach((key) => {
          rowdata.push(getType(key));
          rowdata.push(item.data[key]);
        });

        const row = tabledata.insertRow();
        rowdata.forEach((value) => {
          row.insertCell().textContent = value;
        });
      }
      for (let i = 15; i < 30; i++) {
        const item = mainData[i];
        const rowdata = [];
        counter++;
        rowdata.push(counter);
        rowdata.push(item.date_time.slice(0, 10));
        rowdata.push(item.date_time.slice(11, 19));
        Object.keys(item.data).forEach((key) => {
          rowdata.push(getType(key));
          rowdata.push(item.data[key]);
        });

        const row = tableBody2.insertRow();
        rowdata.forEach((value) => {
          row.insertCell().textContent = value;
        });
      }
    }
  })
  .catch((error) => console.error(error));

window.addEventListener("load", function () {
  const timetemp = document.getElementById("tempselect");
  timetemp.value = "";
  timetemp.dispatchEvent(new Event("change"));
});

let chart1;
const timetemp = document.getElementById("tempselect");
const apiaddress = "http://webapi19sa-1.course.tamk.cloud/v1/weather/temperature/";


timetemp.addEventListener("change", function () {
  const selectedoption = timetemp.value;
  const apiurl = apiaddress + selectedoption;

  fetch(apiurl)
    .then((response) => response.json())
    .then((data) => {
      const temperaturedata = data.filter((item) =>
        item.hasOwnProperty("temperature")
      );

      const labels = data.map((item) => item.date_time.slice(11, 16));
      const temperatures = data.map((item) => item.temperature);
      const temperaturechart = document.getElementById("temperature-chart").getContext("2d");
      const tabledata = document.querySelector("#tempdata tbody");
      let counter = 0;

      if (temperaturedata.length === 0) {
        const newrow = tabledata.insertRow();

        const newcell = newrow.insertCell();
        newcell.textContent = "haha noob no data found";

        newcell.colSpan =
          tabledata.previousElementSibling.getElementsByTagName("th").length;
      } else { 
               tabledata.innerHTML = "";

        if (chart1) {
          chart1.destroy();
        }

        temperaturedata.forEach((item) => {
          const rowdata = [];
          counter++;
          rowdata.push(counter);
          rowdata.push(item.date_time.slice(0, 10));
          rowdata.push(item.date_time.slice(11, 19));
          rowdata.push(item.temperature);

          const row = tabledata.insertRow();
          rowdata.forEach((value) => {
            row.insertCell().textContent = value;
          });
        });

        chart1 = new Chart(temperaturechart, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Temperature (°C)",
                data: temperatures,
                borderColor: "#e5989b",
                backgroundColor: "#e5989b",
                tension: 0.3,
              },
            ],
          },
          options: {
            scales: {
              x: {
                 ticks: {
                color: '#b5838d',
              },
                beginAtZero: true,
              },    
             
              y: {
                ticks: {
                  color: '#b5838d',
                },
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: "#b5838d",
                },
              },
            },
          },
        });
      }
    })
    .catch((error) => console.error(error));
});

window.addEventListener("load", function () {
  const windtime = document.getElementById("windselect");
  windtime.value = "";
  windtime.dispatchEvent(new Event("change"));
});

let windchart;

const windtime = document.getElementById("windselect");
const windapi = "http://webapi19sa-1.course.tamk.cloud/v1/weather/wind_speed/";

windtime.addEventListener("change", function () {
  const selectedoption = windtime.value;
  const windurl = windapi + selectedoption;

  fetch(windurl)
    .then((response) => response.json())
    .then((data) => {
      const windspeeddata = data.filter((item) =>
        item.hasOwnProperty("wind_speed")
      );
      let counter = 0;

      const labels2 = data.map((item) => item.date_time.slice(11, 16));

      const windspeed = data.map((item) => item.wind_speed);
      const windspeedchart = document.getElementById("windchart").getContext("2d");
      const tabledata = document.querySelector("#windspeedchart tbody");

      if (windspeeddata.length === 0) {
        const newrow = tabledata.insertRow();

        const newcell = newrow.insertCell();
        newcell.textContent = "haha noob no data found";

        newcell.colSpan =
          tabledata.previousElementSibling.getElementsByTagName("th").length;
      } else {
                tabledata.innerHTML = "";

        if (windchart) {
          windchart.destroy();
        }
        windspeeddata.forEach((item) => {
          const rowdata = [];
          counter++;
          rowdata.push(counter);
          rowdata.push(item.date_time.slice(0, 10));
          rowdata.push(item.date_time.slice(11, 19));
          rowdata.push(item.wind_speed);

          const row = tabledata.insertRow();
          rowdata.forEach((value) => {
            row.insertCell().textContent = value;
          });
        });
        windchart = new Chart(windspeedchart, {
          type: "bar",
          data: {
            labels: labels2,
            datasets: [
              {
                label: "Wind Speed",
                data: windspeed,

                borderColor: "#e5989b",
                backgroundColor: "#e5989b",
                tension: 0.3,
              },
            ],
          },
          options: {
            scales: {
              x: {
                ticks: {
               color: '#b5838d',
             },
               beginAtZero: true,
             },    
            
             y: {
               ticks: {
                 color: '#b5838d',
               },
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: "#b5838d",
                },
              },
            },
          },
        });
      }
    })
    .catch((error) => console.error(error));
});

window.addEventListener("load", function () {
  const moretimeselect = document.getElementById(
    "moretime"
  );
  const moretypeselect = document.getElementById("type");
  moretimeselect.value = "";
  moretypeselect.value = "temperature";
    moretypeselect.dispatchEvent(new Event("change"));

});
let morechart;

const moretimeselect = document.getElementById("moretime");
const moretypeselect = document.getElementById("type");

const moreapi = "http://webapi19sa-1.course.tamk.cloud/v1/weather/";

moretimeselect.addEventListener("change", function () {
  const timeselectionmore = document.getElementById("moretime");
  const moretypeselect = document.getElementById("type");
  const moreoption = timeselectionmore.value;
  const selectedtype = moretypeselect.value;
  const moreurl =
    moreapi + selectedtype + "/" + moreoption;


  if (moreoption === "") {

    fetch(moreapi)
      .then((response) => response.json())
      .then((data) => {
        const moredata2 = data.filter((item) =>
          item.data.hasOwnProperty(selectedtype)
        );
        const selecteddatemore = data
          .map((item) => {
            if (item.data.hasOwnProperty(selectedtype)) {
              return item.date_time.slice(0, 10);
            } else {
              return null;
            }
          })
          .filter((item) => item !== null);

        const selectedtimemore = data
          .map((item) => {

            if (item.data.hasOwnProperty(selectedtype)) {
              return item.date_time.slice(11, 16);
            } else {
              return null;
            }
          })
          .filter((item) => item !== null);


        const morevalue = data
          .map((item) => {
            if (item.data.hasOwnProperty(selectedtype)) {
              return item.data[selectedtype];
            } else {
              return null;
            }
          })
          .filter((item) => item !== null);

        const datapoints = [];
        minvalue = Math.min(24, moredata2.length);
        for (let i = minvalue; i >= 0; i--) {
          datapoints[i] = morevalue[i];
        }

        const timedatapoints = [];
        minvalue = Math.min(24, moredata2.length);
        for (let i = minvalue; i >= 0; i--) {
          timedatapoints[i] = selectedtimemore[i];
        }

        const morechart2 = document
          .getElementById("morechart")
          .getContext("2d");
        const tabledata = document.querySelector("#moredata tbody");
        let counter = 0;

        if (moredata2.length === 0) {
          tabledata.innerHTML = "";
          const newrow = tabledata.insertRow();

          const newcell = newrow.insertCell();
          newcell.textContent = "haha noob no data found";

          newcell.colSpan =
            tabledata.previousElementSibling.getElementsByTagName("th").length;
        } else {
          minvalue = Math.min(25, moredata2.length);

          if (morechart) {
            morechart.destroy();
          }
          tabledata.innerHTML = "";
          for (let i = minvalue - 1; i >= 0; i--) {
            const rowdata = [];            
            counter++;
            rowdata.push(counter);
            rowdata.push(selecteddatemore[i]);
            rowdata.push(selectedtimemore[i]);
            rowdata.push(morevalue[i]);

            const row = tabledata.insertRow();
            rowdata.forEach((value) => {
              row.insertCell().textContent = value;
            });
          }

          morechart = new Chart(morechart2, {
            type: "line",
            data: {
              labels: timedatapoints,
              datasets: [
                {
                  label: selectedtype,
                  data: datapoints,
                  borderColor: "#e5989b",
                  backgroundColor: "#e5989b",
                  tension: 0.3,
                },
              ],
            },
            options: {
              scales: {
                x: {
                  ticks: {
                 color: '#b5838d',
               },
                 beginAtZero: true,
               },    
              
               y: {
                 ticks: {
                   color: '#b5838d',
                 },
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: "#b5838d",
                  },
                },
              },
            },
          });
        }
      })
      .catch((error) => console.error(error));
  } else {
    fetch(moreurl)
      .then((response) => response.json())
      .then((data) => {
        const moredata2 = data.filter((item) =>
          item.hasOwnProperty(selectedtype)
        );   
        let counter = 0;

        const labels2 = data.map((item) => item.date_time.slice(11, 16));
        const moredata3 = data.map((item) => item[selectedtype]);

        const morechart2 = document
          .getElementById("morechart")
          .getContext("2d");
        const tabledata = document.querySelector("#moredata tbody");

        if (moredata2.length === 0) {
          tabledata.innerHTML = "";
          const newrow = tabledata.insertRow();

          const newcell = newrow.insertCell();
          newcell.textContent = "haha noob no data";

          newcell.colSpan =
            tabledata.previousElementSibling.getElementsByTagName("th").length;
        } else {
          if (morechart) {
            morechart.destroy();
          }
          tabledata.innerHTML = "";
          moredata2.forEach((item) => {
            const rowdata = [];
            counter++;
            rowdata.push(counter);
            rowdata.push(item.date_time.slice(0, 10));
            rowdata.push(item.date_time.slice(11, 19));
            rowdata.push(item[selectedtype]);

            const row = tabledata.insertRow();
            rowdata.forEach((value) => {
              row.insertCell().textContent = value;
            });
          });
          morechart = new Chart(morechart2, {
            type: "line",
            data: {
              labels: labels2,
              datasets: [
                {
                  label: selectedtype,
                  data: moredata3,
                  borderColor: "#e5989b",
                  backgroundColor: "#e5989b",
                  tension: 0.3,
                },
              ],
            },
            options: {
              scales: {
                x: {
                  ticks: {
                 color: '#b5838d',
               },
                 beginAtZero: true,
               },    
              
               y: {
                 ticks: {
                   color: '#b5838d',
                 },
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: "#b5838d",
                  },
                },
              },
            },
          });
        }
      })
      .catch((error) => console.error(error));
  }
});

moretypeselect.addEventListener("change", function () {
  const moreoption = moretimeselect.value;
  const selectedtype = moretypeselect.value;
  const moreurl =
    moreapi + selectedtype + "/" + moreoption;
  if (moreoption === "") {
    fetch(moreapi)
      .then((response) => response.json())
      .then((data) => {
        const moredata2 = data.filter((item) =>
          item.data.hasOwnProperty(selectedtype)
        );
        const selecteddatemore = data
          .map((item) => {
            if (item.data.hasOwnProperty(selectedtype)) {
              return item.date_time.slice(0, 10);
            } else {
              return null;
            }
          })
          .filter((item) => item !== null);

        const selectedtimemore = data
          .map((item) => {
            if (item.data.hasOwnProperty(selectedtype)) {
              return item.date_time.slice(11, 16);
            } else {
              return null;
            }
          })
          .filter((item) => item !== null);

        const morevalue = data
          .map((item) => {
            if (item.data.hasOwnProperty(selectedtype)) {
              return item.data[selectedtype];
            } else {
              return null;
            }
          })
          .filter((item) => item !== null);

        const timedatapoints = [];
        minvalue = Math.min(24, moredata2.length);
        for (let i = minvalue; i >= 0; i--) {
          timedatapoints[i] = selectedtimemore[i];
        }

        const datapoints = [];
        minvalue = Math.min(24, moredata2.length);
        for (let i = minvalue; i >= 0; i--) {
          datapoints[i] = morevalue[i];
        }


        const morechart2 = document
          .getElementById("morechart")
          .getContext("2d");
        const tabledata = document.querySelector("#moredata tbody");

        let counter = 0;

        if (moredata2.length === 0) {
          tabledata.innerHTML = "";
          const newrow = tabledata.insertRow();
          const newcell = newrow.insertCell();
          newcell.textContent = "haha noob no data found";

          newcell.colSpan =
            tabledata.previousElementSibling.getElementsByTagName("th").length;
        } else {
          minvalue = Math.min(25, moredata2.length);

          if (morechart) {
            morechart.destroy();
          }
          tabledata.innerHTML = "";
          for (let i = minvalue - 1; i >= 0; i--) {
            const rowdata = [];            
            counter++;
            rowdata.push(counter);
            rowdata.push(selecteddatemore[i]);
            rowdata.push(selectedtimemore[i]);
            rowdata.push(morevalue[i]);

            const row = tabledata.insertRow();
            rowdata.forEach((value) => {
              row.insertCell().textContent = value;
            });
          }

          morechart = new Chart(morechart2, {
            type: "line",
            data: {
              labels: timedatapoints,
              datasets: [
                {
                  label: selectedtype,
                  data: datapoints,
                  borderColor: "#e5989b",
                  backgroundColor: "#e5989b",
                  tension: 0.3,
                },
              ],
            },
            options: {
              scales: {
                x: {
                  ticks: {
                 color: '#b5838d',
               },
                 beginAtZero: true,
               },    
              
               y: {
                 ticks: {
                   color: '#b5838d',
                 },
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: "#b5838d",
                  },
                },
              },
            },
          });
        }
      })
      .catch((error) => console.error(error));
  } else {
    fetch(moreurl)
      .then((response) => response.json())
      .then((data) => {
        const mainmoredata = data.filter((item) =>
          item.hasOwnProperty(selectedtype)
        );

        const labels2 = data.map((item) => item.date_time.slice(11, 16));

        const moredata3 = data.map((item) => item[selectedtype]);
        const morechart2 = document
          .getElementById("morechart")
          .getContext("2d"); 
        let counter = 0;

        const tabledata = document.querySelector("#moredata tbody");

        if (mainmoredata.length === 0) {
          const newrow = tabledata.insertRow();

          const newcell = newrow.insertCell();
          newcell.textContent = "haha noob no data found";

          newcell.colSpan =
            tabledata.previousElementSibling.getElementsByTagName("th").length;
        } else { 
          tabledata.innerHTML = "";
          if (morechart) {
            morechart.destroy();
          }

          mainmoredata.forEach((item) => {
            const rowdata = [];
            counter++;
            rowdata.push(counter);
            rowdata.push(item.date_time.slice(0, 10));
            rowdata.push(item.date_time.slice(11, 19));
            rowdata.push(item[selectedtype]);

            const row = tabledata.insertRow();
            rowdata.forEach((value) => {
              row.insertCell().textContent = value;
            });
          });
          morechart = new Chart(morechart2, {
            type: "line",
            data: {
              labels: labels2,
              datasets: [
                {
                  label: selectedtype,
                  data: moredata3,
                  borderColor: "#e5989b",
                  backgroundColor: "#e5989b",
                  tension: 0.3,
                },
              ],
            },
            options: {
              scales: {
                x: {
                  ticks: {
                 color: '#b5838d',
               },
                 beginAtZero: true,
               },    
              
               y: {
                 ticks: {
                   color: '#b5838d',
                 },
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: "#b5838d",
                  },
                },
              },
            },
          });
        }
      })
      .catch((error) => console.error(error));
  }
});
