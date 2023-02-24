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
              <span className="card-title">
              History
              </span>
              <div className="wallets">
                <form>                  
                  <div>
                  Sent
                  </div>
                  <hr className="divider" />                
                  <div>
                  Received
                  </div>
                  <hr className="divider" />
                  <div>
                  Safe created
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
