USE cashly;
ALTER TABLE support_tickets
  ADD COLUMN reply_text TEXT NULL,
  ADD COLUMN replied_at DATETIME NULL;
