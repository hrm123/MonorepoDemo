import styles from './widgets.module.scss';

/* eslint-disable-next-line */
export interface WidgetsProps {}

export function Widgets(props: WidgetsProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Widgets!</h1>
    </div>
  );
}

export default Widgets;
