-- CreateTable
CREATE TABLE "report_upload" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "csv_report_id" TEXT NOT NULL,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "payroll_data" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "report_upload_id" INTEGER NOT NULL,
    "pay_date" TEXT NOT NULL,
    "hours_worked" REAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "job_group" TEXT NOT NULL,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" DATETIME NOT NULL,
    CONSTRAINT "payroll_data_report_upload_id_fkey" FOREIGN KEY ("report_upload_id") REFERENCES "report_upload" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "report_data" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "report_upload_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "pay_period" TEXT NOT NULL,
    "amount_paid" REAL NOT NULL,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" DATETIME NOT NULL,
    CONSTRAINT "report_data_report_upload_id_fkey" FOREIGN KEY ("report_upload_id") REFERENCES "report_upload" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "report_upload_csv_report_id_key" ON "report_upload"("csv_report_id");
