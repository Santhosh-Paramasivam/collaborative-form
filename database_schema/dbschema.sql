CREATE TYPE "form_elements" AS ENUM (
  'text_element',
  'text_input',
  'number_input_element',
  'dropdown_element'
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

CREATE TABLE "form_item" (
  "id" integer PRIMARY KEY,
  "form_element" form_elements,
  "form_value" varchar
);

CREATE TABLE "form" (
  "admin_id" integer FOREIGN KEY
  "id" integer PRIMARY KEY,
  "form_item_ids" integer FOREIGN KEY [],
  "form_response" varchar []
);
