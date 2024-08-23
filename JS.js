    // Connect to supabase to fetch data 
    import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
    // import { createClient } from '@supabase/supabase-js'
    const supabase = createClient('https://ymrpjphchspwwbsgitrt.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltcnBqcGhjaHNwd3dic2dpdHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUwMjczNzcsImV4cCI6MjAzMDYwMzM3N30.LIBCpO29uYOOWAZNIMAuNXlZp2gu5Vs7PUj8iBphJQc');
    const currentPage = window.location.pathname;

    // TO-DO
    // - Remove pink border [ALL PAGES]
    // - change colour theme [ALL PAGES]
    // - change heading sizes above input [ADD A VEHICLE PAGE]
    // - Centre MAIN titles [VEHICLE SEARCH + ADD PAGE]
    // - Find better format [ADD VEHICLE PAGE]
    // - Centre the data return boxes in line with 'success' msg [ALL PAGES]
    // - Figure out website layout [ALL PAGES]
    // - Fill the blank space under the searchbars [INDEX PAGE]
    // - If two error searches occur make it noticable an error has occured again [ALL -- index]

    // ############################################# PERSON SEARCH WEBPAGE [people db] ##############################################################
    if (currentPage === '/index.html') {

        /*
        -----------------------------------------------------------------------------------------------
        FUNCTION TO SEARCH BY NAME IN THE DB 
        -----------------------------------------------------------------------------------------------
        */

        /* SEARCH BY NAME FUNCTION */
        async function searchByName() {
            // Get the search input value
            const searchText = document.getElementById('namesearchinput').value;
            if (searchText === '') {
                return;
            }

            const { data, error } = await supabase //Query Supabase for search results
                .from('people')
                .select('*')
                .ilike('Name', `%${searchText}%`); // Adjust column_name to the column you want to search
            console.log(data);
            const msgElement = document.getElementById('message');

            /* NO DATA RETURN (DRIVER SEARCH) */
            if (data.length === 0) {
                err("No results found");
            }

            /* SUCESSFULLY RETURNED DATA */
            else if (data.length !== 0) {
                const num = data.length
                msg("Number of results found: ",num);
                // msgElement.innerHTML = `
                // <strong>Search was Sucessful!</strong>
                // <hr class="sucesshr">
                // `;
                // document.getElementById('resultsnum').textContent = `Number of results found: ${num}`;
            }

            /* FAILED TO CONNECT TO DATABASE [ERROR] */
            else {
                console.log("---------------------------------")
                console.error('[ERROR] Cannot retrieve data from the database. Check connection to database');
                console.log("---------------------------------")
                err("Failed to connect to the database");
            }

            displayVehicleData(data); // Display search results on the webpage
        }

        /*
        -----------------------------------------------------------------------------------------------
        FUNCTION TO SEARCH BY LICENSE NUMBER IN THE DB [INDEX PAGE] 
        -----------------------------------------------------------------------------------------------                                                
        */

        async function searchByLicense() {
            const searchVal = document.getElementById('licensesearchinput').value; // Get the search input value
            if (searchVal === '') {
                return;
            }

            /* SUPABASE QUERY FROM LICENSE NUMBER SEARCHBAR TO PEOPLE DATABASE */
            const { data, error } = await supabase // Query Supabase for search results
                .from('people')
                .select('*')
                .ilike('LicenseNumber', `%${searchVal}%`); // Adjust column_name to the column you want to search
            console.log(data);

            const msgElement = document.getElementById('message');

            /* DATA SUCESSFULLY RETURNED*/
            if (data.length !== 0) {
                const num = data.length
                msg("Number of results found: ", num)
            }

            /* NO DATA RETURN (LICENSE NUM SEARCH) */
            else if (data.length === 0) {
                console.log("---------------------------------")
                console.error('Error retrieving data from the database');
                console.log("---------------------------------")
                err("No results found");
            }

            displayVehicleData(data);
        }

        /*
        -----------------------------------------------------------------------------------------------
        FUNCTION TO FORMAT RETURNED DATA FROM DB 
        -----------------------------------------------------------------------------------------------
        */

        function displayVehicleData(data) {
            const results = document.getElementById('results'); // Changed to 'searchResultsContainer'
            const innerbox = document.getElementById('innerbox');
            results.innerHTML = ''; // Clear previous results
            // NO RESULTS FOUND IN THE DATABASE [ERROR]
            // if (data.length === 0) {
            //     // Log error with error msg 
            //     console.error('[ERROR] No Results Found [ERROR] - Database found nothing based on the search criteria');
            //     error("No results found");
            // }
            // Iterate over the data array using a for loop
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                // Create a container div for each data item
                const itemContainer = document.createElement('div');
                itemContainer.classList.add('search-result-item');
                // Create and append each field
                returnData(itemContainer, 'Person ID=', 'person-id-text', item.PersonID);
                returnData(itemContainer, 'Name', 'name-text', item.Name);
                returnData(itemContainer, 'Address', 'address-text', item.Address);
                returnData(itemContainer, 'Date of Birth', 'dob-text', item.DOB);
                returnData(itemContainer, 'License Number', 'license-number-text', item.LicenseNumber);
                returnData(itemContainer, 'Expiry Date', 'expiry-date-text', item.ExpiryDate);
                // Append the container div to the results
                results.appendChild(itemContainer);
            };

        }

        /*
        -----------------------------------------------------------------------------------------------
        FUNCTION FOR SUBMIT DATA BUTTONS [INDEX PAGE] 
        -----------------------------------------------------------------------------------------------
        */

        document.getElementById('submitdriver').addEventListener('click', function() {
            validateForm();
        });

        document.getElementById('submitlicense').addEventListener('click', function() {
            validateForm();
        });

        const alphaNum = /^[a-zA-Z0-9]*$/;
        document.getElementById('results').innerHTML = '';

        function validateForm() {
            const driverName = document.getElementById('namesearchinput').value.trim();
            const licenseNumber = document.getElementById('licensesearchinput').value.trim();

            /* BOTH SEARCHBARS ARE EMPTY ERROR  */
            if (driverName === '' && licenseNumber === '') {
                console.log("---------------------------------");
                console.error("Neither searchbars have any input. One of two searchbars must have data for database query to be made");
                console.log("---------------------------------");
                err("Nothing entered in either fields. Please enter either a Driver's name or their License Number");

                /* BOTH SEARCHBARS HAVE INPUT ERROR */
            } else if (driverName !== '' && licenseNumber !== '') {
                console.log("---------------------------------");
                console.error('BOTH SEARCHBARS HAVE INPUT. ONLY ONE SEARCHBAR CAN HAVE INPUT TO MAKE A DATABASE QUERY AND RETURN DATA');
                console.log("---------------------------------");
                err("Input in both searchbars. Please use only ONE");

                /* CANNOT USE SPECIAL CHARACTERS ERROR */
            } else if (!alphaNum.test(driverName) || !alphaNum.test(licenseNumber)) {
                console.log("---------------------------------");
                console.error('INVALID INFORMATION USED IN SEARCH: CANNOT USE SPECIAL CHARACTERS!');
                console.log("---------------------------------");
                err("Cannot use special characters");
                return;

                /* SEARCH BY INPUT BASED ON WHICH SEARCHBAR */
            } else {
                if (driverName !== '') {
                    searchByName();
                } else if (licenseNumber !== '') {
                    searchByLicense();
                }
            }
        }

    }




    // // Add event listener to the submit button
    // document.getElementById('submitdriver').addEventListener('click', async function() {
    //     const alphaNum = /^[a-zA-Z0-9]*$/;
    //     document.getElementById('results').innerHTML = '';
    //     const driverSearchInput = document.getElementById('name').value;

    //     const licensesearchinput = document.getElementById('licensesearchinput').value;

    // // IF BOTH DRIVER NAME AND LICENSE NUM SEARCH BARS ARE EMPTY [ERROR]
    // if (driverSearchInput === '' && licensesearchinput === '') {
    //     console.log("---------------------------------");
    //     console.error('[ERROR] Please enter the details of the car above to add it to the system [ERROR] : Enter all the details of the car in the fields provided.');
    //     console.log("---------------------------------");
    //     error();
    //     msg("Nothing entered in either searchbar");
    // IF BOTH DRIVER NAME AND LICENSE NUM SEARCH BARS ARE FILLED [ERROR]
    // } else if (driverSearchInput !== '' && licensesearchinput !== '') {
    //     console.log("---------------------------------");
    //     console.error('[ERROR] Please enter the details of the car above to add it to the system [ERROR] : Enter all the details of the car in the fields provided.');
    //     console.log("---------------------------------");
    //     msg("Input in both searchbars. Please use only ONE");
    //     error();
    //     // If one search bar is filled and the other is empty then search by the filled search bar
    // } else if (!alphaNum.test(driverSearchInput) || !alphaNum.test(licensesearchinput)) {
    //     console.log("---------------------------------");
    //     console.error('[ERROR] Invalid information entered [ERROR] : Cannot use this special character in the database.');
    //     console.log("---------------------------------");
    //     error();
    //     msg("Cannot use special characters");
    //     return;
    //     // 
    // } else {
    //     if (driverSearchInput !== '') {
    //         await searchByName();
    //     } else if (licensesearchinput !== '') {
    //         await searchByLicense();
    //     }
    // }
    // });
    // }

    //######################################### VEHICLE SEARCH WEBPAGE [vehicle db] ##############################################################

    if (currentPage === '/vehiclesearch.html') {
        async function searchByVehicleReg() {
            // Get the search input value
            const searchVehicleReg = document.getElementById('rego');
            // Query Supabase for search results
            const { data, error } = await supabase
                .from('vehicle')
                .select('*')
                .ilike('VehicleID', `%${searchVehicleReg}%`); // Adjust column_name to the column you want to search
            console.log('Data has successfully been retrieved =', data);

            /* SEARCH WAS SUCCESSFUL */
            if (data.length !== 0) {
                const num = data.length
                msg("Number of results found: ",num); 
            }

            else if(data.length == 0)
            {
                err("No results found")
            }

            // FAILED TO CONNECT TO DATABASE [ERROR]
            else{
                console.error('Error retrieving data from the database');
                console.log("---------------------------------")
                msg("Unable to retrieve data from the database");
                error();
                console.log("---------------------------------")
            }
            // Display search results on the webpage
            displayVehicleRegData(data);
        }

        async function displayVehicleRegData(data) {
            // KEEP
            const results = document.getElementById('results'); // Changed to 'searchResultsContainer'
            results.innerHTML = ''; // Clear previous results
            // NOTHING RESULTS FOUND [ERROR]
            if (data.length === 0) {
                console.log("---------------------------------")
                console.error('[ERROR] No Results Found [ERROR] - Database found nothing based on the search criteria');
                console.log("---------------------------------")
                err("No results found")
            }
            // Iterate over the data array using a for loop
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                // Create a container div for each data item
                const itemContainer = document.createElement('div');
                itemContainer.classList.add('search-result-item');
                // Create and appendd each field
                returnData(itemContainer, 'Vehicle ID', 'vehicle-id', item.VehicleID);
                returnData(itemContainer, 'Vehicle Make', 'vehicle-make', item.Make);
                returnData(itemContainer, 'Vehicle Model', 'vehicle-model', item.Model);
                returnData(itemContainer, 'Colour of Vehicle', 'dob-text', item.Colour);
                returnData(itemContainer, 'Owner ID of Vehicle', 'license-number-text', item.OwnerID);
                // Append the container div to the results
                results.appendChild(itemContainer);
            };
        }

        document.getElementById('regsubmitbutton').addEventListener('click', async function() {
            const alphaNum = /^[a-zA-Z0-9]*$/;
            const vehicleregsearchinput = document.getElementById('rego');
            // SEARCH BAR IS EMPTY [ERROR]
            if (vehicleregsearchinput === '') {
                // Error log 
                console.log("---------------------------------")
                console.error("Nothing entered in search bar. Enter the vehicle registration in the searchbar.");
                console.log("---------------------------------")
                    // Display error message
                msg("Please enter the Vehicle Registration above.");
                error();

            } else if (!alphaNum.test(vehicleregsearchinput)) {
                console.log("---------------------------------");
                console.error('[ERROR] Invalid information entered [ERROR] : Cannot use this special character in the database.');
                console.log("---------------------------------");
                msg("Cannot use this special character with the system");
                error();
                return;

            } else // If the search bar is not empty, search by vehicle registration
            {
                if (vehicleregsearchinput !== '') await searchByVehicleReg();
            }
        });
    }

    //######################################### VEHICLE ADD WEBPAGE [vehicle db] ############################################################################

    if (currentPage === '/addavehicle.html') {
        // Add event listener to the vehicle add submit button
        document.getElementById('vehicleaddsubmitbutton').addEventListener('click', async function() {
            const reg = document.getElementById('rego').value;
            const make = document.getElementById('make').value;
            const model = document.getElementById('model').value;
            const colour = document.getElementById('colour').value;
            const owner = document.getElementById('owner').value;
            const alphaNum = /^[a-zA-Z0-9]*$/;

            if (reg === '' || make === '' || model === '' || colour === '' || owner === '') {
                console.log("---------------------------------");
                console.error('[ERROR] Please enter the details of the car above to add it to the system [ERROR] : Enter all the details of the car in the fields provided.');
                console.log("---------------------------------");
                msg("One or more fields missing information");
                error();
                return;

            } else if (!alphaNum.test(reg) && !alphaNum.test(make) && !alphaNum.test(model) && !alphaNum.test(colour) && !alphaNum.test(owner)) {
                console.log("---------------------------------");
                console.error('[ERROR] Invalid information entered [ERROR] : Cannot use this special character in the database.');
                console.log("---------------------------------");
                msg("Cannot use special characters");
                error();
                return;

            } else {
                if (reg !== '' || make !== '' || model !== '' || colour !== '' || owner !== '') {
                    const id = await searchOwnerByName(owner);
                    if (id) {
                        const dataToAdd = {
                            VehicleID: reg,
                            Make: make,
                            Model: model,
                            Colour: colour,
                            OwnerID: id
                        };
                        // Insert data into the table
                        const { data, error } = await supabase.from('vehicle').insert([dataToAdd]);
                        if (error) {
                            console.log("---------------------------------");
                            console.error('[ERROR] This vehicle ID already exists in the system. Please try again [ERROR] : Vehicle ID in system has already been added or pre-exists. The vehicle ID must be unique.', error);
                            console.log("---------------------------------");
                            msg("This vehicle already exists in the system. Please try again.");
                        } else {
                            console.log("---------------------------------");
                            console.log("Input data has been successfully added to the database.");
                            console.log("---------------------------------");
                            msg("The vehicle has successfully been added to the system!");
                        }
                    } else {
                        console.error('Vehicle added sucessfully but owner does not exist in system. Please add the owner details below in order to assign the vehicle to the them.');
                        msg("Vehicle added successfully");
                        // Owner not found in the system, display the owner form
                        displayOwnerForm();
                    }
                }
            }

            // Function to search owner by name in the people database when adding a new vehicle 
            async function searchOwnerByName(vehicleOwnerID) {
                const { data, error } = await supabase
                    .from('people')
                    .select('PersonID')
                    .ilike('Name', `%${vehicleOwnerID}%`);

                if (error) {
                    console.log("---------------------------------")
                    console.error('[ERROR] Could not fetch owner data:');
                    console.log("---------------------------------")
                    msg("Cannot fetch owner data")
                    error();
                    displayOwnerForm();
                } else {
                    console.log(data);
                    if (data.length > 0) {
                        console.log("Owner ID found");
                        // Return the PersonID if found
                        return data[0].PersonID;
                    }
                }
            }

            function displayOwnerForm() {
                const vehicleAddForm = document.getElementById('vehicleadd');
                const parentElement = vehicleAddForm.parentNode;
                if (vehicleAddForm) vehicleAddForm.remove();

                const form = document.createElement('form');
                form.id = 'addOwnerForm';

                const fields = [
                    { label: 'Person ID:', id: 'personid', type: 'num' },
                    { label: 'Name:', id: 'name', type: 'text' },
                    { label: 'Address:', id: 'address', type: 'text' },
                    { label: 'Date of Birth:', id: 'dob', type: 'text' },
                    { label: 'License Number:', id: 'license', type: 'text' },
                    { label: 'License Expiry Date:', id: 'expire', type: 'text' },
                ];

                fields.forEach(({ label, id, type }) => {
                    const labelElement = document.createElement('label');
                    labelElement.textContent = label;
                    const inputElement = document.createElement('input');
                    inputElement.id = id;
                    inputElement.type = type;
                    form.appendChild(labelElement);
                    form.appendChild(inputElement);
                    form.appendChild(document.createElement('br'));
                });

                const addButton = document.createElement('button');
                addButton.textContent = 'Add owner';
                addButton.type = 'submit';
                form.appendChild(addButton);

                parentElement.appendChild(form);

                form.addEventListener('submit', async function(event) {
                    const id = document.getElementById('personid').value;
                    const name = document.getElementById('name').value;
                    const address = document.getElementById('address').value;
                    const dob = document.getElementById('dob').value;
                    const license = document.getElementById('license').value;
                    const expire = document.getElementById('expire').value;

                    if (!alphaNum.test(id) && !alphaNum.test(name) && !alphaNum.test(address) && !alphaNum.test(dob) && !alphaNum.test(license) & !alphaNum.test(license)) {
                        console.log("---------------------------------");
                        console.error('[ERROR] Invalid information entered [ERROR] : Cannot use this special character in the database.');
                        console.log("---------------------------------");
                        msg("Cannot use special characters");
                        error();
                        event.preventDefault();
                        return;
                    } else if (id === '' || name === '' || address === '' || dob === '' || license === '' || expire === '') {
                        console.log("---------------------------------");
                        console.error('[ERROR] Please fill in all fields with the owner information [ERROR] : Enter all the details of the owner in the fields provided.');
                        console.log("---------------------------------");
                        msg("Please fill in all fields with the owner information.");
                        error();
                        event.preventDefault();
                        return
                    } else {
                        if (id !== '' || name !== '' || address !== '' || dob !== '' || license !== '' || expire !== '') {
                            event.preventDefault();
                            await addNewOwner();
                        }
                    }
                });
            }

            async function addNewOwner() {
                const id = document.getElementById('personid').value;
                const name = document.getElementById('name').value;
                const address = document.getElementById('address').value;
                const dob = document.getElementById('dob').value;
                const license = document.getElementById('license').value;
                const expire = document.getElementById('expire').value;

                const dataToAdd = {
                    PersonID: id,
                    Name: name,
                    Address: address,
                    DOB: dob,
                    LicenseNumber: license,
                    ExpiryDate: expire
                };

                const { data, error } = await supabase.from('people').insert([dataToAdd]);
                if (error) {
                    console.log("---------------------------------");
                    console.error('[ERROR] Could not add new owner:');
                    console.log("---------------------------------");
                    msg("Could not add new owner.");
                    error();
                } else {
                    console.log("---------------------------------");
                    console.log("New owner added successfully.");
                    console.log("---------------------------------");
                    msg("Owner added successfully");
                    addOrigCar(); // add original car details 
                }
            }

            // Add the original car which is associated with the newly added person
            async function addOrigCar() {

                // Retrieve owner ID from the newly added owner
                const owner = document.getElementById('personid').value;

                const dataToAdd = {
                    VehicleID: reg,
                    Make: make,
                    Model: model,
                    Colour: colour,
                    OwnerID: owner
                };

                const { data, error } = await supabase.from('vehicle').insert([dataToAdd]);
                if (error) {
                    msg("Failed to add vehicle details.");
                    error();
                    console.log("---------------------------------");
                    console.error('[ERROR] Failed to add vehicle details to system');
                    console.log("---------------------------------");
                } else {
                    msg("Vehicle added successfully! Now refreshing page...");
                    console.log("---------------------------------");
                    console.log('Vehicle details have sucessfully been added to the system! Now refreshing page...');
                    console.log("---------------------------------");

                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                }
            }
        });
    }

    //######################################### ERROR HANDLING #########################################################################################################################################

    function returnData(container, label, className, value) {
        const labelElement = document.createElement('p');
        const textElement = document.createElement('span');
        textElement.innerHTML = `${label}:<br>`;
        textElement.className = className; // Add a class to the span
        labelElement.appendChild(textElement);
        labelElement.appendChild(document.createTextNode(` ${value}`));
        container.appendChild(labelElement);
    }


    function msg(message,num) {

        /* CLEAR SUCCESS AND ERROR MSG */
        const msgElement = document.getElementById('message');
        msgElement.innerHTML = ''; // Clear success message
        const errElement = document.getElementById('error');
        errElement.innerHTML = ''; // Clear error message

        /* ADD NUM TO MAIN PART OF MSG TO CONSTRUCT FULL MSG */
         let fullMessage = message;
        if (num !== undefined) {
            fullMessage += ` ${num}`;
        }

        /* SEARCH SUCCESS MSG PRINT WITH RESULTS RETURN */
        msgElement.innerHTML = `
        <strong> SEARCH SUCESSFUL! </strong>
        <hr>
          <span class="resultsnum">${fullMessage}</span>`; // Print return results number 
        msgElement.className = ''; // Clear previous classes
        msgElement.style.display = 'block';
    }


    function err(errmsg) {
        const errElement = document.getElementById('error');
        const msgElement = document.getElementById('message');
        const resultsnumElement = document.getElementById('resultsnum');
        const dbreturnElement = document.getElementById('results');

        /* CLEAR SUCCESS, ERROR, RESULTS NUM AND RETURN RESULTS */
        msgElement.innerHTML = ''; // Clear success message
        errElement.innerHTML = ''; // Clear error msg 
        resultsnumElement.innerHTML = ''; // Clear results num 
        dbreturnElement.innerHTML = ''; // Clear results
    
        /* MAIN ERROR MSG WITH REASON FOR ERROR */
        errElement.innerHTML = `
            <strong>ERROR</strong>
            <hr>
            <p>${errmsg}</p>
        `;
    }