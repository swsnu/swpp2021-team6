import { ApplyStatus, StatusType } from '../../backend/entity/post';
import './index.scss';

const StatusLabel = ({ status }: { status: StatusType | null }) => {
  switch (status) {
    case ApplyStatus.PENDING:
      return (
        <span className="pending status-label">{ApplyStatus.PENDING}</span>
      );
    case ApplyStatus.ACCEPTED:
      return (
        <span className="accepted status-label">{ApplyStatus.ACCEPTED}</span>
      );
    case ApplyStatus.DECLINED:
      return (
        <span className="declined status-label">{ApplyStatus.DECLINED}</span>
      );
    default:
      return null;
  }
};

export default StatusLabel;
