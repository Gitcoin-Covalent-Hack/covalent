
import React from 'react';
import ReactDOM from 'react-dom';
import Link from 'next/link';

const Transaction = ({ transaction: { block_signed_at, block_height, tx_hash, tx_offset, successful, from_address, from_address_label, to_address, to_address_label, value, value_quote, gas_offered,  gas_spent, gas_price, fees_paid, gas_quote, gas_quote_rate, log_events } }) => (
  <div className="transaction">
  </div>
)

export default Transaction;