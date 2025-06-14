# Collaborative Form Filling System

Submitted by

- Name : Santhosh Paramasivam
- Register No : RA2211003050187
- Department : CSE
- College : SRM Institute of Science and Technology, Tiruchirappalli

## Tech Stack

### Node.js & Express.js

To accommodate tight deadlines, JavaScript with Node.js and Express.js was chosen for rapid prototyping and development.

### Supabase (PostgreSQL)

Supabase was used for database hosting and ORM support. PostgreSQL allows flexible schema design—such as arrays—which is ideal for storing dynamic form data.

### React.js

React’s component-based architecture enabled quick development of dynamic forms and UI elements, significantly reducing build time.

## Database Design

### Database Type Choice

Forms can contain a varying number of elements—each with unique types and placeholders or static text (e.g., a label or title).
Given this dynamic nature and scalability concerns, a NoSQL database would typically be ideal. However, the project requirements mandated SQL, so PostgreSQL was used.

### Database Schema Design

#### Admins And Users

Two tables were created for each, with a primary key, username and hashed_password.

The password hashed with SHA-256 is stored so that, in the event of a database leak, the user credentials are still not compromised.

This method is reliable and SHA-256 is cryptographically strong.

#### Forms and Form Item

A form is essentially a collection of input types (such as labels, title, text inputs) combined with the data displayed in them, such as the form's title, the label string of a username input.

A combination of the input types (as defined in the input-types enum) and a string form-value is a form item

So, each form item is linked to its form via the foreign key `form_id`

#### Accessing a form

Each form is linked to an admin via a foreign key, and has a `path` variable

This path variable can be used to query that form from the front-end path
