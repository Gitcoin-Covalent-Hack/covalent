import { ethers } from "ethers";

const EventLogModal = ({ eventLogData, isOpen, setToggleModal }) => {
  const { log_events, tx_hash } = eventLogData;
  return (
    <>
      <input type="checkbox" id="my-modal" className="modal-toggle" checked={isOpen} onChange={() => null} />
      <div className="modal  w-full ">
        <div className="modal-box relative w-[100%]">
          <label
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => setToggleModal(!isOpen)}>
            ✕
          </label>

          <h3 className="font-bold text-lg">Event log : {tx_hash.slice(0, 4) + ".." + tx_hash.slice(-4)}</h3>
          <div className="my-2">
            {log_events.map(({ sender_address, sender_name, sender_logo_url, decoded, sender_address_label }) => (
              <>
                <div
                  tabIndex="0"
                  className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box m-2">
                  <div className="collapse-title text-xl font-medium flex justify-between ">
                    <div>
                      {sender_address_label ? sender_address_label : "N/A"} {"=>"}{" "}
                      <span className="badge badge-md bg-slate-400 border-0">
                        {sender_address.slice(0, 4) + ".." + sender_address.slice(-4)}
                      </span>
                    </div>
                    <div className="w-7">{sender_logo_url && <img src={sender_logo_url} alt="" />}</div>
                  </div>
                  {/* collapse content */}
                  <div className="collapse-content">
                    <div className="overflow-x-auto">
                      {decoded && (
                        <table className="table w-full">
                          <thead>
                            <tr>
                              <th>Type</th>
                              <th>Data</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Event Name</td>
                              <td>{decoded && decoded["name"]}</td>
                            </tr>

                            <tr>
                              <td>Signature</td>
                              <td className="flex flex-wrap">{decoded && decoded["signature"]}</td>
                            </tr>
                            {decoded &&
                              decoded["params"].map(({ name, value, type }, index) => {
                                console.log("value: ", type === "uint256", value);
                                return (
                                  <tr key={index}>
                                    <td>{name}</td>
                                    <td>
                                      {type === "uint256" && value !== null
                                        ? Number(ethers.utils.formatEther(value)).toFixed(2)
                                        : value}
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      )}

                      {!decoded && (
                        <>
                          <div className="alert alert-warning shadow-lg">No event data !!</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default EventLogModal;
