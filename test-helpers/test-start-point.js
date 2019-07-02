import {configure} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import React from 'react'
import "regenerator-runtime/runtime";

window.React = React
configure({ adapter: new Adapter() })