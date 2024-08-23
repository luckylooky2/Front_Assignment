import PropTypes from 'prop-types';
import React from 'react';

import { getNotificationStyles } from './styles';

const ResultMessage = ({ dragResults }) => {
  const styles = getNotificationStyles;

  if (dragResults.length === 0) {
    return;
  }

  return (
    <div className={styles.notificationContainer}>
      {dragResults.map(({ result, visible, id }, index) => {
        const message = result ? '✅ 적용되었습니다' : '❌ 실패하였습니다';
        return (
          <div className={styles.result(result, visible)} key={id + index}>
            <span className={styles.message}>{message}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ResultMessage;

ResultMessage.propTypes = {
  dragResults: PropTypes.array,
};
