// utils/calculations.js - Utility functions for calculating balances and debts
export const calculateBalances = (transactions, participants) => {
    // Initialize balances for all participants
    const balances = {};
    participants.forEach(participant => {
      balances[participant] = 0;
    });
  
    // Process each transaction
    transactions.forEach(transaction => {
      const { paidBy, amount, participants: involved } = transaction;
      const sharePerPerson = amount / involved.length;
      
      // Credit the payer
      balances[paidBy] += amount;
      
      // Debit each participant
      involved.forEach(participant => {
        balances[participant] -= sharePerPerson;
      });
    });
  
    return balances;
  };
  
  export const getDebtPairs = (balances) => {
    const debtors = []; // people who owe money (negative balance)
    const creditors = []; // people who are owed money (positive balance)
  
    // Separate participants into debtors and creditors
    Object.entries(balances).forEach(([person, balance]) => {
      if (balance < 0) {
        debtors.push({ person, amount: Math.abs(balance) });
      } else if (balance > 0) {
        creditors.push({ person, amount: balance });
      }
    });
  
    // Sort both arrays by amount (largest first)
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);
  
    const debtPairs = [];
  
    // Match debtors to creditors
    let debtorIndex = 0;
    let creditorIndex = 0;
  
    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
      const debtor = debtors[debtorIndex];
      const creditor = creditors[creditorIndex];
      
      // Calculate the amount to settle
      const settleAmount = Math.min(debtor.amount, creditor.amount);
      
      // Round to two decimal places to avoid floating point issues
      const roundedAmount = Math.round(settleAmount * 100) / 100;
      
      if (roundedAmount > 0) {
        debtPairs.push({
          from: debtor.person,
          to: creditor.person,
          amount: roundedAmount
        });
      }
  
      // Update remaining amounts
      debtor.amount -= settleAmount;
      creditor.amount -= settleAmount;
  
      // Move to next debtor/creditor if fully settled
      if (debtor.amount < 0.01) debtorIndex++;
      if (creditor.amount < 0.01) creditorIndex++;
    }
  
    return debtPairs;
  };