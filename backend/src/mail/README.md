# Sending Emails with Sendgrid

This module hooks into the sendgrid API for sending emails. The sendgrid documentation is great
and [can be found here](https://docs.sendgrid.com/api-reference/how-to-use-the-sendgrid-v3-api/authentication).

At the moment the module assumes you will be utilizing Dynamic Templates built within your Sendgrid dashboard and
thereby expects a `templateId` to be supplied for each email type. These templates also need to ensure they correctly
use handlebars for any `dynamicTemplateData` you want them to display. This dynamic data can be things a person's name,
a logo, a url, etc.

The current mail service expects to pass the following items along as `dynamicTemplateData` :

### Invite Email

The email new users will receive when an org admin invites them to the product.

- Url to the invite specific signup page.
- Subject line for the email. This is here in case you would like to customize it based on a invited user's name or
  organization attribute.

### Welcome Email

The email a user receives after they sign up for a new account.

- Nothing expected at this time

### Password Reset Email

The email new users will receive when they request a password reset be sent to their email.

- Url to the reset specific page for their account.