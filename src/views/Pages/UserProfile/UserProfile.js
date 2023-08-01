import React, { Component } from "react";
import axios from "axios";
import { Col, Row } from "reactstrap";
import { Tabs, Descriptions, Table } from "antd";
import "antd/dist/antd.css";

const { TabPane } = Tabs;

class UserProfile extends Component {
  state = {
    userName: "",
    userEmail: "",
    userAddress: "",
    zipCode: "",
    willingToTravel:"",
    userTelephone:"",
    userWalletBalance:"",
    sentTransactionsData: null,
    receivedTransactionsData: null

  }
  componentDidMount() {
    this.getUserDetails();
    this.getUserTransactionsDetails();
    this.getUser();
  }
  getUser() {
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) {
      this.props.history.push('/login');
    }
    
  }
  
  getUserDetails() {
    axios
      .get(
        `https://staging-seesaw.herokuapp.com/api/user/${this.props.match.params.id}`,
      )
      .then(res => {
        this.setState({userWalletBalance : `$${res.data.wallet_balance.wallet_balance}`})
        let userObject = res.data.user[0];
        this.setState({
          userName: userObject.name,
          userEmail: userObject.email,
          userAddress: userObject.geo_address,
          zipCode: userObject.zip_code,
          willingToTravel: `${userObject.willing_to_travel} km`,
          userTelephone: userObject.phone
        })
      });

  }
  getUserTransactionsDetails() {
    axios
      .get(
        `https://staging-seesaw.herokuapp.com/api/users_transaction_detail/${this.props.match.params.id}`,
      )
      .then(res => {
        let sentTransactions = res.data.data.sent_money;
        let receivedTransactions = res.data.data.receive_money;
        let sentTransactionsData = [];
        let receivedTransactionsData = [];
        sentTransactions.map((item,index) => {
          let sentTransactionObject = {};
          sentTransactionObject.key = index + 1;
          sentTransactionObject.id = item.id;
          sentTransactionObject.receiver_name = item.send_money_to_user.name;
          sentTransactionObject.amount = `$${item.amount_paid}`;
          sentTransactionObject.created_at = item.created_at;
          sentTransactionsData.push(sentTransactionObject);
        })
        receivedTransactions.map((item,index) => {
          let receivedTransactionObject = {};
          receivedTransactionObject.key = index + 1;
          receivedTransactionObject.id = item.id;
          receivedTransactionObject.sender_name = item.receive_money_from_user.name;
          receivedTransactionObject.amount = `$${item.amount_paid}`;
          receivedTransactionObject.created_at = item.created_at;
          receivedTransactionsData.push(receivedTransactionObject);
        })
        this.setState({
          sentTransactionsData : sentTransactionsData,
          receivedTransactionsData : receivedTransactionsData
        })
      });

  }
  render() {
    function callback(key) {}
    const categoryColumns = [
      {
        title: "Name",
        dataIndex: "name"
      },
      {
        title: "Created At",
        dataIndex: "created_at"
      }
    ];
    const locationColumns = [
      {
        title: "Name",
        dataIndex: "name"
      },
      {
        title: "Type",
        dataIndex: "type"
      },
      {
        title: "Created At",
        dataIndex: "created_at"
      }
    ];
    const SentTransactionsColumns = [
      {
        title: "Transaction Id",
        dataIndex: "id"
      },
      {
        title: "Receiver Name",
        dataIndex: "receiver_name"
      },
      {
        title: "Amount",
        dataIndex: "amount"
      },
      {
        title: "Created At",
        dataIndex: "created_at"
      }
    ];

    const ReceivedTransactionsColumns = [
      {
        title: "Transaction Id",
        dataIndex: "id"
      },
      {
        title: "Sender Name",
        dataIndex: "sender_name"
      },
      {
        title: "Amount",
        dataIndex: "amount"
      },
      {
        title: "Created At",
        dataIndex: "created_at"
      }
    ];
    const locationData = [
      {
        key: "1",
        name: "Location 74560",
        type: "users",
        created_at: "2019-12-02"
      },
      {
        key: "2",
        name: "Location 63407",
        type: "users",
        created_at: "2019-12-02"
      },
      {
        key: "3",
        name: "Location 47628",
        type: "users",
        created_at: "2019-12-02"
      }
    ];

    const categoryData = [
      {
        key: "1",
        name: "Services Category 66748",
        created_at: "2019-12-02"
      },
      {
        key: "2",
        name: "Services Category 66745",
        created_at: "2019-12-02"
      },
      {
        key: "3",
        name: "Services Category 66742",
        created_at: "2019-12-02"
      }
    ];

    

    return (
      <div>
        <Row>
          <Col md="12" lg="12" xl="12">
            <Row>
              <Col md="8" lg="8" xl="8">
                <div className="tabs-container">
                  <Tabs defaultActiveKey="1" onChange={callback}>
                    <TabPane tab="Basic" key="1">
                      <div className="basic-tab">
                        <Descriptions>
                          <Descriptions.Item label="Telephone">
                            {this.state.userTelephone}
                          </Descriptions.Item>
                          <Descriptions.Item label="Zip Code">
                            {this.state.zipCode}
                          </Descriptions.Item>
                          <Descriptions.Item label="Willing To Travel">
                            {this.state.willingToTravel}
                          </Descriptions.Item>
                          <Descriptions.Item label="Wallet Balance">
                            {this.state.userWalletBalance}
                          </Descriptions.Item>
                          <Descriptions.Item label="Address">
                            {this.state.userAddress}
                          </Descriptions.Item>
                        </Descriptions>
                      </div>
                    </TabPane>
                    <TabPane tab="Categories" key="2">
                      <Table
                        columns={categoryColumns}
                        dataSource={categoryData}
                        size="small"
                        pagination={false}
                      />
                    </TabPane>
                    <TabPane tab="Locations" key="3">
                      <Table
                        columns={locationColumns}
                        dataSource={locationData}
                        size="small"
                        pagination={false}
                      />
                    </TabPane>
                    <TabPane tab="Transactions" key="4">
                      <Tabs defaultActiveKey="1">
                        <TabPane tab="Sent" key="1">
                          <Table
                            columns={SentTransactionsColumns}
                            dataSource={this.state.sentTransactionsData}
                            size="small"
                            pagination={false}
                          />
                        </TabPane>
                        <TabPane tab="Received" key="2">
                          <Table
                            columns={ReceivedTransactionsColumns}
                            dataSource={this.state.receivedTransactionsData}
                            size="small"
                            pagination={false}
                          />
                        </TabPane>
                      </Tabs>
                    </TabPane>
                  </Tabs>
                </div>
              </Col>
              <Col md="4" lg="4" xl="4">
                <div className="profile-card">
                  <div className="image-container">
                    <img alt="user" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/profile-sample5.jpg" />
                  </div>
                  <div className="profile-name">
                    <div>{this.state.userName}</div>
                  </div>
                  <div className="profile-email">
                    <div>{this.state.userEmail}</div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default UserProfile;
