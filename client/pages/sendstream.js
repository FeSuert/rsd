import Layout from "../components/layout";

const Sendstream = () => {
  return (
    <Layout>
      <div className="create-new-safe">
      <div className="grid-container">
          <div className="MuiGrid-item grid-item">
            <h2 className="title">Send stream</h2>
          </div>
          <div className="MuiGrid-item grid-item">
          <div className="card">
          <div className="progress-bar">
                <span className="linear-progress-bar">
                  <span className="progress-bar-fill"></span>
                </span>
          </div>
              <span className="card-title">
              Select a receiver
              </span>
              <div className="wallets">
                <form>
                  <div className="wallets-name">
                    <label>Receiver Wallet Address:</label>
                    <input type="text" placeholder='Public Address or ENS' />
                  </div>

                  <div className="mx-3 md:flex mb-6">
                  <div className="mt-10 md:w-1/2 px-3 mb-6 md:mb-0">                  
                        <label>Super Token</label>
                        <select
                          // id="super-token"
                          className="mt-2 bg-gray-50 border border-gray-300 text-gray-500 text-base focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option selected>Select a token</option>
                          <option value="US">ETHx</option>
                          <option value="CA">fUSDCx</option>
                          <option value="FR">fTUCDx</option>
                          <option value="DE">fDaIx</option>
                        </select>
                  </div>
                  
                    <div className="mt-10 md:w-1/2 px-3">
                    <div className="wallets-name">
                      <label>Flow Rate</label>
                      <input
                        className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        // id=""
                        type="text"
                        placeholder="0.0"
                      />                      
                      
                      <select
                        // id="flow-rate"
                        className="bg-gray-50 border border-gray-300 text-gray-500 text-base focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >                      
                        <option value="sec">/ second</option>
                        <option value="min">/ minute</option>
                        <option value="hour">/ hour</option>
                        <option value="day">/ day</option>
                        <option value="month">/ month</option>
                        <option value="year">/ year</option>
                      </select>
                      </div>
                    </div>
                  </div>

                  <hr className="divider" />
                  <div className="input-row">
                    <div className="button-container">
                      <button className="submit-button" type="submit">
                        Send stream
                      </button>
                    </div>
                  </div>
                </form>
              </div>
          
          
        </div>
        </div>
        </div>
      </div>

    </Layout>
  );
};

export default Sendstream;
