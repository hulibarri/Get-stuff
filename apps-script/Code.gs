// Card Ideas inbox: collects themes, stories and inside jokes for Cards Against Our Ulibarri Family.
const SHEET_NAME = 'Ideas';
const HEADERS = ['Time', 'From', 'Idea / theme', 'Who or what it\'s about', 'Spicy (adults only)', 'Used in cards'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};
    if (p.website) return out({ ok: true }); // spam bot filled the hidden field

    const idea = clean(p.idea, 1000);
    if (!idea) return out({ ok: false, error: 'empty' });

    const sheet = getSheet();
    sheet.appendRow([
      new Date(),
      clean(p.name, 40) || 'Anonymous',
      idea,
      clean(p.about, 100),
      p.spicy === 'yes' ? 'Yes' : 'No',
      false
    ]);
    sheet.getRange(sheet.getLastRow(), HEADERS.length).insertCheckboxes();
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

// Run once from the editor (pick "setup", click Run). Makes the sheet and logs its link.
function setup() {
  const ss = getSpreadsheet();
  const sheet = getSheet();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
  sheet.setColumnWidth(3, 420);
  sheet.getRange('C:C').setWrap(true);
  ss.getSheets().forEach(s => {
    if (s.getName() !== SHEET_NAME && s.getLastRow() === 0) ss.deleteSheet(s);
  });
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
