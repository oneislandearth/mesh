// Import the testing module
import test from 'ava';

// Import the required math functions
import { pi } from 'lib/utils/math';

// Import the Angle class
import { Angle } from 'lib/geometry/utils/angle';

// Create a variable holder for the angle
let angle;

// Values match expected
test('Angles: values match', (result) => {

  // Create the angle
  angle = new Angle(pi);

  // Check the angle in radians
  result.is(angle.radians, pi);

  // Check the angle in degrees
  result.is(angle.degrees, 180);
});

// Angles from eval (degrees)
test('Angles: eval function (degrees)', (result) => {

  // Create the set of angles
  const angles = ['180 deg', '37.5°', '.5deg'].map(angle => Angle.eval(angle).degrees);

  // Create a set of expected values
  const expected = [180, 37.5, 0.5];

  // Iterate through each of the angles and check the values match
  for (const i in angles) result.is(angles[i], expected[i]);
});

// Angles from eval (radians)
test('Angles: eval function (radians)', (result) => {

  // Create the set of angles
  const angles = ['3.142 rad', '1'].map(angle => Angle.eval(angle).radians);

  // Create a set of expected values
  const expected = [3.142, 1];

  // Iterate through each of the angles and check the values match
  for (const i in angles) result.is(angles[i], expected[i]);
});


// Angles from eval (error)
test('Angles: eval function (error)', (result) => {
  
  // Throw an error for non-numeric values
  result.throws(() => Angle.eval('nothingNumberic'), 'Angle.eval expects "string" to contain digits within in the string');
});

// Angles addition
test('Angles: modification', (result) => {

  // Create an angle of 1 radian
  angle = new Angle(1);

  // Check that the value casts to a number correctly
  result.assert(angle == 1);
  result.is(angle.radians, 1);

  // Minus one radian from the angle
  angle.radians -= 1;

  // Check that math works correctly with radians
  result.assert(angle == 0);
  result.is(angle.radians, 0);

  // Add 180 degrees to the angle
  angle.degrees += 180;

  // Check that math works correctly with degrees
  result.assert(angle == pi);
  result.is(angle.radians, pi);
  result.is(angle.degrees, 180);
});