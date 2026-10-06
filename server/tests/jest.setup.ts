afterAll(async () => {
  if (!process.env.DATABASE_URL) {
    return;
  }

  const { closeDb } = await import("../db/index");
  await closeDb();
});
