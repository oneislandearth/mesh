// Function for returning an array of numbers from 0 to n

const range = (n) => {
  const array = new Array(n);
  for (let i = 0; i < (n + 1); i++) {
    array[i] = i;
  }

  return array;
};