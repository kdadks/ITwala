import { createAdminUser } from '../src/utils/setupAdmin';

async function setup() {
  console.log('Setting up admin user...');
  await createAdminUser();
  console.log('Setup complete!');
}

setup().catch(console.error);
