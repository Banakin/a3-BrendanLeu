let browserData = {}

function populateDatabase(data) {
    table = document.getElementById("db_list") // Get table
    table.innerHTML = "" // Clear table

    if (Object.keys(data).length == 0) {
        table.innerHTML = "<p>No logs...</p>"
    }

    // Create data point blocks
    for (let i = 0; i < Object.keys(data).length; i++) {
        const key = Object.keys(data)[i]
        const element = data[key];
        
        datapoint = document.createElement("ul")

        cell_value = document.createElement("ul")
        cell_value.innerText = `ARRAY_INDEX ${i}`;
        datapoint.appendChild(cell_value)

        // Go through each key/object pair
        for (const key in element) {
            if (element.hasOwnProperty(key)) {
                let value = element[key];

                if (key == "start" || key == "end") {
                    value = new Date(value).toLocaleString("en-US")
                }

                cell_value = document.createElement("ul")
                cell_value.innerText = `${key}:${value}`;
                datapoint.appendChild(cell_value)
            }
        }

        // Add delete buttons
        cell_value = document.createElement("td")
        cell_value.innerHTML = `<i class="fa-solid fa-trash"></i>`
        cell_value.addEventListener("click", (e) => {
            fetch(`/api/data/${element.battle_id}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // If the server sends back a response body (e.g., confirmation message),
                // you can parse it here. Otherwise, you might just check response.ok.
                return response.json(); // Or response.text() if the response is not JSON
            })
            .then(data => {
                console.log('Resource deleted successfully:', data);
                fetchData()
            })
            .catch(error => {
                console.warn('Error deleting resource:', error);
            });
        })
        datapoint.appendChild(cell_value)

        table.appendChild(datapoint)
    }
}

function fetchUserInfo() {
    const name_disp = document.getElementById("username")
    const email_disp = document.getElementById("email")

    fetch('/api/user')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        name_disp.innerText = data.username;
        email_disp.innerText = data.email;
    })
    .catch(error => {
        console.warn('Fetch error:', error);
    });
}

fetchUserInfo()

function fetchData() {
    fetch('/api/data')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        browserData = data;
        populateDatabase(data);
    })
    .catch(error => {
        console.warn('Fetch error:', error);
    });
}

fetchData()

document.getElementById("populate-form").addEventListener('click', (e) => {
    const form = document.getElementById('myForm');
    data_id = document.getElementById("battle_id").value

    fetch(`/api/data/${data_id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        for (const key in data) {
            const value = data[key];

            if (key == "start") {
                const date = new Date(value)
                form.elements["start_minute"].value = date.getMinutes()
                form.elements["start_hour"].value = date.getHours()
                form.elements["start_day"].value = date.getDate()
                form.elements["start_month"].value = date.getMonth()
                form.elements["start_year"].value = date.getFullYear()
            } else if (key == "end") {
                const date = new Date(value)
                form.elements["end_minute"].value = date.getMinutes()
                form.elements["end_hour"].value = date.getHours()
                form.elements["end_day"].value = date.getDate()
                form.elements["end_month"].value = date.getMonth()
                form.elements["end_year"].value = date.getFullYear()
            }

            try {
                form.elements[key].value = value
            } catch {
                console.log(`Unable to fill element with name ${key}`)
            }
        }
    })
    .catch(error => {
        console.warn('Fetch error:', error);
    });
});