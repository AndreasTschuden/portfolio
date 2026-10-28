'use client'

import { useState, type FormEvent } from 'react'

import type { Locale, Messages } from '@/i18n'

import { Reveal } from '../motion/Reveal'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const field =
  'w-full min-w-0 border-0 border-b border-ash bg-transparent pb-2.5 text-base font-medium text-black outline-none transition-colors duration-300 placeholder:text-ash placeholder:opacity-100 focus:border-navy'

/** Posts to the Payload `contact-submissions` collection. */
export function ContactForm({
  locale,
  note,
  t,
}: {
  locale: Locale
  note: string
  t: Messages['home']
}) {
  const [status, setStatus] = useState<Status>('idle')

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setStatus('sending')
    try {
      const res = await fetch('/api/contact-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const label = { idle: t.submit, sending: t.sending, sent: t.sent, error: t.error }[status]

  return (
    <form onSubmit={submit} className="ml-auto flex max-w-[666px] flex-[1_1_420px] flex-col gap-12">
      <Reveal
        as="p"
        className="m-0 text-[clamp(24px,2.4vw,34px)] leading-[1.38] font-medium text-black"
      >
        {t.formIntro}
        {note && (
          <>
            <br />
            {note}
          </>
        )}
      </Reveal>
      <Reveal delay={100} className="mt-[22px] grid grid-cols-2 gap-x-[25px] gap-y-12">
        <input
          name="firstName"
          required
          placeholder={t.firstName}
          aria-label={t.firstName}
          autoComplete="given-name"
          className={field}
        />
        <input
          name="lastName"
          required
          placeholder={t.lastName}
          aria-label={t.lastName}
          autoComplete="family-name"
          className={field}
        />
        <input
          name="email"
          type="email"
          required
          placeholder={t.email}
          aria-label={t.email}
          autoComplete="email"
          className={`col-span-full ${field}`}
        />
        <textarea
          name="message"
          rows={1}
          placeholder={t.message}
          aria-label={t.message}
          className={`col-span-full min-h-8 resize-y ${field}`}
        />
      </Reveal>
      <Reveal delay={200} className="self-start">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="h-[62px] w-[180px] cursor-pointer rounded-full border-0 bg-secondary text-base text-white transition-colors duration-300 hover:bg-navy disabled:cursor-wait"
          aria-live="polite"
        >
          {label}
        </button>
      </Reveal>
    </form>
  )
}
