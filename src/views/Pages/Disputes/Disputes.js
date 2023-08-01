import React, { Component } from "react";
//import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { Table, Button } from "antd";
import { Link } from "react-router-dom";
import "antd/dist/antd.css";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";
//import { debounce } from "lodash";

class Disputes extends Component {
  state = {
    disputeData: null
  };

  componentDidMount() {
    this.getDisputes();
    this.getUser();
  }

  getUser = () => {
    const isLoggedIn = !!localStorage.getItem("token");
    if (!isLoggedIn) {
      this.props.history.push("/login");
    }
  };

  getDisputes() {
    axios
    .get(`${window.$APP_URL}/api/swap-service/disputes`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => {
      let disputeData = [];
      let disputedata = res.data.data;
      disputedata.map((item, index) => {
        let disputeObject = {};
        disputeObject.key = index;
        disputeObject.id = item.id;
        disputeObject.name = item.username;
        disputeObject.against = item.against_username;
        disputeObject.service = item.service_name;
        disputeObject.reason = item.reason;
        disputeObject.Editing = false;
        disputeObject.status = item.status;
        disputeObject.comment = item.comments;
        disputeObject.description = item.dispute_description;
        disputeData.push(disputeObject);
      });
      this.setState({
        disputeData: disputeData
      });
    });
    
  }

  handleDoubleClick = (key) => {
    let disputeData = [...this.state.disputeData];
    disputeData[key].Editing = true;
    this.setState({
        disputeData
    });
  };

  changeStatus = (status, id) => {
    axios
      .put(
        `${window.$APP_URL}/api/swap-service/disputes/${id}`,
        { status: status },{
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
      )
      .then(res => {
        this.getDisputes();
      });
  };

  handleBlur = key => {
    let disputeData = [...this.state.disputeData];
    disputeData[key].Editing = false;
    this.setState({
        disputeData
    });
  };

  handleInput = (event, text) => {
    let target = event.target;
    let disputeData = [...this.state.disputeData];
    disputeData[text.key].comment = target.value;

    let propertyname = "comments";
    let propertyvalue = target.value;

    let payload = {};
    payload.id = text.id;
    payload[propertyname] = propertyvalue;

    axios
      .put(`${window.$APP_URL}/api/swap-service/update-dispute-comment`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(response => {

      })
      .catch(error => {
        console.log(error);
      });

    this.setState({
      disputeData
    });
  };

  render() {
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "Against",
        dataIndex: "against",
        key: "against"
      },
      {
        title: "Service",
        dataIndex: "service",
        key: "service"
      },
      {
        title: "Reason",
        dataIndex: "reason",
        key: "reason"
      },
      {
        width: "20%",
        title: "Description",
        dataIndex: "description",
        key: "description"
      },
      {
        width: "10%",
        title: "Status",
        dataIndex: "status",
        key: "status"
      },
      {
        title: "Comments",
        key: "comments",
        render: text => {
            let element;
            if (text.Editing === false) {
              element = (
                <div
                  className="text-div"
                  onDoubleClick={() =>
                    this.handleDoubleClick(text.key)
                  }
                >
                  {text.comment.substring(0, 60)}
                </div>
              );
            } else {
              element = (
                <div onBlur={() => this.handleBlur(text.key)}>
                  <DebounceInput
                    debounceTimeout={2000}
                    className="editable-input"
                    type="text"
                    name="comment"
                    value={text.comment}
                    autoFocus
                    onChange={e => {
                      this.handleInput(e, text);
                    }}
                  />
                </div>
              );
            }
            return <div> {element} </div>;
          }
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
                  onClick={() => this.changeStatus("resolved", text.id)}
                >
                  Resolve
                </Button>
                <Button
                  type="danger"
                  size="small"
                  ghost
                  onClick={() => this.changeStatus("rejected", text.id)}
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
            <Table
              columns={columns}
              dataSource={this.state.disputeData}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Disputes;
