// Explicit allow-lists of customer fields per use case.
// Never serialise a whole customer record: internalNotes, riskScore and
// paymentCardToken must not leave the service.

const CUSTOMER_SUMMARY_FIELDS = Object.freeze(['id', 'name', 'email', 'company', 'plan']);

const CUSTOMER_DETAIL_FIELDS = Object.freeze([
  'id',
  'name',
  'email',
  'phone',
  'company',
  'plan',
  'createdAt',
]);

function pick(record, fields) {
  return Object.fromEntries(fields.map((f) => [f, record[f]]));
}

function toCustomerSummary(customer) {
  return pick(customer, CUSTOMER_SUMMARY_FIELDS);
}

function toCustomerDetail(customer) {
  return pick(customer, CUSTOMER_DETAIL_FIELDS);
}

module.exports = {
  CUSTOMER_SUMMARY_FIELDS,
  CUSTOMER_DETAIL_FIELDS,
  pick,
  toCustomerSummary,
  toCustomerDetail,
};
