import { Prisma, PrismaClient } from "@prisma/client";

import insertUsers from "./insert/insertUsers";
import insertTeams from "./insert/insertTeams";
import insertUsersOnTeams from "./insert/insertUsersOnTeams";
import insertProjects from "./insert/insertProjects";
import insertEyes from "./insert/insertEyes";
import insertEyeRecords from "./insert/insertEyeRecords";
import insertEyeRecordResult from "./insert/insertEyeRecordResult";
import insertEyeRecordAttachment from "./insert/insertEyeRecordAttachment";

const prisma = new PrismaClient();

const ctx = {};

async function main() {
  const tables = Prisma.dmmf.datamodel.models.map(
    (model) => model.dbName || model.name
  );

  for (const table of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM ${table};`);
  }

  await insertUsers(prisma, ctx);
  await insertTeams(prisma, ctx);
  await insertUsersOnTeams(prisma, ctx);
  await insertProjects(prisma, ctx);
  await insertEyes(prisma, ctx);
  await insertEyeRecords(prisma, ctx);
  await insertEyeRecordResult(prisma, ctx);
  await insertEyeRecordAttachment(prisma, ctx);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
