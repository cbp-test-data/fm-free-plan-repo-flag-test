require("dotenv").config();

const Rox = require("rox-node");

// ---------------------------------------------------------
// 1. Define our feature flags
// ---------------------------------------------------------

const flags = {
  newWelcomeMessage: new Rox.Flag(false),

  buttonColor: new Rox.RoxString("blue", [
    "blue",
    "green",
    "red"
  ]),

  maxItems: new Rox.RoxNumber(5, 10, 15)
};

// ---------------------------------------------------------
// 2. Register the flags with CloudBees
// ---------------------------------------------------------

Rox.register("demo", flags);

// ---------------------------------------------------------
// 3. Connect to CloudBees
// ---------------------------------------------------------

const sdkKey = process.env.CLOUDBEES_SDK_KEY;

if (!sdkKey || sdkKey === "62156c5d-3064-431b-80a5-ac3e411ef04c") {
  console.error(
    "\nERROR: CLOUDBEES_SDK_KEY is not configured.\n" +
    "Copy .env.example to .env and add your CloudBees SDK key.\n"
  );

  process.exit(1);
}

// ---------------------------------------------------------
// 4. Start the application
// ---------------------------------------------------------

async function main() {
  console.log("Connecting to CloudBees Unify...");

 await Rox.setup(sdkKey, {
  debugLevel: "verbose",

  configurationFetchedHandler: (result) => {
    console.log("\n=== CloudBees configuration fetched ===");
    console.log(result);
    console.log("========================================\n");
  }
});

  console.log("Connected to CloudBees Unify.\n");

  console.log("========================================");
  console.log(" CloudBees Feature Flag Demo");
  console.log("========================================");
  console.log("Press Ctrl+C to stop.\n");

  printConfiguration();

  // Refresh the displayed values periodically so we can
  // easily see configuration changes while the application
  // is running.
  setInterval(printConfiguration, 5000);
}

// ---------------------------------------------------------
// 5. Read and display the current flag values
// ---------------------------------------------------------

function printConfiguration() {
  const enabled = flags.newWelcomeMessage.isEnabled();
  const color = flags.buttonColor.getValue();
  const maxItems = flags.maxItems.getValue();

  console.clear();

  console.log("========================================");
  console.log(" CloudBees Feature Flag Demo");
  console.log("========================================");
  console.log(`Last checked: ${new Date().toLocaleTimeString()}`);
  console.log("");

  console.log("Feature flags");
  console.log("----------------------------------------");

  console.log(
    `demo.newWelcomeMessage : ${enabled ? "ON" : "OFF"}`
  );

  console.log(`demo.buttonColor       : ${color}`);
  console.log(`demo.maxItems          : ${maxItems}`);

  console.log("");
  console.log("Application behavior");
  console.log("----------------------------------------");

  if (enabled) {
    console.log("🎉 NEW EXPERIENCE ENABLED");
    console.log("");
    console.log("Welcome to the NEW CloudBees experience!");
  } else {
    console.log("OLD EXPERIENCE");
    console.log("");
    console.log("Hello! This is the existing experience.");
  }

  console.log("");
  console.log(`Button color: ${color}`);
  console.log(`Maximum items: ${maxItems}`);

  console.log("");
  console.log("Change the flags in CloudBees Unify.");
  console.log("The application will pick up the new configuration.");
}

main().catch((error) => {
  console.error("Failed to initialize CloudBees SDK:");
  console.error(error);
  process.exit(1);
});
