import React from 'react';
import { baseUrl, fetchApi } from '../utils/fetchApi';
import Transaction from '../components/Transaction';

const Home = ({transactions } ) => {
  return (
    console.log("Data:", transactions)
  // <div>
  //     {/* {transactions.map((transaction) => <Transaction transaction={transaction} key={transaction.tx_hash}/>)} */}
  // </div>
  ) 
}

export async function getStaticProps() {
  const transactions = await fetchApi(`${baseUrl}/v1/1/address/lscorpion.eth/transactions_v2/`);
  return {
    props: {
      transactions: transactions?.items,
    }
  }
}

export default Home;
