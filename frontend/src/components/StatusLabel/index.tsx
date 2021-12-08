import './index.scss';

export enum StatusType {
  PENDING = '승인 대기 중',
  ACCEPTED = '승인됨',
  DECLINED = '거절됨',
}

const StatusLabel = (status: StatusType) => {
  switch (status) {
    case StatusType.PENDING:
      return <span className="pending status-label">{StatusType.PENDING}</span>;
    case StatusType.ACCEPTED:
      return (
        <span className="accepted status-label">{StatusType.ACCEPTED}</span>
      );
    case StatusType.DECLINED:
      return (
        <span className="declined status-label">{StatusType.DECLINED}</span>
      );
    default:
      return null;
  }
};

export default StatusLabel;
