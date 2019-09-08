// Import the testing module
import test from 'ava';

// Import the Angle class
import { Angle } from 'lib/geometry/utils/angle';

// Values match expected
test('Angles: values match', (result) => {

  // Create the angle
  const angle = new Angle(Math.PI);

  // Check the angle in radians
  result.is(angle.radians.toFixed(3), Math.PI.toFixed(3));

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


// Angles from eval (error
test('Angles: eval function (error)', (result) => {
  
  // Throw an error for non-numeric values
  result.throws(() => Angle.eval('nothingNumberic'), 'Angle.eval expects "string" to contain digits within in the string');
});