import Layout from "../components/layout";

const Dashboard = () => {
  return (
    <Layout>
      <div className="create-new-safe">
      <div className="grid-container">
          <div className="MuiGrid-item grid-item">
            <h2 className="title">SuperGnosis Transactions</h2>
          </div>
          <div className="MuiGrid-item grid-item">
          <div className="card">
          <div className="progress-bar">
                <span className="linear-progress-bar">
                  <span className="progress-bar-fill"></span>
                </span>
          </div>
              <span className="card-title">
              Queue
              </span>
              <div className="wallets">
                <form>                  
                  <div>
                  Queued transactions will appear here
                  </div>

                  <hr className="divider" />
                  <div>
                    
                  </div>
                </form>
              </div>
              {/* <span className="card-title">
              History
              </span> */}
              <div className="wallets">
                <form>
             
<div class="bg-white pb-4 px-4 rounded-md w-full">
      <div class="flex justify-between w-full pt-6 ">
      <span className="card-title">
              History
              </span>
      </div>
  <div class="w-full flex justify-end px-2 mt-2">
        <div class="w-full sm:w-64 inline-block relative ">   
          <div class="pointer-events-none absolute pl-3 inset-y-0 left-0 flex items-center px-2 text-gray-300">          
          </div>
        </div>
      </div>
    <div class="overflow-x-auto mt-6">
      <table class="table-auto border-collapse w-full">
        <thead>
          <tr class="rounded-lg text-sm font-medium text-gray-700 text-left">
            <th class="px-4 py-2 bg-gray-200 " >Sent</th>
            <th class="px-4 py-2 "></th>
            <th class="px-4 py-2 "></th>
            <th class="px-4 py-2 "></th>
          </tr>
        </thead>
        <tbody class="text-sm font-normal text-gray-700">
          <tr class="hover:bg-gray-100 border-b border-gray-200 py-10">
            <td class="px-4 py-4">0x...</td>
            <td class="px-4 py-4">-0.1 GOR</td>
            <td class="px-4 py-4">4:02 AM</td>
            <td class="px-4 py-4">Success</td>
          </tr>
          <tr class="hover:bg-gray-100 border-b border-gray-200 py-4">
            <td class="px-4 py-4 flex items-center"> 
            0x...
            
             </td>
            <td class="px-4 py-4">0.1 GOR</td>
            <td class="px-4 py-4">3:58 AM</td>
            <td class="px-4 py-4">Success</td>

          </tr>
          
        </tbody>
      </table>
    </div>
  	 <div id="pagination" class="w-full flex justify-center border-t border-gray-100 pt-4 items-center">
        
        <svg class="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g opacity="0.4">
<path fill-rule="evenodd" clip-rule="evenodd" d="M9 12C9 12.2652 9.10536 12.5196 9.29289 12.7071L13.2929 16.7072C13.6834 17.0977 14.3166 17.0977 14.7071 16.7072C15.0977 16.3167 15.0977 15.6835 14.7071 15.293L11.4142 12L14.7071 8.70712C15.0977 8.31659 15.0977 7.68343 14.7071 7.29289C14.3166 6.90237 13.6834 6.90237 13.2929 7.29289L9.29289 11.2929C9.10536 11.4804 9 11.7348 9 12Z" fill="#2C2C2C"/>
</g>
</svg>

        <p class="leading-relaxed cursor-pointer mx-2 text-blue-600 hover:text-blue-600 text-sm">1</p>
        <p class="leading-relaxed cursor-pointer mx-2 text-sm hover:text-blue-600" >2</p>
        <p class="leading-relaxed cursor-pointer mx-2 text-sm hover:text-blue-600"> 3 </p>
        <p class="leading-relaxed cursor-pointer mx-2 text-sm hover:text-blue-600"> 4 </p>
        <svg class="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M15 12C15 11.7348 14.8946 11.4804 14.7071 11.2929L10.7071 7.2929C10.3166 6.9024 9.6834 6.9024 9.2929 7.2929C8.9024 7.6834 8.9024 8.3166 9.2929 8.7071L12.5858 12L9.2929 15.2929C8.9024 15.6834 8.9024 16.3166 9.2929 16.7071C9.6834 17.0976 10.3166 17.0976 10.7071 16.7071L14.7071 12.7071C14.8946 12.5196 15 12.2652 15 12Z" fill="#18A0FB"/>
</svg>

      </div>
      <div class="overflow-x-auto mt-6">
      <table class="table-auto border-collapse w-full">
        <thead>
          <tr class="rounded-lg text-sm font-medium text-gray-700 text-left">
            <th class="px-4 py-2 bg-gray-200 " >Received</th>
            <th class="px-4 py-2 "></th>
            <th class="px-4 py-2 "></th>
            <th class="px-4 py-2 "></th>
          </tr>
        </thead>
        <tbody class="text-sm font-normal text-gray-700">
          <tr class="hover:bg-gray-100 border-b border-gray-200 py-10">
            <td class="px-4 py-4">0x...</td>
            <td class="px-4 py-4">-0.1 GOR</td>
            <td class="px-4 py-4">4:02 AM</td>
            <td class="px-4 py-4">Success</td>
          </tr>
          <tr class="hover:bg-gray-100 border-b border-gray-200 py-4">
            <td class="px-4 py-4 flex items-center"> 
            0x...
            
             </td>
            <td class="px-4 py-4">0.1 GOR</td>
            <td class="px-4 py-4">3:58 AM</td>
            <td class="px-4 py-4">Success</td>

          </tr>
          
        </tbody>
      </table>
    </div>
    <div id="pagination" class="w-full flex justify-center border-t border-gray-100 pt-4 items-center">
        
        <svg class="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g opacity="0.4">
<path fill-rule="evenodd" clip-rule="evenodd" d="M9 12C9 12.2652 9.10536 12.5196 9.29289 12.7071L13.2929 16.7072C13.6834 17.0977 14.3166 17.0977 14.7071 16.7072C15.0977 16.3167 15.0977 15.6835 14.7071 15.293L11.4142 12L14.7071 8.70712C15.0977 8.31659 15.0977 7.68343 14.7071 7.29289C14.3166 6.90237 13.6834 6.90237 13.2929 7.29289L9.29289 11.2929C9.10536 11.4804 9 11.7348 9 12Z" fill="#2C2C2C"/>
</g>
</svg>

        <p class="leading-relaxed cursor-pointer mx-2 text-blue-600 hover:text-blue-600 text-sm">1</p>
        <p class="leading-relaxed cursor-pointer mx-2 text-sm hover:text-blue-600" >2</p>
        <p class="leading-relaxed cursor-pointer mx-2 text-sm hover:text-blue-600"> 3 </p>
        <p class="leading-relaxed cursor-pointer mx-2 text-sm hover:text-blue-600"> 4 </p>
        <svg class="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M15 12C15 11.7348 14.8946 11.4804 14.7071 11.2929L10.7071 7.2929C10.3166 6.9024 9.6834 6.9024 9.2929 7.2929C8.9024 7.6834 8.9024 8.3166 9.2929 8.7071L12.5858 12L9.2929 15.2929C8.9024 15.6834 8.9024 16.3166 9.2929 16.7071C9.6834 17.0976 10.3166 17.0976 10.7071 16.7071L14.7071 12.7071C14.8946 12.5196 15 12.2652 15 12Z" fill="#18A0FB"/>
</svg>
      </div>
      <div class="overflow-x-auto mt-6">
      <table class="table-auto border-collapse w-full">
        <thead>
          <tr class="rounded-lg text-sm font-medium text-gray-700 text-left">
            <th class="px-4 py-2 bg-gray-200 " >Safe created</th>
            <th class="px-4 py-2 "></th>
            <th class="px-4 py-2 "></th>
            <th class="px-4 py-2 "></th>
          </tr>
        </thead>
        <tbody class="text-sm font-normal text-gray-700">
          <tr class="hover:bg-gray-100 border-b border-gray-200 py-10">
            <td class="px-4 py-4">Safe created by</td>
            <td class="px-4 py-4">0x...</td>
            <td class="px-4 py-4">3:32 AM</td>
            <td class="px-4 py-4">Success</td>
          </tr>
          <tr class="hover:bg-gray-100 border-b border-gray-200 py-4">
          <td class="px-4 py-4">Safe created by</td>
            <td class="px-4 py-4">0x...</td>
            <td class="px-4 py-4">1:41 PM</td>
            <td class="px-4 py-4">Success</td>
          </tr>
          
        </tbody>
      </table>
    </div>
    </div>                 
                  {/* <hr className="divider" /> */}
                  <div id="pagination" class="w-full flex justify-center border-t border-gray-100 pt-4 items-center">
        
        <svg class="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g opacity="0.4">
<path fill-rule="evenodd" clip-rule="evenodd" d="M9 12C9 12.2652 9.10536 12.5196 9.29289 12.7071L13.2929 16.7072C13.6834 17.0977 14.3166 17.0977 14.7071 16.7072C15.0977 16.3167 15.0977 15.6835 14.7071 15.293L11.4142 12L14.7071 8.70712C15.0977 8.31659 15.0977 7.68343 14.7071 7.29289C14.3166 6.90237 13.6834 6.90237 13.2929 7.29289L9.29289 11.2929C9.10536 11.4804 9 11.7348 9 12Z" fill="#2C2C2C"/>
</g>
</svg>

        <p class="leading-relaxed cursor-pointer mx-2 text-blue-600 hover:text-blue-600 text-sm">1</p>
        <p class="leading-relaxed cursor-pointer mx-2 text-sm hover:text-blue-600" >2</p>
        <p class="leading-relaxed cursor-pointer mx-2 text-sm hover:text-blue-600"> 3 </p>
        <p class="leading-relaxed cursor-pointer mx-2 text-sm hover:text-blue-600"> 4 </p>
        <svg class="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M15 12C15 11.7348 14.8946 11.4804 14.7071 11.2929L10.7071 7.2929C10.3166 6.9024 9.6834 6.9024 9.2929 7.2929C8.9024 7.6834 8.9024 8.3166 9.2929 8.7071L12.5858 12L9.2929 15.2929C8.9024 15.6834 8.9024 16.3166 9.2929 16.7071C9.6834 17.0976 10.3166 17.0976 10.7071 16.7071L14.7071 12.7071C14.8946 12.5196 15 12.2652 15 12Z" fill="#18A0FB"/>
</svg>
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

export default Dashboard;
