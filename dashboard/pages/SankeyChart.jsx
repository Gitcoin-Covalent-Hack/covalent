import { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import { useNetwork } from "wagmi";
import { COVALENT_KEY } from "../constants";
import { useStore } from "../store/useStore";
import API from "../utils/API";

const SankeyChart = ({}) => {
  const [transactions, setTransactions] = useState([]);
  const [chartOption, setChartOption] = useState();

  const [state, dispatch] = useStore();

  const { activeChain } = useNetwork();

  const fetchTxData = async (address, chainId) => {
    try {
      let response = await API.get(`/${chainId}/address/${address}/transactions_v2/?key=${COVALENT_KEY}&no-logs=false`);

      let txItems = response.data.data.items;
      // console.log("txItems: ", txItems);
      setTransactions(txItems);
    } catch (error) {}
  };

  useEffect(() => {
    // if (activeChain && state.address && activeChain.id > 0) {
    //   void fetchTxData(state.address, activeChain.id);
    // }

    if (activeChain && state.address && activeChain.id > 0) {
      void fetchTxData(state.address, activeChain.id);
    }
    if (activeChain && state.searchedAddress && activeChain.id > 0) {
      // check searchedAddress is a valid address
      if (state.searchedAddress.length == 42 || state.searchedAddress.includes(".eth")) {
        void fetchTxData(state.searchedAddress, activeChain.id);
      }
    }
  }, [state.address, state.searchedAddress, activeChain && activeChain.id]);

  useEffect(() => {
    // performe chart state update after fetching tx list items
    if (transactions.length > 0) {
      let nodes = [];
      let links = [];

      // // Create Nodes
      {
        transactions.map((transaction) =>
          nodes.push({
            name: transaction.from_address_label ? transaction.from_address_label : transaction.from_address,
          })
        );
      }
      {
        transactions.map((transaction) =>
          nodes.push({ name: transaction.to_address_label ? transaction.to_address_label : transaction.to_address })
        );
      }
      // setNodes(nodes);

      // // Create Links
      {
        transactions.map((transaction) =>
          links.push({
            source: transaction.from_address_label ? transaction.from_address_label : transaction.from_address,
            target: transaction.to_address_label ? transaction.to_address_label : transaction.to_address,
            value: parseInt(transaction.value_quote),
          })
        );
      }
      // setLinks(links);

      // // Unique Nodes
      const uniqueNodes = nodes.filter((v, i, a) => a.findIndex((v2) => ["name"].every((k) => v2[k] === v[k])) === i);

      // setUniqueNodes(uniqueNodes);

      // // Unique Links
      const uniqueLinks = links.filter(
        (v, i, a) => a.findIndex((v2) => ["source", "target", "value"].every((k) => v2[k] === v[k])) === i
      );
      // setUniqueLinkes(uniqueLinks);

      // // Only Transfers
      const transferLinks = uniqueLinks.filter(function (el) {
        return el.value > 0;
      });
      // setTransferLinks(transferLinks);

      // // Transfer Nodes
      const transferNodes = uniqueNodes.filter((array) =>
        transferLinks.some((filter) => filter.target === array.name || filter.source === array.name)
      );
      // setTransferNodes(transferNodes);

      const chartOption = {
        // title: {
        //   text: 'Transactions'
        // },
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
        },
        series: {
          type: "sankey",
          nodeWidth: 40,
          nodeGap: 20,
          nodeAlign: "justify",
          emphasis: {
            focus: "adjacency",
          },
          levels: [
            {
              depth: 1,
              itemStyle: {
                color: "#570DF8",
              },
            },
          ],
          nodeAlign: "right",
          data: [...transferNodes],
          links: [...transferLinks],
        },
      };

      setChartOption(chartOption);
    }
  }, [transactions.length]);

  const onEvents = {
    click: function (params) {
      window.open("https://etherscan.io/search?f=0&q=" + encodeURIComponent(params.name));
    },
  };

  console.log("chartOption: ", chartOption);
  return (
    <div>
      {chartOption !== undefined && (
        <div>
          <ReactEcharts
            // key={chartOption.series.type}
            option={chartOption}
            // style={{ height: "800px", width: "1500px" }}
            onEvents={onEvents}
          />
        </div>
      )}
    </div>
  );
};

export default SankeyChart;
