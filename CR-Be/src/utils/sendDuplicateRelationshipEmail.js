import nodemailer from "nodemailer";

export const sendDuplicateRelationshipEmail = async ({
  fromPerson,
  toPerson,
  newRelationshipType,
  existingRelationshipType,
}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Cosmic Register" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "Duplicate Relationship Creation Attempt",

      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          
          <h2 style="color: red;">
            Duplicate Relationship Attempt Detected
          </h2>

          <p>
            Someone attempted to create another relationship between two persons
            who already have an existing relationship.
          </p>

          <hr/>

          <h3>Existing Relationship</h3>
          <p>
            <strong>${existingRelationshipType}</strong>
          </p>

          <h3>Attempted New Relationship</h3>
          <p>
            <strong>${newRelationshipType}</strong>
          </p>

          <hr/>

          <h3>From Person Details</h3>

          <ul>
            <li>
              <strong>Name:</strong>
              ${fromPerson.firstName || ""} 
              ${fromPerson.middleName || ""} 
              ${fromPerson.lastName || ""}
            </li>

            <li>
              <strong>Email:</strong>
              ${fromPerson.emailId || "N/A"}
            </li>

            <li>
              <strong>Phone:</strong>
              ${fromPerson.phoneNo || "N/A"}
            </li>

            <li>
              <strong>Gender:</strong>
              ${fromPerson.gender || "N/A"}
            </li>

            <li>
              <strong>Family Code:</strong>
              ${fromPerson.familyGroupCode || "N/A"}
            </li>
          </ul>

          <hr/>

          <h3>To Person Details</h3>

          <ul>
            <li>
              <strong>Name:</strong>
              ${toPerson.firstName || ""} 
              ${toPerson.middleName || ""} 
              ${toPerson.lastName || ""}
            </li>

            <li>
              <strong>Email:</strong>
              ${toPerson.emailId || "N/A"}
            </li>

            <li>
              <strong>Phone:</strong>
              ${toPerson.phoneNo || "N/A"}
            </li>

            <li>
              <strong>Gender:</strong>
              ${toPerson.gender || "N/A"}
            </li>

            <li>
              <strong>Family Code:</strong>
              ${toPerson.familyGroupCode || "N/A"}
            </li>
          </ul>

          <hr/>

          <p style="color: gray;">
            Cosmic Register Security Notification
          </p>

        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("Duplicate relationship email sent to admin");
  } catch (error) {
    console.error("Email send failed:", error.message);
  }
};