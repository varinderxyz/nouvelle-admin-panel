import React, { Component } from "react";
import { Link } from "react-router-dom";
//import { Bar, Line } from "react-chartjs-2";
import { Table, Input, Button, Icon } from "antd";
import Highlighter from "react-highlight-words";
import "antd/dist/antd.css";
import axios from "axios";
import { Col, Row } from "reactstrap";
//import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";
//import { getStyle, hexToRgba } from "@coreui/coreui/dist/js/coreui-utilities";
//import UserProfile from "../Pages/UserProfile/UserProfile";

//const Widget03 = lazy(() => import("../../views/Widgets/Widget03"));

//const brandPrimary = getStyle("--primary");
//const brandSuccess = getStyle("--success");
//const brandInfo = getStyle("--info");
//const brandWarning = getStyle("--warning");
//const brandDanger = getStyle("--danger");



class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
      searchText: "",
      data: null,
      payment_method: null
    };
  }

  componentDidMount() {
    this.getWithdrawalData();
    this.getUser();
  }

  getUser = () => {
    const isLoggedIn = !!localStorage.getItem("token");
    if (!isLoggedIn) {
      this.props.history.push("/login");
    }
  };

  getWithdrawalData() {
    axios
      .get(
        `${window.$APP_URL}/api/withdrawals`
      )
      .then(res => {
        let min=40000; 
        let max=50000;  
        let random = Math.floor(Math.random() * (+max - +min)) + +min;  
        let tableData = [];
        res.data.all_withrawal_request.map((item, index) => {
          let singleObject = {};
          singleObject.key = index + 1;
          singleObject.id = item.user_id;
          singleObject.username =  item.name;
          singleObject.email =  item.email;
          singleObject.amount = `${item.amount}`;
          singleObject.paymentmethod =  item.payment_method_type;
          singleObject.payment_method_value = item.payment_method_value;
          singleObject.balance =  `$${random}`;
          singleObject.requestdate = item.created_at;
          singleObject.status =  item.status;
          singleObject.user_id = item.user_id;
          tableData.push(singleObject);

      })
        this.setState({data : tableData});
      });

  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    )
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected
    });
  }

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  changeStatus = (status, id) => {
    axios
      .put(
        `${window.$APP_URL}/api/withdrawal/${id}`,
        { status: status }
      )
      .then(res => {
        this.getWithdrawalData();
      });
  };

  render() {
    const columns = [
      {
        title: "Username",
        key: "username",
        render: text => {
          return <Link to={`profile/${text.user_id}`}>{text.username}</Link>;
        }
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        ...this.getColumnSearchProps("email")
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        ...this.getColumnSearchProps("amount")
      },
      {
        title: "Payment Method",
        dataIndex: "paymentmethod",
        key: "paymentmethod",
        ...this.getColumnSearchProps("paymentmethod")
      },
      {
        title: "Payment Method Value",
        dataIndex: "payment_method_value",
        key: "payment_method_value",
        ...this.getColumnSearchProps("payment_method_value")
        
      },
      {
        title: "Wallet Balance",
        dataIndex: "balance",
        key: "balance",
        ...this.getColumnSearchProps("balance")
      },
      {
        title: "Request Date",
        dataIndex: "requestdate",
        key: "requestdate",
        ...this.getColumnSearchProps("requestdate")
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        ...this.getColumnSearchProps("status")
      },
      {
        title: "Actions",
        key: "actions",
        render: text => {
          return (
            <div className="actions-button-container">
              <Button
                type="primary"
                size="small"
                ghost
                onClick={() => this.changeStatus("approved", text.user_id)}
              >
                Approve
              </Button>
              <Button
                type="danger"
                size="small"
                ghost
                onClick={() => this.changeStatus("rejected", text.user_id)}
              >
                Reject
              </Button>
            </div>
          );
        }
      }
    ];

    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Table columns={columns} dataSource={this.state.data} scroll={{ x: 400 }} />;
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
