
  // document.addEventListener("DOMContentLoaded", function () {
  //   const form = document.querySelector(".appointment"); // Target the form

  //   form.addEventListener("submit", function (event) {
  //     event.preventDefault(); // Prevent default form submission

  //     // Get form values
  //     const name = form.querySelector('input[placeholder="Your Name"]').value;
  //     const email = form.querySelector('input[placeholder="Company"]').value;
  //     const date = form.querySelector('input[placeholder="Date"]').value;
  //     const time = form.querySelector('input[placeholder="Time"]').value;
  //     const message = form.querySelector('textarea[placeholder="Message"]').value;
  //     const serviceProvider = form.querySelector("select").value;

  //     // Validate required fields
     

  //     // Construct email body
  //     const emailBody = `
  //       <b>Name:</b> ${name} <br/>
  //       <b>Company:</b> ${email} <br/>
  //       <b>Service Provider:</b> ${serviceProvider} <br/>
  //       <b>Preferred Date:</b> ${date} <br/>
  //       <b>Preferred Time:</b> ${time} <br/>
  //       <b>Message:</b> ${message}
  //     `;

  //     // Use SMTP.js to send email
  //     Email.send({
  //       Host: "smtp.elasticemail.com",
  //       Username: "ahmad.subhan@swissconsulting.co", // ⚠️ DO NOT expose in frontend
  //       Password: "2E492215D51145999909E393142BA949C3A9", // ⚠️ HUGE SECURITY RISK
  //       To: "info@swissconsulting.co", // Receiver's email
  //       From: "info@swissconsulting.co", // Sender's email
  //       Subject: "New Free Consultation Request",
  //       Body: emailBody,
  //     }).then(() => {
  //       alert("Your message has been sent successfully! You'll receive a response within 24 hours.");
  //       form.reset(); // Reset form after successful submission
  //     }).catch((error) => {
  //       alert("Something went wrong! Please try again.");
  //       console.error(error);
  //     });
  //   });
  // });



  
  
  
  document.addEventListener("DOMContentLoaded", function () {
    // Get the form element
    const form = document.querySelector(".appointment");

    // Handle form submission
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission

      // Collect form data
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Validate required fields
      let isValid = true;
      form.querySelectorAll("[required]").forEach((input) => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.border = "2px solid red"; // Highlight missing fields
        } else {
          input.style.border = "1px solid #ced4da"; // Reset border
        }
      });


      // Simulate form submission (replace with actual API call)
      console.log("Form Data Submitted:", data);

      // Show success message
      alert("Your consultation request has been sent successfully!");

      // Reset the form
      form.reset();
    });
  });
  form.reset();

  // function sendEmail() {
  //   var name = document.getElementById("name").value;
  //   var email = document.getElementById("email").value;
  //   var subject = document.getElementById("subject").value;
  //   var message = document.getElementById("message").value;

  //   var Recievers = ["info@swissconsulting.co"];

  //   var body =
  //     "<br/> Name :" +
  //     name +
  //     "<br/><br/> Email ID : " +
  //     email +
  //     "<br/><br/> Subject : " +
  //     subject +
  //     "<br/><br/> Message : " +
  //     message;

  //   Email.send({
  //     Host: "smtp.elasticemail.com",
  //     Username: "ahmad.subhan@swissconsulting.co",
  //     Password: "2E492215D51145999909E393142BA949C3A9",
  //     To: Recievers,
  //     From: "info@swissconsulting.co",
  //     Subject: subject,
  //     Body: body,
  //   }).then(() => {
  //     alert(
  //       "Your message has been sent successfully, you'll receive a response within 24 hours"
  //     );
  //     location.href = "contact.html";
  //   });
  // }




