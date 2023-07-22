import { createAdminUser } from './create-admin';

const runSeeds = async () => {
  await createAdminUser();
};

runSeeds();
