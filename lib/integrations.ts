import nodemailer from 'nodemailer';
import { Client as NotionClient } from '@notionhq/client';
import type { BriefRecord } from '@/lib/schema';

export async function sendBriefEmail(record: BriefRecord) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.NOTIFY_EMAIL;

  if (!host || !user || !pass || !to) return;

  const transporter = nodemailer.createTransport({ host, port, secure: false, auth: { user, pass } });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || user,
    to,
    subject: `[Brief Generator] ${record.input.brandName} submission`,
    text: JSON.stringify(record, null, 2),
  });
}

export async function syncToNotion(record: BriefRecord) {
  const notionKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!notionKey || !databaseId) return;

  const notion = new NotionClient({ auth: notionKey });
  await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [{ text: { content: record.input.brandName } }],
      },
      Market: {
        rich_text: [{ text: { content: record.input.market } }],
      },
      Objective: {
        rich_text: [{ text: { content: record.input.objective } }],
      },
    },
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: `Generated Brief\n${JSON.stringify(record.generatedBrief, null, 2)}` } }],
        },
      },
    ],
  });
}

export async function syncToTrello(record: BriefRecord) {
  const key = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_TOKEN;
  const listId = process.env.TRELLO_LIST_ID;
  if (!key || !token || !listId) return;

  const params = new URLSearchParams({
    key,
    token,
    idList: listId,
    name: `${record.input.brandName} - Strategic Brief`,
    desc: `Summary: ${record.generatedBrief.objective}\n\n${JSON.stringify(record.generatedBrief, null, 2)}`,
  });

  await fetch(`https://api.trello.com/1/cards?${params.toString()}`, { method: 'POST' });
}

export async function runIntegrations(record: BriefRecord) {
  await Promise.allSettled([sendBriefEmail(record), syncToNotion(record), syncToTrello(record)]);
}
