
const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");

contactForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const subject = document.getElementById("contact-subject").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    if (!name || !email || !subject || !message) {
        contactStatus.textContent = "Please fill in all fields.";
        return;
    }

    contactStatus.textContent =
        "Thank you, " + name + "! Your demo message has been submitted.";

    contactForm.reset();
});
