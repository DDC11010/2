document.addEventListener('DOMContentLoaded', () => {
    // Configuration for the first set of calculations

    // Function to get the deposit value from the HTML
    function getDepositValue() {
        const depositText = document.getElementById('depositTd').textContent;
        // Remove the currency symbol and non-numeric characters except periods
        const numericText = depositText.replace(/[^0-9.]/g, '');
        // Treat periods as thousands separators and remove them
        const valueWithoutSeparators = numericText.replace(/\./g, '');
        const value = parseFloat(valueWithoutSeparators);

        if (isNaN(value)) {
            console.error("Invalid deposit value extracted:", depositText);
            return 0; // Fallback to 0 if the value is invalid
        }

        return value;
    }

    function getProprtyValue() {
        const depositText = document.getElementById('propertyPriceTd').textContent;
        // Remove the currency symbol and non-numeric characters except periods
        const numericText = depositText.replace(/[^0-9.]/g, '');
        // Treat periods as thousands separators and remove them
        const valueWithoutSeparators = numericText.replace(/\./g, '');
        const value = parseFloat(valueWithoutSeparators);

        if (isNaN(value)) {
            console.error("Invalid deposit value extracted:", depositText);
            return 0; // Fallback to 0 if the value is invalid
        }

        return value;
    }

    const currentValue = document.getElementById('propertyPriceTd').textContent;

    function x(currentValue, annualGrowthRate, years) {
        // Calculate future value using the compound growth formula
        return currentValue * Math.pow(1 + annualGrowthRate, years);
    }

    // Input values
    const currentPropertyValue = 600000; // Current property value in GBP
    const annualGrowthRate = 0.055; // 5.5% annual growth rate (based on historical data)
    const years = 25; // Number of years

    // Get the future property value
    const futurePropertyValue = x(currentPropertyValue, annualGrowthRate, years);

    function getTotalLoanCost() {
        const depositText = document.getElementById('totalMortgageCostTd').textContent;
        // Remove the currency symbol and non-numeric characters except periods
        const numericText = depositText.replace(/[^0-9.]/g, '');
        // Treat periods as thousands separators and remove them
        const valueWithoutSeparators = numericText.replace(/\./g, '');
        const value = parseFloat(valueWithoutSeparators);

        if (isNaN(value)) {
            console.error("Invalid deposit value extracted:", depositText);
            return 0; // Fallback to 0 if the value is invalid
        }

        return value;
    }

    // Function to get the total work value from the HTML
    function getWorkTotalValue() {
        const totalCostElement = document.getElementById('totalCostTd');
        if (!totalCostElement) {
            console.error("totalCostTd element not found!");
            return 0; // Fallback to 0 if the element doesn't exist
        }

        const depositText = totalCostElement.textContent;
        console.log("totalCostTd content:", depositText); // Debugging log

        const numericText = depositText.replace(/[^0-9.]/g, '');
        const valueWithoutSeparators = numericText.replace(/\./g, '');
        const value = parseFloat(valueWithoutSeparators);

        if (isNaN(value)) {
            console.error("Invalid value extracted from totalCostTd:", depositText);
            return 0; // Fallback to 0 if the value is invalid
        }

        return value;
    }

    function updateTotalExpenses() {
        return getWorkTotalValue() + getTotalLoanCost();
    }

    function getOptionName() {
        const optionNameElement = document.getElementById('optionNameTd');
        if (!optionNameElement) {
            console.error("optionNameTd element not found!");
            return "Unknown Option"; // Fallback to a default name
        }
        return optionNameElement.textContent.trim(); // Get the selected option name
    }

    // Function to recalculate costs1 dynamically
    function calculateCosts1() {
        return {
            //MonthlyExpenses: 2000,
            //InterestRate: 16345,
            MortgageEligibility: futurePropertyValue,
            Deposit: updateTotalExpenses(),
            //Affordability: getDepositValue(), // Use the value here
            
            //MonthlyPayment: getTotalLoanCost(),
            //OptionName: getOptionName(), // Add the selected option name
        };
    }

    // Function to display results
    function displayResults1(data) {
        const resultDiv = document.getElementById('result');
        const items = [
            
            //['Monthly Expenses', data.MonthlyExpenses],
            //[`${data.OptionName} `, data.Affordability], // Use the dynamic name here
            //['Interest Rate', data.InterestRate],
            //['Monthly Payment', data.MonthlyPayment],
            ['Future Price', data.MortgageEligibility],
            ['Total Expences', data.Deposit],
        ];

        // Calculate the total revenue
        //const totalRevenue = items.reduce((sum, [_, value]) => sum + (isNaN(value) ? 0 : value), 0);
        const totalRevenue = data.MortgageEligibility - data.Deposit
   
        
        // Create HTML for the results
        resultDiv.innerHTML = `
            <h3>Total Revenue</h3>
            ${items.map(([name, value]) => `
                <div class="cost-item">
                    <span class="label">${name}:</span>
                    <span class="value">£${Math.round(value).toLocaleString()}</span>
                </div>
            `).join('')}
            <div class="cost-item total">
                <span class="label">Profit:</span>
                <span class="value">£${Math.round(totalRevenue).toLocaleString()}</span>
            </div>
        `;
    }

    let chartInstance = null; // Variable to store the chart instance

    // Create or update pie chart for the first set of calculations
    function createChart1(data) {
        const ctx = document.getElementById('costChart').getContext('2d');
        const total = Object.values(data).reduce((sum, v) => sum + (isNaN(v) ? 0 : v), 0);

        // Define the labels for the pie chart
        const labels = [
            'Future Price',
            'Total Expences',
            data.OptionName, // Use the dynamic option name here
            'Deposit',
            'Monthly Payment',
            'Mortgage Eligibility',
        ];

        const values = [
            //data.MonthlyExpenses,
            //data.InterestRate,
            //data.Affordability, // Use the affordability value here
            //data.MonthlyPayment,
            data.MortgageEligibility,
            data.Deposit,
        ];

        // Debugging: Log the total and values
        console.log("Chart Total:", total);
        console.log("Chart Values:", values);

        // Destroy the existing chart instance if it exists
        if (chartInstance) {
            chartInstance.destroy();
        }

        // Create a new chart instance
        chartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        '#A1D100', '#575757',
                    ],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: 50
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            },
            plugins: [{
                id: 'customLabels',
                afterDraw(chart) {
                    const ctx = chart.ctx;
                    const { width, height } = chart;
                    const centerX = width / 2;
                    const centerY = height / 2;
                    const radius = Math.min(width, height) / 2 * 0.75;

                    ctx.save();
                    ctx.font = 'bold 16px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    chart.data.datasets[0].data.forEach((value, i) => {
                        const meta = chart.getDatasetMeta(0).data[i];
                        const angle = meta.startAngle + (meta.endAngle - meta.startAngle) / 2;

                        // Calculate percentage only if total is valid and greater than 0
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';

                        // Line coordinates
                        const startX = centerX + Math.cos(angle) * radius;
                        const startY = centerY + Math.sin(angle) * radius;
                        const endX = centerX + Math.cos(angle) * (radius + 15);
                        const endY = centerY + Math.sin(angle) * (radius + 15);

                        // Draw line
                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        ctx.lineTo(endX, endY);
                        ctx.strokeStyle = '#333';
                        ctx.lineWidth = 1.5;
                        ctx.stroke();

                        // Draw label with an offset
                        const textX = endX + (Math.cos(angle) * 20);
                        const textY = endY + (Math.sin(angle) * 20);
                        ctx.fillStyle = '#333';
                        ctx.textAlign = Math.cos(angle) > 0 ? 'left' : 'right';
                        ctx.fillText(`${labels[i]} (${percentage})`, textX, textY);
                    });

                    ctx.restore();
                }
            }]
        });
    }

    // Function to update everything
    function updateEverything() {
        const costs1 = calculateCosts1(); // Recalculate costs1
        console.log("Updated costs1:", costs1);
        displayResults1(costs1); // Display the updated results
        createChart1(costs1); // Update the chart
    }

    // Initialize the first set of calculations
    updateEverything();

    // Observe changes to the totalCostTd and optionNameTd elements
    const totalCostElement = document.getElementById('totalCostTd');
    const optionNameElement = document.getElementById('optionNameTd');

    if (totalCostElement && optionNameElement) {
        const observer = new MutationObserver(() => {
            updateEverything(); // Recalculate and update everything
        });

        observer.observe(totalCostElement, {
            childList: true, // Observe changes to the text content
            characterData: true, // Observe changes to the text content
            subtree: true // Observe changes in all descendants
        });

        observer.observe(optionNameElement, {
            childList: true, // Observe changes to the text content
            characterData: true, // Observe changes to the text content
            subtree: true // Observe changes in all descendants
        });
    } else {
        console.error("totalCostTd or optionNameTd element not found!");
    }

    


































