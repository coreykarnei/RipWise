// Balances.js - Detailed breakdown of who owes whom
import React from 'react';
import './Balances.css';

const Balances = ({ balances, debtPairs, participants }) => {
  const isAllSettled = debtPairs.length === 0;

  return (
    <div className="balances-container">
      <div className="net-balances">
        <h3>Net Balances</h3>
        <ul className="balance-list">
          {Object.entries(balances).map(([person, amount]) => (
            <li key={person} className={amount < 0 ? 'negative' : amount > 0 ? 'positive' : 'neutral'}>
              <div className="balance-person">{person}</div>
              <div className="balance-amount">
                {amount < 0 ? '-' : '+'} ${Math.abs(amount).toFixed(2)}
              </div>
              <div className="balance-status">
                {amount < 0 ? 'owes money' : amount > 0 ? 'is owed money' : 'all settled'}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="debt-resolution">
        <h3>Debt Resolution</h3>
        {isAllSettled ? (
          <p className="all-settled">All expenses are settled up! 🎉</p>
        ) : (
          <ul className="debt-pairs">
            {debtPairs.map((debt, index) => (
              <li key={index} className="debt-item">
                <span className="debtor">{debt.from}</span>
                <div className="debt-arrow">
                  owes <span className="amount">${debt.amount.toFixed(2)}</span> to
                </div>
                <span className="creditor">{debt.to}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Balances;
