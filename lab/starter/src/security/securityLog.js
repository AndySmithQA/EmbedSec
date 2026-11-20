// Minimal security event log. In production this would ship to a SIEM.
// Never log secrets, tokens or full customer records here.

const events = [];

function logSecurityEvent(event) {
  const entry = { at: new Date().toISOString(), ...event };
  events.push(entry);
  if (process.env.NODE_ENV !== 'test' && !process.env.NODE_TEST_CONTEXT) {
    console.log('[security]', JSON.stringify(entry));
  }
}

function getSecurityEvents() {
  return events.slice();
}

function clearSecurityEvents() {
  events.length = 0;
}

module.exports = { logSecurityEvent, getSecurityEvents, clearSecurityEvents };
