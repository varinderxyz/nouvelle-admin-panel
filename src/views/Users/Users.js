import React, { Component } from "react";
//import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { Table, Button } from "antd";
import axios from "axios";
import "antd/dist/antd.css";
//import { debounce } from "lodash";

import { DebounceInput } from "react-debounce-input";

class Users extends Component {
  state = {
    usersData: null
  };

  componentDidMount() {
    this.getUserData();
    this.getUser();
  }

  getUser = () => {
    const isLoggedIn = !!localStorage.getItem("token");
    if (!isLoggedIn) {
      this.props.history.push("/login");
    }
  };

  handleDoubleClick = (key, column) => {
    let usersData = [...this.state.usersData];
    usersData[key][column] = true;
    this.setState({
      usersData
    });
  };

  handleBlur = key => {
    let usersData = [...this.state.usersData];
    usersData[key].nameEditing = false;
    usersData[key].emailEditing = false;
    usersData[key].addressEditing = false;
    usersData[key].telephoneEditing = false;
    this.setState({
      usersData
    });
  };

  handleInput = (event, text) => {
    let target = event.target;
    let usersData = [...this.state.usersData];
    usersData[text.key][target.name] = target.value;

    let propertyname = target.name;
    let propertyvalue = target.value;

    let payload = {};
    payload.id = text.id;
    payload[propertyname] = propertyvalue;

    axios
      .post("https://staging-seesaw.herokuapp.com/api/user/edit", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(response => {})
      .catch(error => {
        console.log(error);
      });

    this.setState({
      usersData
    });
  };

  getUserData = () => {
    axios
      .get(`https://staging-seesaw.herokuapp.com/api/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        let userdata = res.data.data.filter(item => item.role !== "admin");
        let usersData = [];
        userdata.map((item, index) => {
          let userObject = {};
          userObject.key = index;
          userObject.id = item.id;
          userObject.nameEditing = false;
          userObject.emailEditing = false;
          userObject.addressEditing = false;
          userObject.telephoneEditing = false;
          userObject.name = item.name;
          userObject.email = item.email;
          userObject.address = item.geo_address;
          userObject.telephone = item.phone;
          usersData.push(userObject);
        });
        this.setState({
          usersData: usersData
        });
      });
  };

  handleDelete = id => {
    axios
      .delete(`https://staging-seesaw.herokuapp.com/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(response => {
        if (response.data.status_code === "200") {
          this.getUserData();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const userDataColumns = [
      {
        width: "20%",
        title: "Name",
        key: "name",
        render: text => {
          let element;
          if (text.nameEditing === false) {
            element = (
              <div
                className="text-div"
                onDoubleClick={() =>
                  this.handleDoubleClick(text.key, "nameEditing")
                }
              >
                {text.name.substring(0, 40)}
              </div>
            );
          } else {
            element = (
              <div onBlur={() => this.handleBlur(text.key)}>
                <DebounceInput
                  className="editable-input"
                  debounceTimeout={2000}
                  type="text"
                  name="name"
                  value={text.name}
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
        width: "20%",
        title: "Email",
        key: "email",
        render: text => {
          let element;
          if (text.emailEditing === false) {
            element = (
              <div
                className="text-div"
                onDoubleClick={() =>
                  this.handleDoubleClick(text.key, "emailEditing")
                }
              >
                {text.email.substring(0, 60)}
              </div>
            );
          } else {
            element = (
              <div onBlur={() => this.handleBlur(text.key)}>
                <DebounceInput
                  debounceTimeout={2000}
                  className="editable-input"
                  type="text"
                  name="email"
                  value={text.email}
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
        width: "30%",
        title: "Address",
        key: "address",
        render: text => {
          let element;
          if (text.addressEditing === false) {
            element = (
              <div
                className="text-div"
                onDoubleClick={() =>
                  this.handleDoubleClick(text.key, "addressEditing")
                }
              >
                {text.address.substring(0, 70)}
              </div>
            );
          } else {
            element = (
              <div onBlur={() => this.handleBlur(text.key)}>
                <DebounceInput
                  debounceTimeout={2000}
                  type="text"
                  className="editable-input"
                  name="address"
                  value={text.address}
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
        width: "15%",
        title: "Telephone",
        key: "telephone",
        render: text => {
          let element;
          if (text.telephoneEditing === false) {
            element = (
              <div
                className="text-div"
                onDoubleClick={() =>
                  this.handleDoubleClick(text.key, "telephoneEditing")
                }
              >
                {text.telephone.substring(0, 30)}
              </div>
            );
          } else {
            element = (
              <div onBlur={() => this.handleBlur(text.key)}>
                <DebounceInput
                  debounceTimeout={2000}
                  type="text"
                  name="telephone"
                  className="editable-input"
                  value={text.telephone}
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
      ,
      {
        title: "Actions",
        align: "center",
        key: "actions",
        width:"15%",
        render: text => {
          return (
            <div className="actions-button-container">
              <Button
                type="danger"
                size="small"
                ghost
                onClick={() => this.handleDelete(text.id)}
              >
                Delete
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
              columns={userDataColumns}
              dataSource={this.state.usersData}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Users;
