const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Replace 'YOUR_MONGODB_URI' with your MongoDB URI
mongoose.connect('mongodb+srv://dodoworks1:nAcuhXR3cYvHazqX@cluster0.olimoqh.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define a Mongoose model for licenses
const License = mongoose.model('License', {
  key: String,
  expirationDate: Date,
  activated: Boolean,
  // Add more fields as needed (e.g., user information)
});

// Endpoint to generate a new license
app.post('/generate-license', async (req, res) => {
  // Implement license generation logic here (e.g., generate a unique key)
  const licenseKey = 'GENERATED_LICENSE_KEY';

  // Store the new license in the database (add user info if needed)
  const newLicense = new License({
    key: licenseKey,
    expirationDate: new Date(), // Set the expiration date as needed
    activated: false,
  });
  await newLicense.save();

  res.json({ licenseKey });
});

// Endpoint to validate a license
app.post('/validate-license', async (req, res) => {
  const { licenseKey } = req.body;

  // Look up the license in the database
  const license = await License.findOne({ key: licenseKey });

  if (!license) {
    res.json({ valid: false });
    return;
  }

  // Check if the license is activated and not expired
  const currentDate = new Date();
  if (license.activated && currentDate <= license.expirationDate) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
