-- #449 (decided in #404, point 7): the Verlauf names the address an e-mail went to, as it was at sending; documents
-- from before keep no address
ALTER TABLE documents ADD COLUMN recipient varchar(255);
