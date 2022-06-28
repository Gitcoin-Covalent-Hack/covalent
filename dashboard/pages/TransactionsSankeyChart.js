import React from 'react';
import { useState } from 'react';
import { baseUrl, fetchApi } from '../utils/fetchApi';
import ReactEcharts from "echarts-for-react"; 

const TransactionsSankeyChart = ({ transactions } ) => {

  let nodes = [];
  let links = [];

  // Create Nodes
  {transactions.map((transaction) => nodes.push({name: transaction.from_address_label ? transaction.from_address_label : transaction.from_address}))}
  {transactions.map((transaction) => nodes.push({name: transaction.to_address_label ? transaction.to_address_label : transaction.to_address}))}

  // Create Links
  {transactions.map((transaction) => links.push({source: transaction.from_address_label ? transaction.from_address_label : transaction.from_address, target: transaction.to_address_label ? transaction.to_address_label : transaction.to_address, value: parseInt(transaction.value_quote)}))}

  // Unique Nodes
  const uniqueNodes = nodes.filter((v,i,a)=>a.findIndex(v2=>['name'].every(k=>v2[k] ===v[k]))===i)

  // Unique Links
  const uniqueLinks = links.filter((v,i,a)=>a.findIndex(v2=>['source','target','value'].every(k=>v2[k] ===v[k]))===i)
  
  // Only Transfers
  const transferLinks = uniqueLinks.filter(function (el) {return el.value > 0;});

  // Transfer Nodes
  const transferNodes = uniqueNodes.filter(array => transferLinks.some(filter => filter.target === array.name || filter.source === array.name));

  const option = {
    // title: {
    //   text: 'Transactions'
    // },
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: {
      type: 'sankey',
      nodeWidth: 40,
      nodeGap: 20,
      nodeAlign: 'justify',
      emphasis: {
        focus: 'adjacency'
      },
      levels: [
        {
          depth: 1,
          itemStyle: {
            color: '#570DF8'
          }
        }],
      nodeAlign: 'right',
      data: transferNodes,
      links: transferLinks
    }
  };

  const onEvents = {
    'click': function(params) {
      window.open(
        'https://etherscan.io/search?f=0&q=' + encodeURIComponent(params.name)
      );
    }
  }

  return (
  <div>
    <ReactEcharts option={option} style={{height: '800px', width: '1500px'}}  onEvents={onEvents}/>
  </div>
  ) 
}

export async function getServerSideProps( context ) {
  const address = context.query.address || 'vitalik.eth';
  const transactions = await fetchApi(`${baseUrl}/v1/1/address/${address}/transactions_v2/`);
  return {
    props: {
      transactions: transactions?.items,
    }
  }
}

export default TransactionsSankeyChart;
