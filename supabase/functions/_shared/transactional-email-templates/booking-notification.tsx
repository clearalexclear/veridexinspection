import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface BookingNotificationProps {
  productName?: string
  factoryLocation?: string
  quantity?: string | number
  inspectionDate?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  notes?: string
  accountType?: string
}

const BookingNotificationEmail = ({
  productName,
  factoryLocation,
  quantity,
  inspectionDate,
  contactName,
  contactEmail,
  contactPhone,
  notes,
  accountType,
}: BookingNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New inspection booking: {productName ?? 'Untitled'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Inspection Booking</Heading>
        <Text style={text}>A new inspection request was just submitted.</Text>

        <Section style={card}>
          <Row label="Product" value={productName} />
          <Row label="Factory Location" value={factoryLocation} />
          <Row label="Quantity" value={quantity?.toString()} />
          <Row label="Inspection Date" value={inspectionDate} />
          <Hr style={hr} />
          <Row label="Contact Name" value={contactName} />
          <Row label="Email" value={contactEmail} />
          <Row label="Phone" value={contactPhone} />
          <Row label="Account" value={accountType} />
          {notes ? (
            <>
              <Hr style={hr} />
              <Text style={label}>Notes</Text>
              <Text style={text}>{notes}</Text>
            </>
          ) : null}
        </Section>

        <Text style={footer}>Sent automatically from your inspection platform.</Text>
      </Container>
    </Body>
  </Html>
)

const Row = ({ label: l, value }: { label: string; value?: string }) => (
  <Text style={rowStyle}>
    <span style={label}>{l}: </span>
    <span>{value ?? '—'}</span>
  </Text>
)

export const template = {
  component: BookingNotificationEmail,
  subject: (d: Record<string, any>) =>
    `New inspection booking — ${d.productName ?? 'Untitled'}`,
  to: 'alexandre@softorgsarl.com',
  displayName: 'Booking notification (admin)',
  previewData: {
    productName: 'Stainless Steel Water Bottle 750ml',
    factoryLocation: 'Guangzhou, China',
    quantity: 5000,
    inspectionDate: '2026-06-01',
    contactName: 'John Smith',
    contactEmail: 'john@company.com',
    contactPhone: '+1 234 567 890',
    notes: 'Please verify packaging and labeling.',
    accountType: 'Guest',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0B1220', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#334155', lineHeight: '1.5', margin: '0 0 12px' }
const card = { backgroundColor: '#F5F7FB', borderRadius: '8px', padding: '20px', margin: '16px 0' }
const rowStyle = { fontSize: '14px', color: '#0B1220', margin: '6px 0' }
const label = { color: '#64748B', fontWeight: 600 }
const hr = { borderColor: '#E2E8F0', margin: '12px 0' }
const footer = { fontSize: '12px', color: '#94A3B8', margin: '24px 0 0' }
