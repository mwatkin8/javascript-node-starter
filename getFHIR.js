//Global variable to make it easier to change the server. Can be made local by including it in each function.
let api_base = 'http://fhirtest.uhn.ca/baseDstu3/';

/**
 * This example returns the ID, name, and birth year for all females over 45 years old.
 */
function getPatient(){
    //Select the field in your HTML where you want to display the FHIR data you're about to query
    let p = document.getElementById('patient');
    p.innerHTML += 'ID, name, and birth year for each female over 45 years old in the ' + api_base + ' FHIR server.\n\n';
    //Get all females from the FHIR server
    fetch(api_base + 'Patient?gender=female')
        .then((resp) => resp.json())
        .then(function (resp){
            let count = 0;
            resp.entry.forEach( entry => {
                //Extract the birth year from each returned female Patient resource to determine their age
                let patient = entry.resource;
                let birthDate = patient.birthDate;
                let id = patient.id;
                let name = patient.name[0].given[0] + ' ' + patient.name[0].family;
                if (birthDate !== undefined){
                    let year = birthDate.split('-')[0];
                    if(year < 1973){
                        //Write this information out to your HTML
                        p.innerHTML += id + '\n' + name + '\n' + 'Born: ' + year + '\n\n';
                    }
                    count += 1;
                }
            });
            p.innerHTML += 'Total: ' + count + '\n\n';
        })
}

/**
 * This example returns the ID and name of each patient with hypertension.
 */
function getCondition(){
    //Select the field in your HTML where you want to display the FHIR data you're about to query
    let c = document.getElementById('condition');
    c.innerHTML +='ID and name for each patient with hypertension in the ' + api_base + ' FHIR server.\n\n';
    //Get all patients with hypertension from the FHIR server using the SNOMED code for hypertension
    fetch(api_base + 'Condition?code=38341003').then(resp => resp.json())
        .then( function (resp) {
            resp.entry.forEach( entry => {
                //Extract the patient ID from the subject field of each returned Condition resource
                let p_id = entry.resource.subject.reference.split('/')[1];
                //Get each patient by ID from the FHIR server to extract their name
                fetch(api_base + 'Patient?_id=' + p_id)
                    .then(resp => resp.json())
                    .then( function (resp) {
                        //Extract the patient name from the returned Patient resource
                        let patient = resp.entry[0].resource;
                        let id = patient.id;
                        try {
                            let name = patient.name[0].given[0] + ' ' + patient.name[0].family;
                            //Write this information out to your HTML
                            c.innerHTML += id + '\n' + name + '\n\n';
                        }
                        catch {}
                    })
            });
        });
}

/**
 * This function is called when the HTML is rendered using the "onload" function for the <body> element. It calls our
 * two functions in their proper order. Other options to activate these functions would be through buttons or other
 * "onclick" events designated in your HTML.
 */
function launch(){
    getPatient();
    getCondition();
}