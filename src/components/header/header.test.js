import { shallow } from 'enzyme'
import Header from './header'

describe('header', () => {
  let subject

  test('renders two images', () => {
    subject = shallow(<Header />)
    expect(subject.find('img').length).toEqual(2)
  })
})
