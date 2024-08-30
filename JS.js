    // Connect to supabase to fetch data 
    import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
    // import { createClient } from '@supabase/supabase-js'
    const supabase = createClient('https://ymrpjphchspwwbsgitrt.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltcnBqcGhjaHNwd3dic2dpdHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUwMjczNzcsImV4cCI6MjAzMDYwMzM3N30.LIBCpO29uYOOWAZNIMAuNXlZp2gu5Vs7PUj8iBphJQc');
    const currentPage = window.location.pathname;

    // TO-DO
    // - Fix actual if statement where query is executed from as new if statements lost its meaning 
    // - Error msgs and highlighting searchbars (owner add)
    //- white space below webpage on people search + vehicle search

    // - Change colour of text above searchbars 
    // - Enforce same text for all pages navbar
    // - position company logo better 
    // - better colour for searchbars/fo
    // - change colour theme [ALL PAGES]
    // - change heading sizes above input [ADD A VEHICLE PAGE]
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

        // Get the search input value
        const searchText = document.getElementById('namesearchinput').value;
        const driverName = document.getElementById('namesearchinput').value.trim();
        const licenseNumber = document.getElementById('licensesearchinput').value.trim();
        const licenseinput = document.getElementById('licensesearchinput');
        const nameinput = document.getElementById('namesearchinput');
        const nameerror = document.getElementById('nameerror')
        const licenseerror = document.getElementById('licenseerror')

        function clearAll()
        {
            // Clear error messages and highlights
            nameinput.classList.remove('highlighterror'); 
            licenseinput.classList.remove('highlighterror');
            nameerror.textContent = '';
            licenseerror.textContent = '';
        }

        /* SEARCH BY NAME FUNCTION */
        async function searchByName() {



            const { data, error } = await supabase //Query Supabase for search results
                .from('people')
                .select('*')
                .ilike('Name', `%${searchText}%`); // Adjust column_name to the column you want to search
            console.log(data);
            const msgElement = document.getElementById('message');

            /* NO DATA RETURN (DRIVER SEARCH) */
            if (data.length === 0) {
                
                // Clear error messages and highlights
                clearAll();
                
                console.log("---------------------------------")
                console.error('No matches found based on input');
                console.log("---------------------------------")

                err("No results found");
            }

            /* SUCESSFULLY RETURNED DATA */
            else if (data.length !== 0) {
                
                // Clear error messages and highlights
                clearAll();

                const num = data.length

                console.log("---------------------------------")
                console.log('Success! Data returned');
                console.log("---------------------------------")

                msg("Number of results found: ",num);
            }

            /* FAILED TO CONNECT TO DATABASE [ERROR] */
            else {

                 // Clear error messages and highlights
                clearAll();

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
            const driverName = document.getElementById('namesearchinput').value.trim();
            const licenseNumber = document.getElementById('licensesearchinput').value.trim();
            const licenseinput = document.getElementById('licensesearchinput');
            const nameinput = document.getElementById('namesearchinput');
            const nameerror = document.getElementById('nameerror')
            const licenseerror = document.getElementById('licenseerror')
           
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
                
                // Clear error messages and highlights
                clearAll();

                console.log("---------------------------------")
                console.log('Success! Data has been returned from the database.');
                console.log("---------------------------------")
                
                const num = data.length
                msg("Number of results found: ", num)
            }

            /* NO DATA RETURN (LICENSE NUM SEARCH) */
            else if (data.length === 0) {
                
                // Clear error messages and highlights
                clearAll();
                
                console.log("---------------------------------")
                console.error('No matches found in the database.');
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
                returnData(itemContainer, 'Person ID=', 'person-id-text', item.personid);
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

        const alphaNum = /^[a-zA-Z0-9" "]*$/;
        document.getElementById('results').innerHTML = '';

        function validateForm() {
            const driverName = document.getElementById('namesearchinput').value.trim();
            const licenseNumber = document.getElementById('licensesearchinput').value.trim();
            const licenseinput = document.getElementById('licensesearchinput');
            const nameinput = document.getElementById('namesearchinput');
            const nameerror = document.getElementById('nameerror')
            const licenseerror = document.getElementById('licenseerror')


            /* BOTH SEARCHBARS ARE EMPTY ERROR  */
            if (driverName === '' && licenseNumber === '') {

                // Clear error messages and highlights
                clearAll();

                console.log("---------------------------------");
                console.error('Neither fields have input. One of the two must in order to query the database.');
                console.log("---------------------------------");
                
                //Highlight fields where error is occuring
                nameinput.classList.add('highlighterror'); 
                licenseinput.classList.add('highlighterror');
    
                // Error message for name search
                nameerror.textContent = '*Nothing entered. Please enter data in ONE of the TWO fields!';
                nameerror.classList.add('error-message'); // Add error-message class

                // Error message for license search
                licenseerror.textContent = '*Nothing entered. Please enter data in ONE of the TWO fields!';
                licenseerror.classList.add('error-message'); // Add error-message class


            /* BOTH SEARCHBARS HAVE INPUT ERROR */
            } else if (driverName !== '' && licenseNumber !== '') {

                // Clear error messages and highlights
                clearAll();

                console.log("---------------------------------");
                console.error('BOTH SEARCHBARS HAVE INPUT. ONLY ONE SEARCHBAR CAN HAVE INPUT TO MAKE A DATABASE QUERY AND RETURN DATA');
                console.log("---------------------------------");
               
                //Highlight fields where error is occuring
                nameinput.classList.add('highlighterror'); 
                licenseinput.classList.add('highlighterror');
    
                // Error message for name search
                nameerror.textContent = '*Data entered in both fields. Input can only be in ONE field.';
                nameerror.classList.add('error-message'); // Add error-message class

                // Error message for license search
                licenseerror.textContent = 'Data entered in both fields. Input can only be in ONE field.';
                licenseerror.classList.add('error-message'); // Add error-message class

            /* CANNOT USE SPECIAL CHARACTERS ERROR (person) */
            } else if (!alphaNum.test(driverName) ) {

                // Clear error messages and highlights
                clearAll();

                console.log("---------------------------------");
                console.error('INVALID INFORMATION USED IN SEARCH: CANNOT USE SPECIAL CHARACTERS!');
                console.log("---------------------------------");

                //Highlight fields where error is occuring
                nameinput.classList.add('highlighterror'); 
    
                // Error message for name search
                nameerror.textContent = '*Cannot use special characters!';
                nameerror.classList.add('error-message'); // Add error-message class
            }

            /* CANNOT USE SPECIAL CHARACTERS ERROR (license) */
            else if(!alphaNum.test(licenseNumber))
            {
                // Clear error messages and highlights
                clearAll();

                console.log("---------------------------------");
                console.error('INVALID INFORMATION USED IN SEARCH: CANNOT USE SPECIAL CHARACTERS!');
                console.log("---------------------------------");
                
                // Highlight source field of the error
                licenseinput.classList.add('highlighterror');
                
                // Error message for license search
                licenseerror.textContent = '*Cannot use special characters!';
                licenseerror.classList.add('error-message'); // Add error-message class
            }

            /* SEARCH BY INPUT BASED ON WHICH SEARCHBAR */
             else if (!driverName.includes(" ") && licenseNumber === '')
            {
                // Clear error messages and highlights
                clearAll();

                console.log("---------------------------------");
                console.error('DOES NOT INCLUDE FIRST AND LAST NAME IN SEARCH TO IDENTIFY SPECIFIC CUSTOMER');
                console.log("---------------------------------");

                //Highlight fields where error is occuring
                nameinput.classList.add('highlighterror'); 
    
                // Error message for name search
                nameerror.textContent = '*Must include FIRST and LAST name!';
                nameerror.classList.add('error-message'); // Add error-message class
            }
            
            else {
                if (driverName !== '') {
                    searchByName();
                } else if (licenseNumber !== '') {
                    searchByLicense();
                }
            }
        }

    }
//######################################### VEHICLE SEARCH WEBPAGE [vehicle db] ##############################################################

if (currentPage === '/vehiclesearch.html') {
        const searchVehicleReg = document.getElementById('vssearchbar').value; // value in searchbar
        const searchbarReg = document.getElementById('vssearchbar'); // searchbar itself 

        function vsClearAll()
        {
            searchbarReg.classList.remove('highlighterror-vs')
            regerror.textContent = '';
        }

        function errorMessageVs(err)
        {
            // Display error message
            searchbarReg.classList.add('highlighterror-vs')
            regerror.textContent = err
            regerror.classList.add('error-message');
        }

    /* VEHICLE REGISTRATION SUPABASE QUERY  */
    async function searchByVehicleReg() {

        // Query Supabase for search results
        const { data, error } = await supabase
            .from('vehicle')
            .select('*')
            .ilike('VehicleID', `%${searchVehicleReg}%`); // Adjust column_name to the column you want to search
        console.log('Data has successfully been retrieved =', data);
        
        /* SEARCH WAS SUCCESSFUL */
        if (data.length !== 0) {

            vsClearAll();
            const num = data.length
            
            console.log("---------------------------------")
            console.log('Success! Data was returned from the database.');
            console.log("---------------------------------")
            
            msg("Number of results found: ",num); 
        }

        else if(data.length == 0)
        {
            // Clear error messages and highlights
            vsClearAll;

            console.log("---------------------------------")
            console.error('No matches found in the database.');
            console.log("---------------------------------")

            err("No results found")
        }

        // FAILED TO CONNECT TO DATABASE [ERROR]
        else{

            vsClearAll();
            console.error('Error retrieving data from the database');
            console.log("---------------------------------")
            err("Unable to retrieve data from the database");
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

            vsClearAll();
        
            console.log("---------------------------------")
            console.error('No matches found in the database.');
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
        const vehicleregsearchinput = document.getElementById('vssearchbar').value;
        
        /* SEARCH BAR IS EMPTY ERROR */
        if (vehicleregsearchinput === '') {

            vsClearAll();

            // Error log 
            console.log("---------------------------------")
            console.error("Nothing entered in search bar. Enter the vehicle registration in the searchbar.");
            console.log("---------------------------------")
            
            errorMessageVs('*Nothing entered in searchbar. Please enter vehicle registration!')

        } else if (!alphaNum.test(vehicleregsearchinput)) {

            vsClearAll();
            console.log("---------------------------------");
            console.error('[ERROR] Invalid information entered [ERROR] : Cannot use this special character in the database.');
            console.log("---------------------------------");

            errorMessageVs('*Cannot use this special character with the system!')

            return;

        } else // If the search bar is not empty, search by vehicle registration
        {
            vsClearAll();
            if (vehicleregsearchinput !== '') await searchByVehicleReg();
        }
    });
}


//######################################### VEHICLE ADD WEBPAGE [vehicle db] ############################################################################

if (currentPage === '/addavehicle.html') {

    // Add event listener to the vehicle add submit button
    document.getElementById('vehicleaddsubmitbutton').addEventListener('click', async function() {
    
    /* FUNCTION CLEAR ALL SEARCHBAR HIGHLIGHTS AND ERROR MSGS */
    function clearErrorMsgva(regValue,makeValue,modelValue,colourValue,ownerValue)
    {
        console.log("CLEAR")

        if(regValue === 1)
        {
            regSearchbar.classList.remove('highlighterror-va')
            regerrormsg.textContent = ''; 
            regSearchbar.nextElementSibling.classList.remove('errorsymbol');
 
        }

        if(makeValue === 1)
        {
            makeSearchbar.classList.remove('highlighterror-va')
            makeerrormsg.textContent = '';
        }
        
        if(modelValue === 1)
        {
            modelSearchbar.classList.remove('highlighterror-va')
            modelerrormsg.textContent = '';
            modelSearchbar.nextElementSibling.classList.remove('show-icon');

        }

        if(colourValue === 1)
        {
            colourSearchbar.classList.remove('highlighterror-va')
            colourerrormsg.textContent = '';
        }

        if(ownerValue === 1)
        {
            ownerSearchbar.classList.remove('highlighterror-va')
            ownererrormsg.textContent = '';
        }
    }

    /* FUNCTION FOR ERROR MSGS AND HIGHLIGHTS DEPENDING ON THE SOURCE SEARCHBAR OF THE ERROR */
    function errorMsgVa(errMsg,regVal,makeVal,modelVal,colourVal,ownerVal)
    {

        if(regVal === 1)
        {
            regSearchbar.classList.add('highlighterror-va');
            regerrormsg.textContent = errMsg;
            regerrormsg.classList.add('error-message');    
            regSearchbar.nextElementSibling.classList.add('errorsymbol');
    
        }

        if(makeVal === 1)
        {
            makeSearchbar.classList.add('highlighterror-va');
            makeerrormsg.textContent = errMsg;
            makeerrormsg.classList.add('error-msg');
            makeSearchbar.nextElementSibling.classList.add('show-icon');

        }

        if(modelVal === 1)
        {
            modelSearchbar.classList.add('highlighterror-va');
            modelerrormsg.textContent = errMsg;
            modelerrormsg.classList.add('error-msg');
        }

        if(colourVal === 1)
        {
            colourSearchbar.classList.add('highlighterror-va');
            colourerrormsg.textContent = errMsg;
            colourerrormsg.classList.add('error-msg');
        }

        if(ownerVal === 1)
        {
            ownerSearchbar.classList.add('highlighterror-va');
            ownererrormsg.textContent = errMsg;
            ownererrormsg.classList.add('error-msg');
        }
    }

        const regValue = document.getElementById('rego').value;
        const regSearchbar = document.getElementById('rego');
        const makeValue = document.getElementById('make').value;
        const makeSearchbar = document.getElementById('make');
        const modelValue = document.getElementById('model').value;
        const modelSearchbar = document.getElementById('model');
        const colourValue = document.getElementById('colour').value;
        const colourSearchbar = document.getElementById('colour');
        const ownerValue = document.getElementById('owner').value;
        const ownerSearchbar = document.getElementById('owner');
        const regErrorMsgElement = document.getElementById('regerrormsg');
        const makeErrorMsgElement = document.getElementById('makeerrormsg')
        const modelErrorMsgElement = document.getElementById('modelerrormsg')
        const colourErrorMsgElement = document.getElementById('colourerrormsg')
        const ownerErrorMsgElement = document.getElementById('ownererrormsg')
        
        const alphaNum = /^[a-zA-Z0-9]*$/;
        const alphaNumSpace = /^[a-zA-Z0-9' ']*$/;

        var regErrorFlag = 0;
        var regClearFlag = 0;
        var makeErrorFlag = 0;
        var makeClearFlag = 0;
        var modelErrorFlag = 0;
        var modelClearFlag = 0
        var colourErrorFlag = 0;
        var colourClearFlag = 0;
        var ownerErrorFlag = 0;
        var ownerClearFlag = 0;
        
        
        /* ONE OR MORE INPUT FIELDS MISSING DATA ERROR */
        if (regValue=== '' ) 
        {
            console.log("executing1");
            var regErrorFlag = 1;
        }else
        {
            var regClearFlag = 1
        }

        if(makeValue === '' ) 
        {
            console.log("executing2");
            var makeErrorFlag = 1;
        }else
        {
            var makeClearFlag = 1
        }

        if (modelValue === '' ) 
        {
            console.log("executing3");
            var modelErrorFlag = 1;
        }else
        {
            var modelClearFlag = 1
        }
        
        if(colourValue === '' ) 
        {
            console.log("executing4");
            var colourErrorFlag = 1;
        }else
        {
            var colourClearFlag = 1
        }
        
        if (ownerValue === '' ) 
        {
            console.log("executing5");
            var ownerErrorFlag = 1;
        }else
        {
            var ownerClearFlag = 1
        }

        console.log(regErrorFlag,makeErrorFlag,modelErrorFlag,colourErrorFlag,ownerErrorFlag);

        errorMsgVa("*Missing information in this field",regErrorFlag,makeErrorFlag,modelErrorFlag,colourErrorFlag,ownerErrorFlag);
        clearErrorMsgva(regClearFlag,makeClearFlag,modelClearFlag,colourClearFlag,ownerClearFlag);

        /* NO SPACES MEANS NO LAST NAME ERROR */
        if(!ownerValue.includes(" ") && ownerValue !== '')
        {
            console.log("---------------------------------");
            console.error('Name field must include a FIRST and LAST name to uniquely identify a customer');
            console.log("---------------------------------");
            errorMsgVa("*Field requries FIRST and LAST name!",0,0,0,0,1);    
        }
        
         var regErrorFlagspecial = 0;
         var regClearFlagspecial = 0
         var makeErrorFlagspecial = 0;
         var makeClearFlagspecial = 0
         var modelErrorFlagspecial = 0;
         var modelClearFlagspecial = 0
         var colourErrorFlagspecial = 0;
         var colourClearFlagspecial = 0
         var ownerErrorFlagspecial = 0;
         var ownerClearFlagspecial = 0

        /* USE OF SPECIAL CHARACTERS ERROR */
        if (!alphaNum.test(regValue))
        {
            var regErrorFlagspecial = 1;

            if(regErrorMsgElement !== '')
            {
                regerrormsg.textContent = 'Cannot use special characters!'
                regSearchbar.classList.add('highlighterror-va'); // Highlight searchbar
                console.error("Cannot use special characters!");
            }
            else
            {
                console.log("special reg")
                console.error("Cannot use special characters!");
            }
        }
            
        if (!alphaNum.test(makeValue))
        {
            var makeErrorFlagspecial = 1;

            if(makeErrorMsgElement !== '')
            {
                makeerrormsg.textContent = 'Cannot use special characters!'
                makeSearchbar.classList.add('highlighterror-va'); // Highlight searchbar
                console.error("Cannot use special characters!");
            }
            else
            {
                console.log("special reg")
                console.error("Cannot use special characters!");
            }
        }
                    
        if (!alphaNum.test(modelValue))
        {
            var modelErrorFlagspecial = 1;

            if(modelErrorMsgElement !== '')
            {
                modelerrormsg.textContent = 'Cannot use special characters!'
                modelSearchbar.classList.add('highlighterror-va'); // Highlight searchbar
                console.error("Cannot use special characters!");
            }
            else
            {
                console.log("special reg")
                console.error("Cannot use special characters!");
            }
        }
                    
        if (!alphaNum.test(colourValue))
        {
            var colourErrorFlagspecial = 1;
            
            if(colourErrorMsgElement !== '')
            {
                colourerrormsg.textContent = 'Cannot use special characters!'
                colourSearchbar.classList.add('highlighterror-va'); // Highlight searchbar
                console.error("Cannot use special characters!");

            }
            else
            {
                console.error("Cannot use special characters!");
            }
        }
                    
        if (!alphaNumSpace.test(ownerValue))
        {
            console.log('ownerValue:', ownerValue);

            var ownerErrorFlagspecial = 1;

            if(ownerErrorMsgElement !== '')
            {
                ownererrormsg.textContent = 'Cannot use special characters!'
                ownerSearchbar.classList.add('highlighterror-va'); // Highlight searchbar
                console.error("Cannot use special characters!");
            }
            else
            {
                console.log("special reg")
                console.error("Cannot use special characters!");
            }
        }


        if (regErrorFlagspecial === 1 || modelErrorFlagspecial === 1 || makeErrorFlagspecial === 1 || colourErrorFlagspecial === 1 || ownerErrorFlagspecial === 1)
        {   
            console.log('ownerValude:', ownerValue);

            console.log("owner flag value",ownerErrorFlagspecial)
            errorMsgVa("*Cannot use special characters!",regErrorFlagspecial,makeErrorFlagspecial,modelErrorFlagspecial,colourErrorFlagspecial,ownerErrorFlagspecial); 
        }
        
        if (regerrormsg.textContent === '' && makeerrormsg.textContent === '' && modelerrormsg.textContent === '' && colourerrormsg.textContent === '' && ownererrormsg.textContent === '') 
        {

            /* SUCCESS: ALL FIELDS FILLED AND ADDING TO DB */
                // Searches database for an ID based on name provided
            if (regValue !== '' || makeValue !== '' || modelValue !== '' || colourValue !== '' || ownerValue !== '') {
                console.log("success ")
                const id = await searchOwnerByName(ownerValue);
                /* ID FOUND THAT BELONGS TO NAME SO VEHICLE INFO IS ADDED TO THAT OWNER */
                if (id) {
                    const dataToAdd = {
                        VehicleID: regValue,
                        Make: makeValue,
                        Model: modelValue,
                        Colour: colourValue,
                        OwnerID: id
                    };

                    // Insert data into the table
                    const { data, error } = await supabase.from('vehicle').insert([dataToAdd]);
                    
                    /* VEHICLE ID IS ALREADY IN USE ERROR */
                    if (error) {
                        console.log("---------------------------------");
                        console.error('[ERROR] This vehicle ID already exists in the system. Please try again [ERROR] : Vehicle ID in system has already been added or pre-exists. The vehicle ID must be unique.', error);
                        console.log("---------------------------------");
                        err("This vehicle already exists in the system. Please try again.");
                    } 

                    /* SUCCESS: VEHICLE ADDED TO SYSTEM  */
                    else
                    {
                        console.log("---------------------------------");
                        console.log("Input data has been successfully added to the database.");
                        console.log("---------------------------------");
                        msg("The vehicle has successfully been added to the system");
                    }
                
                /*  */
                } else {
                    console.error('C');
                    err("Customer does not exist under that name. Try registering them.");
                    // Owner not found in the system, display the owner form
                }
            }
        }
    })  

        // Function to search owner by name in the people database when adding a new vehicle 
        async function searchOwnerByName(vehicleOwnerID) {
            const { data, error } = await supabase
                .from('people')
                .select('personid')
                .ilike('Name', `%${vehicleOwnerID}%`);

            if (error) {}

            else if(data.length === 0){
                console.log("---------------------------------")
                console.error('[ERROR] Could not fetch owner data:');
                console.log("---------------------------------")
                err("No customer found. Try registering them.")
            }else {
                console.log(data);
                if (data.length > 0) {
                    console.log("Owner ID found");
                    // Return the PersonID if found
                    return data[0].personid;
                }
            }
        }
}



    //######################################### NEW OWNER ADD WEBPAGE [vehicle db] ############################################################################
    
if (currentPage === '/newowner.html') {

        // - Search all fields to enusre customer profile is entirely unqiue 
        // - Check for first and last name entered error 
        // - Auto-redirect back to the 'vehicle add' page to assign vehicle to newly added customer 
        // - Submit data through button

    document.getElementById('owneraddbutton').addEventListener('click', async function() {
        const name = document.getElementById('nameinput').value;
        const residence = document.getElementById('residenceinput').value;
        const dob = document.getElementById('dobinput').value;
        const license = document.getElementById('licenseinput').value;
        const expiry = document.getElementById('expiryinput').value;
        const alphaNumSpace = /^[a-zA-Z0-9" "]*$/;
        const alphaNum = /^[a-zA-Z0-9]*$/;
        const dateFormat =  /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/

            /* ONE OR MORE INPUT FIELDS MISSING DATA ERROR */
            if (name === '' || residence === '' || dob === '' || license === '' || expiry === '') {
            console.log("---------------------------------");
            console.error('[ERROR] Please enter the details of the car above to add it to the system [ERROR] : Enter all the details of the car in the fields provided.');
            console.log("---------------------------------");
            err("One or more fields missing information");
            return;

            /* Name doesnt include a space meaning there is no last name input */
            }else if(!name.includes(" "))
            {
                console.log("---------------------------------");
                console.error('Name field must include a FIRST and LAST name to uniquely identify a customer');
                console.log("---------------------------------");
                err("Must include a FIRST and LAST name")           
                return;

            /* USE OF SPECIAL CHARACTERS ERROR */
            } else if (!alphaNumSpace.test(name) && !alphaNumSpace.test(residence) && !alphaNumSpace.test(dob) && !alphaNumSpace.test(license) && !alphaNumSpace.test(expiry)) {
                console.log("---------------------------------");
                console.error('[ERROR] Invalid information entered [ERROR] : Cannot use this special character in the database.');
                console.log("---------------------------------");
                err("Cannot use special characters");
                return;

            } else if(!dateFormat.test(dob)|| !dateFormat.test(expiry))
            {
                err("Date format is incorrect")
            
            }else if(!alphaNum.test(license) || license.length!==16)
            {
                err("Invalid license number format. Must be alphanumeric and 16 characters long!")

            /* SUCCESS: ALL FIELDS FILLED AND ADDING TO DB */
            } else if(name == '' || residence !== '' || dob !== '' || license !== '' || expiry !== '') {
                /* CHECKS IF EXPIRY DATE FORMAT IS CORRECT */
                // console.log()
                
                await uniqueCustomer(name,residence,dob,license,expiry);
            }


        async function uniqueCustomer(name, residence, dob, license, expiry) {
        
        /* SUPABASE QUERY TO CHECK IF LICENSE NUMBER IS UNIQUE */
        const { data, error } = await supabase // License number is unqiue to each indiviudal so is used for customer records
            .from('people')
            .select('*') 
            .ilike('LicenseNumber', `%${license}%`);
            console.log(data)
            
            /* LICENSE NUMBER IS UNQIUE/DOESNT MATCH ANY RECORD IN SYSTEM SO CUSTOMER IS ADDED */
            if(data.length === 0)
            {
                // Fetches data inputs to add to db 
                const name = document.getElementById('nameinput').value;
                const residence = document.getElementById('residenceinput').value;
                const dob = document.getElementById('dobinput').value;
                const license = document.getElementById('licenseinput').value;
                const expiry = document.getElementById('expiryinput').value;

                // Data input for db
                const addCustomer = {
                Name: name,
                Address: residence,
                DOB: dob,
                LicenseNumber: license,
                ExpiryDate: expiry
                }
                
                /* DATA INSERTION */
                const { data, error } = await supabase.from('people').insert([addCustomer]);
                if(error)
                {
                    console.log("---------------------------------");
                    console.error('Could not add data to database');
                    console.log("---------------------------------");
                    err("failed to add data")
                }else
                {   
                    console.log("---------------------------------");
                    console.log('Data was added to database!');
                    console.log("---------------------------------");
                    msg("Customer was succesfully added to the system!")
                }
            }

            /* LICENSE NUMBER WAS FOUND IN THE SYSTEM SO CUSTOMER ALREADY EXISTS IN IT */
            else if(data.length !== 0)
            {
                console.log("success")
                err("Customer already exists in the system. You can register a vehicle to them already.")
            }

            /* FAILED TO CONNECT TO DATABASE */
            else if(error)
            {
                console.log("failed to connect")
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
        <strong>SUCCESS!</strong>
        <hr>
          <span class="resultsnum">${fullMessage}</span>`; // Print return results number 
        msgElement.className = ''; // Clear previous classes
        msgElement.style.display = 'block';
    }


    function err(errmsg) {
        const errElement = document.getElementById('error');
        const msgElement = document.getElementById('message');


        if (currentPage === 'index.html' || currentPage === 'vehiclesearch.html' )
        {
            console.log("hello sir")
            const resultsnumElement = document.getElementById('resultsnum');
            const dbreturnElement = document.getElementById('results');
            resultsnumElement.innerHTML = ''; // Clear results num 
            dbreturnElement.innerHTML = ''; // Clear results
        }
    
        /* CLEAR SUCCESS, ERROR, RESULTS NUM AND RETURN RESULTS */
        msgElement.innerHTML = ''; // Clear success message
        errElement.innerHTML = ''; // Clear error msg 
    
        /* MAIN ERROR MSG WITH REASON FOR ERROR */
        errElement.innerHTML = `
            <strong>ERROR</strong>
            <hr>
            <p>${errmsg}</p>
        `;
    }
