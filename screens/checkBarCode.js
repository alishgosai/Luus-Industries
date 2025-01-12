import { BarCodeScanner } from 'expo-barcode-scanner';

console.log('BarCodeScanner object:', BarCodeScanner);
console.log('BarCodeScanner.Constants:', BarCodeScanner.Constants);
console.log('BarCodeScanner.scanFromURLAsync:', BarCodeScanner.scanFromURLAsync);

if (BarCodeScanner && BarCodeScanner.Constants && BarCodeScanner.scanFromURLAsync) {
  console.log('BarCodeScanner module is available and correctly imported');
} else {
  console.log('There might be an issue with the BarCodeScanner module');
}

