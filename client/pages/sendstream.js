import Layout from "../components/layout";

const Sendstream = () => {
  return (
    <Layout>
      <div>
        <div class="bg-white shadow-md rounded-[20px] px-8 pt-6 pb-8 mb-4 flex flex-col mx-auto mt-40">
          <div class="-mx-3 md:flex mb-6">
            <div class="md:w-full px-3">
              <label
                class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                for="grid-password"
              >
                Receiver Wallet Address
              </label>
              <input
                class="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                id="grid-password"
                type="password"
                placeholder="Public Address or ENS"
              />
            </div>
          </div>
          <div class="-mx-3 md:flex mb-6">
            <div class="md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                for="super-token"
                class="block mb-2 text-sm font-bold text-gray-900 dark:text-gray-400"
              >
                Super Token
              </label>
              <select
                id="super-token"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected>Select a token</option>
                <option value="US">ETHx</option>
                <option value="CA">fUSDCx</option>
                <option value="FR">fTUCDx</option>
                <option value="DE">fDaIx</option>
              </select>
            </div>
            <div class="md:w-1/2 px-3">
              <label
                for="flow-rate"
                class="block mb-2 text-sm font-bold text-gray-900 dark:text-gray-400"
              >
                Flow Rate
              </label>
              <input
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                // id="grid-last-name"
                type="text"
                placeholder="0.0"
              />
              <select
                id="flow-rate"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                {/* <option selected>/ second</option> */}
                <option value="sec">/ second</option>
                <option value="min">/ minute</option>
                <option value="hour">/ hour</option>
                <option value="day">/ day</option>
                <option value="month">/ month</option>
                <option value="year">/ year</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            data-mdb-ripple="true"
            data-mdb-ripple-color="light"
            class="flex px-6 py-2.5 bg-[#6671FFCC] text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Send stream
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Sendstream;