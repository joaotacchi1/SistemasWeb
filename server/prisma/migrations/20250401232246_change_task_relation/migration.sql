-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "deadline" DATETIME NOT NULL,
    "assignedTo" TEXT NOT NULL,
    "observation" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'to_do',
    "userUsername" TEXT NOT NULL,
    CONSTRAINT "Task_userUsername_fkey" FOREIGN KEY ("userUsername") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("assignedTo", "deadline", "description", "id", "observation", "status", "userUsername") SELECT "assignedTo", "deadline", "description", "id", "observation", "status", "userUsername" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
