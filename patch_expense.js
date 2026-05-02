const fs = require('fs');
const file = 'app/(tabs)/journeys/[tripId]/expense.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix reduce for total group spend
content = content.replace(
  'expenses.reduce((sum, e) => sum + (e.amount || 0), 0)',
  'expenses.reduce((sum, e) => sum + (e.amount_pkr || 0), 0)'
);

// Fix your_balance
content = content.replace(
  'ledger?.your_balance ?? 0 > 0',
  'ledger?.user_balances?.[trip?.participants?.[0]?.user_id] ?? 0 > 0'
);
content = content.replace(
  'Math.abs(ledger?.your_balance || 0)',
  'Math.abs(ledger?.user_balances?.[trip?.participants?.[0]?.user_id] || 0)'
);

// Fix total_amount
content = content.replace(
  'Math.abs(ledger.total_amount || 0)',
  'Math.abs(ledger.total_group_spend || 0)'
);

// Fix category and amount
content = content.replace(
  'CATEGORY_ICON[item.category] ?? "receipt-outline"',
  'CATEGORY_ICON[item.category || "Other"] ?? "receipt-outline"'
);

content = content.replace(
  '<Text style={styles.expenseName}>{item.description}</Text>',
  '<Text style={styles.expenseName}>{item.category || "Other Expense"}</Text>'
);

content = content.replace(
  'Added on {new Date(item.created_at).toLocaleDateString()}',
  'Added on {item.expense_date || "Unknown"}'
);

content = content.replace(
  'item.amount.toLocaleString()',
  '(item.amount_pkr || 0).toLocaleString()'
);

content = content.replace(
  'item.split_with?.length || 1',
  'item.split_method || "Equal"'
);

fs.writeFileSync(file, content);
