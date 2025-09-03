const fs = require('fs');

// Function to convert a string from given base to decimal using BigInt
function baseToDecimal(value, base) {
    let result = BigInt(0);
    let multiplier = BigInt(1);
    const baseBig = BigInt(base);
   
    // Process from right to left
    for (let i = value.length - 1; i >= 0; i--) {
        let digit;
        const char = value[i];
       
        if (char >= '0' && char <= '9') {
            digit = char.charCodeAt(0) - '0'.charCodeAt(0);
        } else if (char >= 'a' && char <= 'z') {
            digit = char.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
        } else if (char >= 'A' && char <= 'Z') {
            digit = char.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
        } else {
            throw new Error(Invalid character '${char}' in value '${value}');
        }
       
        if (digit >= base) {
            throw new Error(Invalid digit '${digit}' for base ${base});
        }
       
        result += BigInt(digit) * multiplier;
        multiplier *= baseBig;
    }
   
    return result;
}

// Parse JSON data and extract points
function parseTestCase(data) {
    const n = data.keys.n;
    const k = data.keys.k;
    const points = [];
   
    // Extract all points except 'keys'
    for (const key in data) {
        if (key !== 'keys') {
            const x = BigInt(key);
            const base = parseInt(data[key].base);
            const value = data[key].value;
            const y = baseToDecimal(value, base);
           
            points.push({
                x: x,
                y: y,
                base: base,
                value: value
            });
        }
    }
   
    // Sort points by x value
    points.sort((a, b) => {
        if (a.x < b.x) return -1;
        if (a.x > b.x) return 1;
        return 0;
    });
   
    return { n, k, points };
}

// Lagrange interpolation to find f(0) - the constant term
function lagrangeInterpolation(points, k) {
    let result = BigInt(0);
   
    // Use only first k points
    const selectedPoints = points.slice(0, k);
   
    for (let i = 0; i < selectedPoints.length; i++) {
        let numerator = selectedPoints[i].y;
        let denominator = BigInt(1);
       
        // Calculate Lagrange basis polynomial L_i(0)
        for (let j = 0; j < selectedPoints.length; j++) {
            if (i !== j) {
                // For f(0): numerator *= (0 - x_j) = -x_j
                numerator *= (-selectedPoints[j].x);
                // denominator *= (x_i - x_j)
                denominator *= (selectedPoints[i].x - selectedPoints[j].x);
            }
        }
       
        // Add this term to result
        result += numerator / denominator;
    }
   
    return result;
}

// Read and process a single test case
function processTestCase(filename, caseNumber) {
    try {
        console.log(\n=== Processing Test Case ${caseNumber} ===);
       
        // Read JSON file
        const rawData = fs.readFileSync(filename, 'utf8');
        const jsonData = JSON.parse(rawData);
       
        // Parse the test case
        const { n, k, points } = parseTestCase(jsonData);
       
        console.log(n = ${n}, k = ${k});
        console.log(Total points available: ${points.length});
        console.log(Points needed for interpolation: ${k});
       
        // Display decoded points (first k points)
        console.log('\nDecoded points:');
        for (let i = 0; i < Math.min(k, points.length); i++) {
            const p = points[i];
            console.log(`  (${p.x}, ${p.y}) - decoded from '${p.value}' in base ${p.base}`);
        }
       
        // Calculate the secret using Lagrange interpolation
        const secret = lagrangeInterpolation(points, k);
       
        console.log(\nSecret (constant term) for Test Case ${caseNumber}: ${secret});
        return secret;
       
    } catch (error) {
        console.error(Error processing ${filename}:, error.message);
        return null;
    }
}

// Main function
function main() {
    console.log('Shamir\'s Secret Sharing - Finding Polynomial Constant Term');
    console.log('========================================================');
   
    // Test Case 1 data (embedded since we need to create the JSON file)
    const testCase1 = {
        "keys": {
            "n": 4,
            "k": 3
        },
        "1": {
            "base": "10",
            "value": "4"
        },
        "2": {
            "base": "2",
            "value": "111"
        },
        "3": {
            "base": "10",
            "value": "12"
        },
        "6": {
            "base": "4",
            "value": "213"
        }
    };
   
    // Test Case 2 data
    const testCase2 = {
        "keys": {
            "n": 10,
            "k": 7
        },
        "1": {
            "base": "7",
            "value": "420020006424065463"
        },
        "2": {
            "base": "7",
            "value": "10511630252064643035"
        },
        "3": {
            "base": "2",
            "value": "101010101001100101011100000001000111010010111101100100010"
        },
        "4": {
            "base": "8",
            "value": "31261003022226126015"
        },
        "5": {
            "base": "7",
            "value": "2564201006101516132035"
        },
        "6": {
            "base": "15",
            "value": "a3c97ed550c69484"
        },
        "7": {
            "base": "13",
            "value": "134b08c8739552a734"
        },
        "8": {
            "base": "10",
            "value": "23600283241050447333"
        },
        "9": {
            "base": "9",
            "value": "375870320616068547135"
        },
        "10": {
            "base": "6",
            "value": "30140555423010311322515333"
        }
    };
   
    // Create JSON files
    fs.writeFileSync('testcase1.json', JSON.stringify(testCase1, null, 2));
    fs.writeFileSync('testcase2.json', JSON.stringify(testCase2, null, 2));
   
    console.log('Created testcase1.json and testcase2.json files');
   
    // Process both test cases
    const secret1 = processTestCase('testcase1.json', 1);
    const secret2 = processTestCase('testcase2.json', 2);
   
    // Final results
    console.log('\n' + '='.repeat(50));
    console.log('FINAL RESULTS:');
    console.log('='.repeat(50));
    if (secret1 !== null) {
        console.log(Test Case 1 Secret: ${secret1});
    }
    if (secret2 !== null) {
        console.log(Test Case 2 Secret: ${secret2});
    }
   
    // Verification for Test Case 1 (manual check)
    console.log('\n=== Verification for Test Case 1 ===');
    console.log('Points: (1,4), (2,7), (3,12)');
    console.log('These should form a polynomial f(x) = ax² + bx + c');
    console.log('We found c (constant term) =', secret1);
   
    // Clean up
    try {
        fs.unlinkSync('testcase1.json');
        fs.unlinkSync('testcase2.json');
        console.log('\nCleaned up temporary JSON files');
    } catch (e) {
        // Ignore cleanup errors
    }
}

// Run the main function
if (require.main === module) {
    main();
}