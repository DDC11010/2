document.addEventListener("DOMContentLoaded", function () {
    const resultsDiv = document.getElementById("results123");
    const priceElement = document.getElementById("propertyPrice");
    const detailsElement = document.getElementById("details"); // Get the details element
    const depositPercentage = 5; // Deposit percentage

    // Function to extract and clean the property price
    function getPropertyPrice() {
        const priceText = priceElement.innerText.trim(); // Get the text content
        return parseFloat(priceText.replace(/[^0-9.]/g, '')); // Remove non-numeric characters
    }

    // Function to extract size and convert to square meters
    function getSizeInSquareMeters() {
        const detailsText = detailsElement.innerText.trim(); // Get the text content of the details element
        const sizeMatch = detailsText.match(/(Land Size|Size): ([\d,]+) sq\. ft\./); // Extract size using regex

        if (!sizeMatch) {
            console.error("Size not found in the details string.");
            return null;
        }

        // Extract the size value and remove commas
        const sizeSqFt = parseFloat(sizeMatch[2].replace(/,/g, ''));

        // Convert square feet to square meters
        const sizeSqMeters = sizeSqFt * 0.092903;

        // Round the result to 2 decimal places
        return Math.round(sizeSqMeters * 100) / 100;
    }

    // Function to check if the property is land
    function isLand() {
        const detailsText = detailsElement.innerText.trim();
        return detailsText.includes("Land Size"); // Check for "Land Size" in the details text
    }

    // Define costs for each option
    const optionCosts = {
        refurbish: {
            deposit: 0, // Will be updated dynamically
            estateAgent: 9000,
            mortgageBroker: 1000,
            epc: 10000,
            survey: 2000,
            legal: 10000,
            mortgageFees: 10000,
            refurbishCosts: 0, // Will be updated dynamically
            costPerSqm: 1250 // Average cost per sqm for refurbishment in Croydon
        },
        demolish: {
            deposit: 0, // Will be updated dynamically
            estateAgent: 9000,
            mortgageBroker: 1000,
            epc: 10000,
            survey: 2000,
            legal: 10000,
            mortgageFees: 10000,
            demolitionCosts: 0, // Will be updated dynamically
            costPerSqm: 75 // Average cost per sqm for demolition in Croydon
        },
        build: {
            deposit: 0, // Will be updated dynamically
            estateAgent: 9000,
            mortgageBroker: 1000,
            epc: 10000,
            survey: 2000,
            legal: 10000,
            mortgageFees: 10000,
            constructionCosts: 0, // Will be updated dynamically
            costPerSqm: 2250 // Average cost per sqm for new build in Croydon
        },
        container: {
            deposit: 0, // Will be updated dynamically
            estateAgent: 9000,
            mortgageBroker: 1000,
            epc: 10000,
            survey: 2000,
            legal: 10000,
            mortgageFees: 10000,
            containerCosts: 0, // Will be updated dynamically
            costPerSqm: 1500 // Average cost per sqm for container homes in Croydon
        }
    };

    // Function to calculate total upfront costs
    function calculateTotalUpfront(costs) {
        return Object.values(costs).reduce((sum, cost) => sum + cost, 0);
    }

    // Function to calculate average cost per square meter
    function calculateCostPerSqm(totalCost, sizeSqMeters) {
        if (sizeSqMeters === null || sizeSqMeters === 0) {
            return null; // Avoid division by zero
        }
        return Math.round((totalCost / sizeSqMeters) * 100) / 100; // Round to 2 decimal places
    }

    // Function to display results
    function displayResults(option) {
        const propertyPrice = getPropertyPrice(); // Get the cleaned property price
        const sizeSqMeters = getSizeInSquareMeters(); // Get the size in square meters
        const costs = { ...optionCosts[option] }; // Create a copy of the option costs
        // Check if the property is land
        const isLandProperty = isLand();

        // Clear the resultsDiv before displaying new results
        resultsDiv.innerHTML = "";

        // Handle land properties
        if (isLandProperty && (option === "refurbish" || option === "demolish")) {
            resultsDiv.innerHTML = `
                <h3>Upfront Costs Breakdown (${option})</h3>
                <div class="not-applicable">
                    <strong>Not Applicable:</strong> This option is not applicable for land properties.
                </div>
            `;
            return; // Exit the function early
        }

        // Update dynamic costs based on property size
        if (sizeSqMeters !== null) {
            if (option === "refurbish") {
                costs.refurbishCosts = costs.costPerSqm * sizeSqMeters;
            } else if (option === "demolish") {
                costs.demolitionCosts = costs.costPerSqm * sizeSqMeters;
            } else if (option === "build") {
                costs.constructionCosts = costs.costPerSqm * sizeSqMeters;
            } else if (option === "container") {
                costs.containerCosts = costs.costPerSqm * sizeSqMeters;
            }
        }

        costs.deposit = propertyPrice * (depositPercentage / 100); // Update deposit dynamically

        const totalUpfront = calculateTotalUpfront(costs);
        const costPerSqm = calculateCostPerSqm(totalUpfront, sizeSqMeters); // Calculate cost per sqm

        // Create the new content
        const content = `
            <h3>Upfront Costs Breakdown (${option})</h3>
            <ul>
                ${Object.entries(costs).map(([name, value]) => `
                    <li>${name}: £${value.toLocaleString()}</li>
                `).join('')}
            </ul>
            <div class="total">
                <strong>Total Upfront Costs:</strong> £${totalUpfront.toLocaleString()}
            </div>
            ${sizeSqMeters !== null ? `
                <div class="size">
                    <strong>Property Size:</strong> ${sizeSqMeters} m²
                </div>
            ` : ''}
            ${costPerSqm !== null ? `
                <div class="cost-per-sqm">
                    <strong>Average Cost per Square Meter:</strong> £${costPerSqm.toLocaleString()}
                </div>
            ` : ''}
        `;

        // Append the new content to the resultsDiv
        resultsDiv.innerHTML = content;

        // Update the option choice and price in the table
        const optionChoiceElement = document.getElementById('optionChoice');
        const optionChoicePriceElement = document.getElementById('optionChoicePrice');

        if (optionChoiceElement && optionChoicePriceElement) {
            // Update the option name (e.g., "Refurbish Costs")
            optionChoiceElement.textContent = `${option.charAt(0).toUpperCase() + option.slice(1)} Costs`;

            // Update the option cost (e.g., "£197,425")
            const optionCostKey = `${option}Costs`; // e.g., "refurbishCosts"
            optionChoicePriceElement.textContent = `£${costs[optionCostKey].toLocaleString()}`;
        } else {
            console.error("Elements for option choice or price not found.");
        }
    }

    // Attach event listeners to buttons
    document.querySelectorAll(".button").forEach(button => {
        button.addEventListener("click", () => {
            // Determine the option based on the button's class
            let option;
            if (button.classList.contains("refurbish")) {
                option = "refurbish";
            } else if (button.classList.contains("demolish")) {
                option = "demolish";
            } else if (button.classList.contains("build")) {
                option = "build";
            } else if (button.classList.contains("container")) {
                option = "container";
            }

            // Display the results for the selected option
            if (option) {
                displayResults(option);
            }
        });
    });

    // Initialize with the first option (e.g., refurbish)
    displayResults("refurbish");

    // Update the property price in the HTML
    const propertyPrice = getPropertyPrice(); // Get the property price
    const propertyPriceTdElement = document.getElementById('propertyPriceTd');

    if (propertyPriceTdElement) {
        propertyPriceTdElement.textContent = `£${propertyPrice.toLocaleString()}`;
    } else {
        console.error("Element with ID 'propertyPriceTd' not found.");
    }

    // Calculate the deposit
    const deposit = propertyPrice * (depositPercentage / 100); // Calculate deposit

    // Update the deposit element in the HTML
    const depositTdElement = document.getElementById('depositTd');
    if (depositTdElement) {
        depositTdElement.textContent = `£${deposit.toLocaleString()}`; // Format and display the deposit
    } else {
        console.error("Element with ID 'depositTd' not found.");
    }
});