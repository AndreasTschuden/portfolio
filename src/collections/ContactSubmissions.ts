import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

const notifyOwner: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  // TODO: No email adapter is configured yet. Install @payloadcms/email-resend,
  // register it as `email` in payload.config.ts (RESEND_API_KEY / RESEND_FROM_EMAIL),
  // then send the notification here:
  //
  // await req.payload.sendEmail({
  //   to: process.env.CONTACT_TO_EMAIL,
  //   replyTo: doc.email,
  //   subject: `New contact message from ${doc.firstName} ${doc.lastName}`,
  //   text: doc.message ?? '',
  // })
  req.payload.logger.info(`New contact submission from ${doc.email}`)

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
        { name: 'firstName', type: 'text', required: true },
        { name: 'lastName', type: 'text', required: true },
      ],
    },
    { name: 'email', type: 'email', required: true },
    { name: 'message', type: 'textarea' },
    { name: 'locale', type: 'text', admin: { readOnly: true } },
  ],
}
