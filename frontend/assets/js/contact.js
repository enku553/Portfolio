// Contact form -> backend API
(function () {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form) return;

  const API_URL = window.CONTACT_API_URL || "/api/contact";

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    status.textContent = "";
    status.className = "col-12 text-center";

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
    };

    if (!data.name || !data.email || !data.subject || !data.message) {
      status.textContent = "Please fill in all fields.";
      status.style.color = "#e35d6a";
      return;
    }

    const button = form.querySelector("button[type='submit']");
    button.disabled = true;
    button.textContent = "Sending...";

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        status.textContent = "Thank you! Your message has been sent.";
        status.style.color = "#59e0a8";
        form.reset();
      } else {
        status.textContent =
          (result && result.error) || "Something went wrong. Please try again.";
        status.style.color = "#e35d6a";
      }
    } catch (err) {
      status.textContent =
        "Could not reach the server. Please try again later.";
      status.style.color = "#e35d6a";
    } finally {
      button.disabled = false;
      button.textContent = "Send Message";
    }
  });
})();
