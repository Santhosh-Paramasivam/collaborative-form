CREATE TYPE "input_type" AS ENUM (
  'text_label',
  'text_input',
  'number_input',
  'dropdown_input'
);

CREATE TABLE "admins" (
  "id" integer PRIMARY KEY,
  "username" varchar,
  "hashed_password" varchar
);

CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "username" varchar,
  "hashed_password" varchar
);

CREATE TABLE "form_items" (
  "id" integer PRIMARY KEY,
  "form_id" integer,
  "input_type" input_type,
  "form_item_value" varchar,
  "form_item_response" varchar,
  "form_item_user" integer
);

CREATE TABLE "forms" (
  "id" integer PRIMARY KEY,
  "admin_id" integer,
  "path" varchar
);

ALTER TABLE "form_items" ADD FOREIGN KEY ("form_id") REFERENCES "forms" ("id");

ALTER TABLE "form_items" ADD FOREIGN KEY ("form_item_user") REFERENCES "users" ("id");

ALTER TABLE "forms" ADD FOREIGN KEY ("admin_id") REFERENCES "admins" ("id");

