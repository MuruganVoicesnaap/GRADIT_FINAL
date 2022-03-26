import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
const app_url = state => {
  console.log(state);
};
const mapStatetoProps = state => ({
  state: state,
});
export default connect(mapStatetoProps, null)(app_url);
