Shamir's Secret Sharing - Finding Polynomial Constant Term
========================================================
Created testcase1.json and testcase2.json files

=== Processing Test Case 1 ===
n = 4, k = 3
Total points available: 4
Points needed for interpolation: 3

Decoded points:
  (1, 4) - decoded from '4' in base 10
  (2, 7) - decoded from '111' in base 2
  (3, 12) - decoded from '12' in base 10

Secret (constant term) for Test Case 1: 3

=== Processing Test Case 2 ===
n = 10, k = 7
Total points available: 10
Points needed for interpolation: 7

Decoded points:
  (1, 997181962423734) - decoded from '420020006424065463' in base 7
  (2, 12604393706117337) - decoded from '10511630252064643035' in base 7
  (3, 96038733063224098) - decoded from '101010101001100101011100000001000111010010111101100100010' in base 2
  (4, 456587805210487821) - decoded from '31261003022226126015' in base 8
  (5, 1591430178843774750) - decoded from '2564201006101516132035' in base 7
  (6, 4491108874584447649) - decoded from 'a3c97ed550c69484' in base 15
  (7, 10894929529973071002) - decoded from '134b08c8739552a734' in base 13

Secret (constant term) for Test Case 2: 271644355478965

==================================================
FINAL RESULTS:
==================================================
Test Case 1 Secret: 3
Test Case 2 Secret: 271644355478965

=== Verification for Test Case 1 ===
Points: (1,4), (2,7), (3,12)
These should form a polynomial f(x) = ax² + bx + c
We found c (constant term) = 3n
