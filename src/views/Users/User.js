import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import axios from 'axios';

import usersData from './UsersData'

class User extends Component {
  state = {
    users: null
  }

  componentDidMount() {
    this.getUserData();
    this.getUser();
  }

  getUser = () => {
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) {
      this.props.history.push('/login');
    }
    
  }

  getUserData = () => {
    axios
      .get(
        `https://staging-seesaw.herokuapp.com/api/users`,
      )
      .then(res => {
        console.log(res);
        /*this.setState({userWalletBalance : `$${res.data.wallet_balance.wallet_balance}`})
        let userObject = res.data.user[0];
        this.setState({
          userName: userObject.name,
          userEmail: userObject.email,
          userAddress: userObject.geo_address,
          zipCode: userObject.zip_code,
          willingToTravel: `${userObject.willing_to_travel} km`,
          userTelephone: userObject.phone
        })*/
      });
  }
  

  render() {

    const user = usersData.find( user => user.id.toString() === this.props.match.params.id)

    const userDetails = user ? Object.entries(user) : [['id', (<span><i className="text-muted icon-ban"></i> Not found</span>)]]

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>User id: {this.props.match.params.id}</strong>
              </CardHeader>
              <CardBody>
                  <Table responsive striped hover>
                    <tbody>
                      {
                        userDetails.map(([key, value]) => {
                          return (
                            <tr key={key}>
                              <td>{`${key}:`}</td>
                              <td><strong>{value}</strong></td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default User;
