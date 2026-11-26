// Card Ideas inbox: collects themes, stories and inside jokes for Cards Against Our Ulibarri Family.
const SHEET_NAME = 'Ideas';
const HEADERS = ['Time', 'Idea / theme', 'Spicy (adults only)', 'Used in cards'];

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
      idea,
      p.spicy === 'yes' ? 'Yes' : 'No',
      false
    ]);
    sheet.getRange(sheet.getLastRow(), HEADERS.length).insertCheckboxes();
    notify(idea, p.spicy === 'yes', sheet.getParent().getUrl());
    return out({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// Emails you each new idea. Gmail on your phone turns this into a notification.
function notify(idea, spicy, sheetUrl) {
  try {
    const short = idea.length > 60 ? idea.slice(0, 57) + '...' : idea;
    MailApp.sendEmail({
      to: Session.getEffectiveUser().getEmail(),
      subject: (spicy ? '🌶️ ' : '') + 'New card idea: ' + short,
      body: idea + '\n\n' + (spicy ? 'Marked spicy (adults only).\n\n' : '') + 'All ideas: ' + sheetUrl
    });
  } catch (err) {
    console.error('Email failed: ' + err);
  }
}

// Run once from the editor to allow email and send yourself a test.
function testEmail() {
  notify('This is a test. New ideas will show up like this.', false, getSpreadsheet().getUrl());
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
  // Drop the old "From" and "About" columns if this sheet was made by an earlier version.
  const head = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  if (head[1] === 'From') { sheet.deleteColumn(4); sheet.deleteColumn(2); }
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
  sheet.setColumnWidth(2, 460);
  sheet.getRange('B:B').setWrap(true);
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
