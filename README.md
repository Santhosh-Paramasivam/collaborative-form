# Collaborative Form Filling System

Submitted by

- Name : Santhosh Paramasivam
- Register No : RA2211003050187
- Department : CSE
- College : SRM Institute of Science and Technology, Tiruchirappalli

## Database Design

### Database Type Choice

A form can have any number of elements of different types, with different placeholder info or static text, such as in the case of a text element.

Since the data to be stored is dynamic, and scability is a primary concern, a NoSQL database would be the most suitable choice.

However, since that is prohibited by the project description, a PostGres SQL database was used

### Database Schema Design

#### Admins And Users

Two tables were created for each, with a primary key, username and hashed_password.

The password hashed with SHA-256 is stored so that, in the event of a database leak, the user credentials are still not compromised.

This method is reliable and SHA-256 is cryptographically strong.

#### Forms and Form Item

A form is essentially a collection of input types (such as labels, title, text inputs) combined with the data displayed in them, such as the form's title, the label string of a username input.

A combination of the input types (as defined in the form-elements enum) and a string form-value is a form item

#### Form Element

Every kind of input that the system allows is defined as a value in the form element enum. Each of these values can be linked to an html element in the front-end
