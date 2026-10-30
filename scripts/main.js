console.log(document);

const contactForm = document.forms["contact"];
const firstName = contactForm.elements["first-name"];
const lastName = contactForm.elements["last-name"];
const email = contactForm.elements["email"];
const query = contactForm.elements["query-radio-group"];
const message = contactForm.elements["message"];
const consent = contactForm.elements["consent"];

const formGroups = Array.from(contactForm.getElementsByClassName('form-group'));

const success = document.querySelector('.success');

// console.log(contactForm);
// console.log(firstName);
// console.log(lastName);
// console.log(email);
// console.log(query);
// console.log(message);
// console.log(consent);
// console.log(formGroups);

addEventListener("submit", submitForm);

function submitForm(event) {
    event.preventDefault();
    // console.log("submit");

    Array.from(contactForm.elements).forEach(
        (element) => {
            const formGroup = element.closest('.form-group');

            if (element.getAttribute('type') === "submit" || element.getAttribute('type') === "radio") {
                return;
            }

            // console.log("ELement: ", element);
            // console.log("formGroup", formGroup);

            const event = new CustomEvent('validate', {
                detail: {
                    value: element.value,
                    errorElement: formGroup,
                }
            });
            if (element.hasAttribute('data-group')) {
                event.detail.value = new FormData(contactForm).get(element.getAttribute('data-group'));
                // console.log("Value: ", event.detail.value);
            }
            else if (element.getAttribute('type') === 'checkbox') {
                event.detail.value = element.checked;
            }

            element.dispatchEvent(event);
        }
    );

    /*
    do sanitation if using inputs
    */

    if (!formGroups.some(e => e.classList.contains('error'))) {
        console.log("success");

        // contactForm.classList.add('hidden');
        // contactForm.setAttribute('aria-hidden', 'true');
        contactForm.reset();

        success.classList.remove('hidden');
        success.setAttribute('aria-hidden', 'false');
    }
}

function validateInput(test) {
    const validate = (event) => {
        try {
            const result = test(event.detail.value);
            console.log("Result: ", result);

            if (!result) {
                throw new Error();
            }
            
            event.detail.errorElement.classList.remove('error')
        } catch (error) {
            event.detail.errorElement.classList.add('error');
        }
    };
    return validate;
}

/* validation */
firstName.addEventListener('validate', validateInput(val => {
    return val?.trim();
}));
lastName.addEventListener('validate', validateInput(val => {
    return val?.trim();
}));
email.addEventListener('validate', validateInput(val => {
    console.log("Email:", val);
    return validateEmail(val?.trim());
}));
query.addEventListener('validate', validateInput(val => {
    // console.log("Query:", val);
    return val;
}));
message.addEventListener('validate', validateInput(val => {
    return val?.trim();
}));
consent.addEventListener('validate', validateInput(val => {
    // console.log("Consent:", val);
    return val;
}));


function validateEmail(email) {
    // this isn't correct
    return /\w+@\w+\.\w+/.test(email) && email.length <= 320;
}