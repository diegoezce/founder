import microsoft from './microsoft.json';

export const CASES = [
  microsoft,
  // Future cases — drop JSON files here and add to this array
  // import costco from './costco.json';
  // import amazon from './amazon.json';
  // import cocacola from './cocacola.json';
  // import nike from './nike.json';
  // import netflix from './netflix.json';
  // import ikea from './ikea.json';
  // import disney from './disney.json';
];

export const CASE_MENU = [
  { id: 'microsoft',  label: 'MICROSOFT',  available: true  },
  { id: 'costco',     label: 'COSTCO',     available: false },
  { id: 'amazon',     label: 'AMAZON',     available: false },
  { id: 'coca-cola',  label: 'COCA-COLA',  available: false },
  { id: 'nike',       label: 'NIKE',       available: false },
  { id: 'netflix',    label: 'NETFLIX',    available: false },
  { id: 'ikea',       label: 'IKEA',       available: false },
  { id: 'disney',     label: 'DISNEY',     available: false },
];

export function getCaseById(id) {
  return CASES.find(c => c.id === id) || null;
}
