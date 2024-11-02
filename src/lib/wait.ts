function findCompanyByPhoneNumber(phoneNumber) {
  return Company.findOne({ "phoneInfo.phoneNumber": phoneNumber });
}

function sendConfirmationSms(phoneNumber) {
  // Your SMS sending logic here, e.g., using an SMS API
  console.log(`Sending confirmation SMS to ${phoneNumber}`);
}

// Using both in parallel:
function handleIncomingCall(phoneNumber) {
  // Start the SMS send immediately
  sendConfirmationSms(phoneNumber);

  // Start the query to find the company
  findCompanyByPhoneNumber(phoneNumber)
    .then(company => {
      if (company) {
        console.log("Company found:", company);
      } else {
        console.log("No company found for this phone number.");
      }
    })
    .catch(error => {
      console.error("Error finding company:", error);
    });
}

// Example usage
handleIncomingCall("1234567890");
