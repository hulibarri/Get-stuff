// Card Ideas inbox — paste this into Extensions > Apps Script of your Google Sheet.
const SHEET_NAME = 'Ideas';
const HEADERS = ['Time', 'From', 'Type', 'Card', 'Spicy (adults only)', 'Approved'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};
    if (p.website) return out({ ok: true }); // spam bot filled the hidden field

    const text = clean(p.text, 300);
    if (!text) return out({ ok: false, error: 'empty' });

    const sheet = getSheet();
    sheet.appendRow([
      new Date(),
      clean(p.name, 40) || 'Anonymous',
      p.type === 'black' ? 'Black (prompt)' : 'White (answer)',
      text,
      p.spicy === 'yes' ? 'Yes' : 'No',
      false
    ]);
    sheet.getRange(sheet.getLastRow(), 6).insertCheckboxes();
    return out({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return out({ ok: true, message: 'Card ideas inbox is running.' });
}

// Works whether the script lives inside a Sheet or on its own at script.google.com.
// On its own, it creates a "Card Ideas" spreadsheet in your Google Drive the first time.
function getSpreadsheet() {
  const bound = SpreadsheetApp.getActiveSpreadsheet();
  if (bound) return bound;
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('SHEET_ID');
  if (id) return SpreadsheetApp.openById(id);
  const ss = SpreadsheetApp.create('Card Ideas');
  props.setProperty('SHEET_ID', ss.getId());
  return ss;
}

// Run this once from the editor (select "setup", tap Run). It makes the sheet and logs its link.
function setup() {
  const ss = getSpreadsheet();
  getSheet();
  const first = ss.getSheets()[0];
  if (first.getName() !== SHEET_NAME && first.getLastRow() === 0) ss.deleteSheet(first);
  Logger.log('Your Card Ideas sheet: ' + ss.getUrl());
}

function getSheet() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

// Trim, limit length, and stop text like "=SUM(...)" from becoming a formula.
function clean(value, max) {
  let s = String(value || '').trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
