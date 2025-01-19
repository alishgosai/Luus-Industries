import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

async function cleanupNpm() {
  console.log('Starting npm cleanup process...');

  try {
    // Check if package-lock.json exists
    try {
      await fs.access('package-lock.json');
      await fs.unlink('package-lock.json');
      console.log('Deleted package-lock.json');
    } catch (error) {
      console.log('package-lock.json not found, skipping deletion');
    }

    // Check if node_modules directory exists
    try {
      await fs.access('node_modules');
      await fs.rm('node_modules', { recursive: true, force: true });
      console.log('Deleted node_modules directory');
    } catch (error) {
      console.log('node_modules directory not found, skipping deletion');
    }

    // Run npm install
    console.log('Running npm install...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('npm install completed successfully');

    console.log('Cleanup process completed successfully!');
  } catch (error) {
    console.error('An error occurred during the cleanup process:', error.message);
  }
}

cleanupNpm();