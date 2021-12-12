import { shallow } from 'enzyme';
import StatusLabel from '.';
import { ApplyStatus, StatusType } from '../../backend/entity/post';

describe('StatusLabel', () => {
  it('should render PENDING label', () => {
    shallow(<StatusLabel status={ApplyStatus.PENDING} />);
  });
  it('should render ACCEPTED label', () => {
    shallow(<StatusLabel status={ApplyStatus.ACCEPTED} />);
  });
  it('should render DECLINED label', () => {
    shallow(<StatusLabel status={ApplyStatus.DECLINED} />);
  });
});
