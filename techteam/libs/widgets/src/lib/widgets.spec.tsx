import { render } from '@testing-library/react';

import Widgets from './widgets';

describe('Widgets', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Widgets />);
    expect(baseElement).toBeTruthy();
  });
});
