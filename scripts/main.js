const contactForm = document.forms["contact"];
const firstName = contactForm.elements["first-name"];
const lastName = contactForm.elements["last-name"];
const email = contactForm.elements["email"];
const query = contactForm.elements["query-radio-group"];
const message = contactForm.elements["message"];
const consent = contactForm.elements["consent"];

const formErrorText = document.createElement("list");
formErrorText.setAttribute("aria-live", "assertive");

const formGroups = Array.from(contactForm.getElementsByClassName('form-group'));

const success = document.querySelector('.success');

const errorDiv = contactForm.querySelector(".error-div");
const errorList = errorDiv.querySelector("& > ul");

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
    success.classList.add("hidden");
    errorList.textContent = '';
    errorDiv.setAttribute('aria-hidden', 'true');

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
        success.removeAttribute('aria-hidden');
    }
}

function validateInput(test) {
    const validate = (event) => {
        const formGroup = event.detail.errorElement;
        const label = formGroup.querySelector("label, legend");
        const errorText = formGroup.querySelector(".error-text");

        try {
            resetError(formGroup, label, errorText);


            const result = test(event.detail.value);
            console.log("Result: ", result);

            if (!result) {
                throw new Error();
            }
        } catch (error) {
            addError(formGroup, label, errorText);
        }
    };
    return validate;
}


function resetError(formGroup, label, errorText) {
    formGroup.classList.remove('error');

    label.removeAttribute('aria-hidden');
    label.removeAttribute('role');
    errorText.setAttribute('aria-hidden', 'true');
    errorText.removeAttribute('role');
}

function addError(formGroup, label, errorText) {
    formGroup.classList.add('error');

    const l = label.cloneNode(true);
    const e = errorText.cloneNode(true);

    const li = document.createElement("li");
    li.setAttribute('role', 'alert');

    li.appendChild(l);
    li.appendChild(e);

    errorList.appendChild(li);
    errorDiv.setAttribute('aria-hidden', "false");

    l.setAttribute('aria-hidden', 'false');
    // l.setAttribute('role', 'alert');
    e.setAttribute('aria-hidden', 'false');
    e.classList.remove("hidden");
    // e.setAttribute('role', 'alert');
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