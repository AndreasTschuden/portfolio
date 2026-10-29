import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

const notifyOwner: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  req.payload.logger.info(`New contact submission from ${doc.email}`)

  const to = process.env.CONTACT_TO_EMAIL
  if (!to) return doc

  // The submission is already saved; a failed email must not turn it into an error for the visitor.
  try {
    await req.payload.sendEmail({
      to,
      replyTo: doc.email,
      subject: `New contact message from ${doc.firstName} ${doc.lastName}`.replace(/[\r\n]+/g, ' '),
      text: [
        `${doc.firstName} ${doc.lastName} <${doc.email}>`,
        doc.locale ? `Language: ${doc.locale}` : null,
        '',
        doc.message ?? '',
      ]
        .filter((line) => line !== null)
        .join('\n'),
    })
  } catch (err) {
    req.payload.logger.error({ err, msg: 'Could not send contact notification' })
  }

  return doc
}

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'email', 'createdAt'],
    group: 'Inbox',
  },
  defaultSort: '-createdAt',
  timestamps: true,
  access: {
    create: anyone,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [notifyOwner],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'firstName', type: 'text', required: true, maxLength: 100 },
        { name: 'lastName', type: 'text', required: true, maxLength: 100 },
      ],
    },
    { name: 'email', type: 'email', required: true },
    { name: 'message', type: 'textarea', maxLength: 5000 },
    { name: 'locale', type: 'text', maxLength: 10, admin: { readOnly: true } },
  ],
}