// Function to format numbers with dots every 3 digits
function formatNumber(number) {
    return number.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

// Main calculation function for the second set of calculations
function calculateCosts() {
    const costs = {
        Deposit: getDepositValue(),
        MortgageFees: 12000,
        Legal: 10000,
        EPC: 10000,
        Survey: 8000,
        EstateAgent: 6500,
        MortgageBroker: 1000,
    };

    costs.totalUpfront = Object.values(costs).reduce((a, b) => a + b, 0);
    return costs;
}

// Shared list of items for the second set of calculations
const items2 = [
    ['Deposit', 'Deposit'],
    ['Mortgage Fees', 'MortgageFees'],
    ['Legal Fees', 'Legal'],
    ['EPC Certificate', 'EPC'],
    ['Survey Costs', 'Survey'],
    ['Estate Agent Fees', 'EstateAgent'],
    ['Mortgage Broker Fees', 'MortgageBroker'],
];

// Display results for the second set of calculations
function displayResults2(data) {
    const resultDiv = document.getElementById('result2');
    resultDiv.innerHTML = `
        <h3>Upfront Costs Breakdown</h3>
        ${items2.map(([name, key]) => `
            <div class="cost-item">
                <span class="label">${name}:</span>
                <span class="value">£${formatNumber(data[key])}</span>
            </div>
        `).join('')}
        <div class="cost-item total">
            <span class="label">Total Upfront Costs:</span>
            <span class="value">£${formatNumber(data.totalUpfront)}</span>
        </div>
    `;
}

// Create pie chart for the second set of calculations with custom labels
function createChart2(data) {
    const ctx = document.getElementById('costChart2').getContext('2d');
    const chartData = items2.reduce((acc, [name, key]) => {
        acc[name] = data[key];
        return acc;
    }, {});

    const total = Object.values(chartData).reduce((sum, v) => sum + v, 0);
    const labels = Object.keys(chartData);
    const values = Object.values(chartData);

    // Destroy existing chart if it exists
    if (window.myChart) {
        window.myChart.destroy();
    }

    // Create new chart with custom label plugin
    window.myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: ['#3A9B9B', '#6A2A8C', '#808080', '#27A45B', '#D94C59', '#D9782D', '#A1D100'],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: 50
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const percentage = ((value / total) * 100).toFixed(1) + '%';
                            return `${label}: £${formatNumber(value)} (${percentage})`;
                        }
                    }
                }
            }
        },
        plugins: [{
            id: 'customLabels',
            afterDraw(chart) {
                const ctx = chart.ctx;
                const { width, height } = chart;
                const centerX = width / 2;
                const centerY = height / 2;
                const radius = Math.min(width, height) / 2 * 0.75;

                ctx.save();
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                chart.data.datasets[0].data.forEach((value, i) => {
                    const meta = chart.getDatasetMeta(0).data[i];
                    const angle = meta.startAngle + (meta.endAngle - meta.startAngle) / 2;

                    // Calculate percentage
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';

                    // Line coordinates
                    const startX = centerX + Math.cos(angle) * radius;
                    const startY = centerY + Math.sin(angle) * radius;
                    const endX = centerX + Math.cos(angle) * (radius + 15);
                    const endY = centerY + Math.sin(angle) * (radius + 15);

                    // Draw line
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(endX, endY);
                    ctx.strokeStyle = '#333';
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    // Draw label
                    const textX = endX + (Math.cos(angle) * 10);
                    const textY = endY + (Math.sin(angle) * 10);
                    ctx.fillStyle = '#333';
                    ctx.font = 'bold 16px Arial';
                    ctx.textAlign = Math.cos(angle) > 0 ? 'left' : 'right';
                    ctx.fillText(` (${percentage})`, textX, textY);
                });

                ctx.restore();
            }
        }]
    });
}

// Function to update calculations and UI
function updateCalculations() {
    const results = calculateCosts();
    displayResults2(results);
    createChart2(results);
}

// Initialize the second set of calculations
updateCalculations();

// MutationObserver for deposit changes
const depositElement = document.getElementById('depositTd');
const observer = new MutationObserver(() => {
    updateCalculations();
});

observer.observe(depositElement, {
    childList: true,
    characterData: true,
    subtree: true
});

});
